"""Model loading, input validation and prediction. Kept free of web-framework code so it is easy to test."""
import json
import math
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from schemas import SCHEMAS

MODEL_DIR = Path(os.getenv("MODEL_PATH") or Path(__file__).parent / "models")
_cache = {}


class ValidationFailed(Exception):
    def __init__(self, errors):
        super().__init__("Invalid input")
        self.errors = errors


class ModelUnavailable(Exception):
    pass


def load_model(disease_id):
    if disease_id not in _cache:
        path = MODEL_DIR / f"{disease_id}.joblib"
        if not path.exists():
            raise ModelUnavailable(f"No trained model found for '{disease_id}'. Run training/train_{disease_id}.py first.")
        _cache[disease_id] = joblib.load(path)
    return _cache[disease_id]


def _to_number(value):
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    if isinstance(value, (int, float)):
        number = float(value)
    elif isinstance(value, str) and value.strip() != "":
        try:
            number = float(value.strip())
        except ValueError:
            return None
    else:
        return None
    return number if math.isfinite(number) else None


def validate_inputs(disease_id, raw):
    """Return (clean_values, errors). Every feature in the schema is required."""
    clean, errors = {}, {}
    for feature in SCHEMAS[disease_id]["features"]:
        key = feature["key"]
        if key not in raw or raw[key] in (None, ""):
            errors[key] = f"{feature['label']} is required."
            continue
        value = raw[key]
        if feature["type"] == "boolean":
            if value in (True, 1, "1", "true", "True"):
                clean[key] = 1
            elif value in (False, 0, "0", "false", "False"):
                clean[key] = 0
            else:
                errors[key] = f"{feature['label']} must be yes or no."
            continue
        number = _to_number(value)
        if number is None:
            errors[key] = f"{feature['label']} must be a number."
        elif feature["type"] == "select":
            allowed = [float(o["value"]) for o in feature["options"]]
            if not any(abs(number - a) < 1e-9 for a in allowed):
                errors[key] = f"Choose one of the listed options for {feature['label']}."
            else:
                clean[key] = number
        elif number < feature["min"] or number > feature["max"]:
            errors[key] = f"{feature['label']} must be between {feature['min']} and {feature['max']}."
        else:
            clean[key] = number
    return clean, errors


def risk_level(probability):
    if probability < 35:
        return "Low"
    if probability < 65:
        return "Moderate"
    return "High"


def explain(bundle, disease_id, row):
    """Per-feature contribution of a logistic regression: coefficient x standardised value."""
    pipeline = bundle["pipeline"]
    scaled = pipeline.named_steps["scaler"].transform(pipeline.named_steps["imputer"].transform(row))
    contributions = pipeline.named_steps["model"].coef_[0] * scaled[0]
    labels = {f["key"]: f["label"] for f in SCHEMAS[disease_id]["features"]}
    order = np.argsort(-np.abs(contributions))[:4]
    factors = [{
        "feature": bundle["features"][i],
        "label": labels[bundle["features"][i]],
        "direction": "increases" if contributions[i] > 0 else "decreases",
        "impact": round(float(abs(contributions[i])), 2),
    } for i in order if abs(contributions[i]) > 0.05]
    up = [f["label"] for f in factors if f["direction"] == "increases"]
    down = [f["label"] for f in factors if f["direction"] == "decreases"]
    parts = []
    if up:
        parts.append("The values that most raised the estimate were: " + ", ".join(up) + ".")
    if down:
        parts.append("The values that most lowered it were: " + ", ".join(down) + ".")
    return factors, " ".join(parts) or "No single value stood out in this estimate."


def predict(disease_id, raw_inputs):
    if disease_id not in SCHEMAS:
        raise KeyError(disease_id)
    clean, errors = validate_inputs(disease_id, raw_inputs)
    if errors:
        raise ValidationFailed(errors)
    bundle = load_model(disease_id)
    row = pd.DataFrame([[clean[k] for k in bundle["features"]]], columns=bundle["features"], dtype=float)
    probability = round(float(bundle["pipeline"].predict_proba(row)[0][1]) * 100, 1)
    factors, explanation = explain(bundle, disease_id, row)
    return {
        "prediction": "Higher Risk" if probability >= 50 else "Lower Risk",
        "probability": probability,
        "riskLevel": risk_level(probability),
        "explanation": explanation,
        "factors": factors,
        "inputs": clean,
    }


def model_info():
    """Metadata for the admin 'Models' view: read from the small JSON file written at training time."""
    info = []
    for disease_id, spec in SCHEMAS.items():
        meta_path = MODEL_DIR / f"{disease_id}.json"
        entry = {"id": disease_id, "name": spec["name"], "dataset": spec["dataset"], "trained": meta_path.exists()}
        if meta_path.exists():
            entry.update(json.loads(meta_path.read_text()))
        info.append(entry)
    return info

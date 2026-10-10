"""Shared training routine. Every train_<disease>.py calls train(<id>) and nothing else."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from schemas import SCHEMAS  # noqa: E402

DATA_DIR = ROOT / "data"
MODEL_DIR = ROOT / "models"


def resolve_column(df, candidates):
    """Find a column by name, ignoring case and surrounding spaces."""
    candidates = [candidates] if isinstance(candidates, str) else candidates
    lookup = {str(c).strip().lower(): c for c in df.columns}
    for name in candidates:
        if name.strip().lower() in lookup:
            return lookup[name.strip().lower()]
    raise SystemExit(f"Could not find any of {candidates} in the CSV.\nColumns present: {list(df.columns)}\n"
                     f"Fix the 'column' name in schemas.py to match your file.")


def normalise(value):
    text = str(value).strip().lower()
    try:
        number = float(text)
        return str(int(number)) if number.is_integer() else str(number)
    except ValueError:
        return text


def build_feature(df, feature, zero_is_missing):
    series = df[resolve_column(df, feature["column"])]
    if feature.get("csv_map"):
        mapped = series.map(lambda v: feature["csv_map"].get(normalise(v)))
        return pd.to_numeric(mapped, errors="coerce")
    values = pd.to_numeric(series.astype(str).str.strip(), errors="coerce")
    if feature["key"] in zero_is_missing:
        values = values.where(values != 0)  # in this dataset 0 means "not measured"
    return values


def build_target(df, target):
    series = df[resolve_column(df, target["column"])]
    positive = {normalise(p) for p in target["positive"]}
    return series.map(lambda v: 1 if normalise(v) in positive else 0)


def train(disease_id):
    spec = SCHEMAS[disease_id]
    path = DATA_DIR / spec["csv"]
    if not path.exists():
        raise SystemExit(f"Dataset not found: {path}\nDownload the '{spec['dataset']}' CSV and save it as data/{spec['csv']}.")

    df = pd.read_csv(path, **spec.get("read_kwargs", {}))
    df.columns = [str(c).strip() for c in df.columns]
    zero_is_missing = set(spec.get("zero_is_missing", []))

    X = pd.DataFrame({f["key"]: build_feature(df, f, zero_is_missing) for f in spec["features"]})
    y = build_target(df, spec["target"])
    keep = X.notna().any(axis=1)  # drop rows where nothing could be parsed
    X, y = X[keep], y[keep]
    if y.nunique() < 2:
        raise SystemExit("The target column has only one class. Check the 'positive' labels in schemas.py.")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])
    pipeline.fit(X_train, y_train)

    predicted = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)[:, 1]
    metrics = {
        "accuracy": round(accuracy_score(y_test, predicted), 3),
        "precision": round(precision_score(y_test, predicted, zero_division=0), 3),
        "recall": round(recall_score(y_test, predicted, zero_division=0), 3),
        "f1": round(f1_score(y_test, predicted, zero_division=0), 3),
        "rocAuc": round(roc_auc_score(y_test, probabilities), 3),
    }
    meta = {
        "modelType": "Logistic Regression",
        "dataset": spec["dataset"],
        "featureCount": len(spec["features"]),
        "trainingRows": int(len(X_train)),
        "testRows": int(len(X_test)),
        "positiveShare": round(float(y.mean()), 3),
        "trainedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "metrics": metrics,
        "metricsNote": "Measured on a held-out 20% test split of the public dataset. Not a measure of real-world clinical accuracy.",
    }

    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump({"pipeline": pipeline, "features": list(X.columns), **meta}, MODEL_DIR / f"{disease_id}.joblib")
    (MODEL_DIR / f"{disease_id}.json").write_text(json.dumps(meta, indent=2))
    print(f"{spec['name']}: trained on {len(X_train)} rows, tested on {len(X_test)}")
    print(json.dumps(metrics, indent=2))

"""
DEVELOPMENT-ONLY placeholder data.

Creates SYNTHETIC CSV files in data/ for conditions whose real dataset is missing, so you can train
every model and test the whole app end to end. It never overwrites an existing file.

The numbers are random (with a weak built-in signal). Predictions and metrics from models trained on
this data are MEANINGLESS. Replace these files with the real public datasets before showing the
project to anyone, and do not quote their metrics.

Usage (from the ml-service folder):
    python make_dev_data.py              # only conditions with no CSV yet
    python make_dev_data.py kidney lung  # only the named conditions
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd

from schemas import SCHEMAS

DATA_DIR = Path(__file__).parent / "data"
ROWS = 600
rng = np.random.default_rng(42)


def first(column):
    return column if isinstance(column, str) else column[0]


def make_feature(feature, y, strength):
    """One column: values look plausible for the feature and drift slightly with the target."""
    if feature["type"] == "number":
        lo, hi = feature["min"], feature["max"]
        centre, spread = lo + (hi - lo) * 0.4, (hi - lo) * 0.15
        shift = (rng.random() - 0.3) * strength * spread * 2  # some features matter more than others
        values = rng.normal(centre + y * shift, spread, len(y)).clip(lo, hi)
        return np.round(values, 3)
    if feature["type"] == "boolean":
        p = np.clip(0.3 + y * strength * 0.12 * rng.random() * 2, 0.05, 0.95)
        return (rng.random(len(y)) < p).astype(int)
    options = [o["value"] for o in feature["options"]]
    return rng.choice(options, len(y))


def to_csv_value(feature, values):
    """Write values the way the real dataset would, undoing csv_map where the schema uses one."""
    mapping = feature.get("csv_map")
    if not mapping:
        return values
    wanted = {}
    for text, number in mapping.items():  # prefer the first spelling listed for each number
        wanted.setdefault(number, text)
    out = [wanted[int(v)] for v in values]
    if feature["key"] in ("GENDER", "Gender", "sex"):
        out = ["M" if v in ("m", "male") else "F" for v in out]
    elif mapping.get("2") == 1:  # survey datasets code NO=1, YES=2
        out = [int(v) for v in out]
    return out


def build(disease_id):
    spec = SCHEMAS[disease_id]
    y = (rng.random(ROWS) < 0.4).astype(int)
    columns = {}
    for feature in spec["features"]:
        columns[first(feature["column"])] = to_csv_value(feature, make_feature(feature, y, strength=1.0))
    target = spec["target"]
    positive = target["positive"][0]
    if isinstance(positive, str):
        negative = {"ckd": "notckd", "yes": "no", "p": "N", "hypothyroid": "negative"}.get(positive.lower(), "no")
        positive = {"p": "P"}.get(positive.lower(), positive)
        columns[first(target["column"])] = np.where(y == 1, positive, negative)
    else:
        columns[first(target["column"])] = y
    return pd.DataFrame(columns)


if __name__ == "__main__":
    DATA_DIR.mkdir(exist_ok=True)
    requested = sys.argv[1:] or list(SCHEMAS)
    for disease_id in requested:
        if disease_id not in SCHEMAS:
            print(f"Unknown condition '{disease_id}'. Choose from: {', '.join(SCHEMAS)}")
            continue
        path = DATA_DIR / SCHEMAS[disease_id]["csv"]
        if path.exists():
            print(f"Keeping existing {path.name}")
            continue
        if "header" in SCHEMAS[disease_id].get("read_kwargs", {}):  # headerless public format (heart)
            build(disease_id)[SCHEMAS[disease_id]["read_kwargs"]["names"]].to_csv(path, index=False, header=False)
        else:
            build(disease_id).to_csv(path, index=False)
        print(f"Created SYNTHETIC {path.name} (development only)")
    print("\nReminder: models trained on this data are for testing the app only. Use real datasets for anything you present.")

"""Train every model whose dataset is present in data/. Missing datasets are skipped with a message."""
from common import DATA_DIR, SCHEMAS, train

if __name__ == "__main__":
    for disease_id, spec in SCHEMAS.items():
        if not (DATA_DIR / spec["csv"]).exists():
            print(f"Skipping {spec['name']}: data/{spec['csv']} not found")
            continue
        train(disease_id)

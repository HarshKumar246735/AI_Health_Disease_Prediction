from sklearn.datasets import fetch_openml

for name, out in [("hypothyroid", "data/thyroid.csv"), ("chronic_kidney_disease", "data/kidney.csv")]:
    try:
        df = fetch_openml(name=name, as_frame=True, parser="auto").frame
        df = df.rename(columns={"class": "classification"}) if "kidney" in out else df
        df.to_csv(out, index=False)
        print("saved", out, list(df.columns))
    except Exception as e:
        print("FAILED", name, e)
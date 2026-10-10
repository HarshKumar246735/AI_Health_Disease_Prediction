# Datasets and training

Datasets are **not bundled**. Download each CSV, save it under `ml-service/data/` with the file name below, then run the matching `training/train_<id>.py` (or `train_all.py`).

| Condition | File | Dataset | Target column |
|---|---|---|---|
| Heart | heart.csv | UCI Heart Disease, Cleveland (`processed.cleveland.data`, no header row) | num (>0 = disease) |
| Diabetes | diabetes.csv | Pima Indians Diabetes Database | Outcome |
| Hypertension | hypertension.csv | Hypertension risk dataset (Framingham-derived, Kaggle) | Risk |
| Liver | liver.csv | Indian Liver Patient Dataset (ILPD, UCI) with a header row | Dataset (1 = disease) |
| Kidney | kidney.csv | UCI Chronic Kidney Disease | classification |
| Parkinson's | parkinsons.csv | UCI Parkinsons (voice measurements) | status |
| Thyroid | thyroid.csv | UCI Thyroid (hypothyroid) | binaryClass / Class |
| Anemia | anemia.csv | Anemia complete-blood-count dataset (Kaggle) | Result |
| Asthma | asthma.csv | Asthma disease dataset (Kaggle) | Diagnosis |
| Lung | lung.csv | Lung cancer survey dataset (Kaggle) | LUNG_CANCER |

## Check before you train

1. **Column names.** Open each CSV and compare with `ml-service/schemas.py`. If a name differs, edit the `column` value (a name or a list of candidates; matching ignores case and extra spaces). The training script stops with the list of columns it found if something is missing.
2. **Label coding.** `target.positive` lists the values counted as "has the condition". Adjust if your file uses different labels.
3. **Provenance.** Some Kaggle datasets are synthetic or small surveys (the asthma set is widely described as synthetic; the lung set is a small survey). That is fine for a portfolio demo, but state it honestly if you present metrics. The "Lung Disease" model is trained on a lung-cancer survey dataset.
4. **Hypertension.** Blood-pressure readings are deliberately excluded from the inputs because they define the outcome.

## What training does

Load CSV, trim column names, map each feature to numbers (yes/no and M/F via `csv_map`), treat zeros as missing where the dataset uses 0 for "not measured" (Pima), split 80/20 stratified, fit `Pipeline(SimpleImputer(median), StandardScaler, LogisticRegression)`, compute metrics on the test split and save `models/<id>.joblib` plus `models/<id>.json`.

## Adding a condition

1. Add an entry to `SCHEMAS` in `schemas.py` (features, CSV name, target).
2. Add `training/train_<id>.py` (three lines, copy an existing one).
3. Add an entry to `client/src/utils/diseases.js` (landing page and filters) and to `server/utils/insights.js` (general information).
4. Train, commit the model files, redeploy.

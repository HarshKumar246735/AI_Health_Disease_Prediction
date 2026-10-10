"""
Single source of truth for every supported condition.

Each entry describes:
  * the public form fields (what the client renders and the API validates)
  * how the training CSV maps onto those fields (used only by training scripts)

To add a condition: add an entry here, drop its CSV in ml-service/data/, add a tiny
training/train_<id>.py (3 lines), and run it. The API and the form pick it up automatically.

NOTE: column names below follow the public datasets named in each entry. Always open your
downloaded CSV and confirm the names; if they differ, change `column` (a name or list of
candidate names, matched case-insensitively after trimming spaces).
"""


def num(key, label, lo, hi, unit="", help="", step=1, column=None, csv_map=None):
    return {"key": key, "label": label, "type": "number", "min": lo, "max": hi, "step": step,
            "unit": unit, "help": help, "column": column or key, "csv_map": csv_map}


def sel(key, label, options, help="", column=None, csv_map=None):
    return {"key": key, "label": label, "type": "select", "options": [{"value": v, "label": l} for v, l in options],
            "help": help, "column": column or key, "csv_map": csv_map}


def flag(key, label, help="", column=None, csv_map=None):
    return {"key": key, "label": label, "type": "boolean", "help": help, "column": column or key, "csv_map": csv_map}


YES_NO = {"yes": 1, "no": 0, "y": 1, "n": 0, "true": 1, "false": 0, "1": 1, "0": 0}
ONE_TWO = {"2": 1, "1": 0}  # survey datasets that code NO=1, YES=2
SEX_MF = {"m": 1, "male": 1, "f": 0, "female": 0}

SCHEMAS = {
    "heart": {
        "name": "Heart Disease", "icon": "heart",
        "description": "Estimate cardiovascular risk from blood pressure, cholesterol, heart rate and related measures.",
        "dataset": "UCI Heart Disease (Cleveland subset)", "csv": "heart.csv",
        "read_kwargs": {"header": None, "na_values": "?", "names": [
            "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "num"]},
        "target": {"column": "num", "positive": [1, 2, 3, 4]},
        "features": [
            num("age", "Age", 20, 100, "years", column="age"),
            sel("sex", "Sex", [(1, "Male"), (0, "Female")], "Biological sex as recorded in the dataset.", column="sex"),
            sel("cp", "Chest pain type", [(1, "Typical angina"), (2, "Atypical angina"), (3, "Non-anginal pain"), (4, "No chest pain symptoms")],
                "The type of chest pain experienced, as classified by a clinician.", column="cp"),
            num("trestbps", "Resting blood pressure", 80, 220, "mm Hg", "Systolic blood pressure at rest.", column="trestbps"),
            num("chol", "Serum cholesterol", 100, 600, "mg/dl", "Total cholesterol from a blood test.", column="chol"),
            flag("fbs", "Fasting blood sugar above 120 mg/dl", "Based on a fasting blood glucose test.", column="fbs"),
            sel("restecg", "Resting ECG result", [(0, "Normal"), (1, "ST-T wave abnormality"), (2, "Left ventricular hypertrophy")],
                "Result of a resting electrocardiogram.", column="restecg"),
            num("thalach", "Maximum heart rate achieved", 60, 220, "bpm", "Highest heart rate reached during an exercise test.", column="thalach"),
            flag("exang", "Exercise-induced angina", "Chest pain brought on by exercise.", column="exang"),
            num("oldpeak", "ST depression (exercise vs rest)", 0, 7, "mm", "ECG measurement taken during an exercise test.", step=0.1, column="oldpeak"),
            sel("slope", "Slope of peak exercise ST segment", [(1, "Upsloping"), (2, "Flat"), (3, "Downsloping")],
                "Shape of the ECG ST segment at peak exercise.", column="slope"),
            sel("ca", "Major vessels coloured by fluoroscopy", [(0, "0"), (1, "1"), (2, "2"), (3, "3")],
                "Number of major vessels (0-3) seen in a fluoroscopy test.", column="ca"),
            sel("thal", "Thallium stress test result", [(3, "Normal"), (6, "Fixed defect"), (7, "Reversible defect")],
                "Result of a thallium heart scan.", column="thal"),
        ],
    },
    "diabetes": {
        "name": "Diabetes", "icon": "drop",
        "description": "Look at glucose, BMI, age and related indicators associated with diabetes risk.",
        "dataset": "Pima Indians Diabetes Database", "csv": "diabetes.csv",
        "zero_is_missing": ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"],
        "target": {"column": "Outcome", "positive": [1]},
        "features": [
            num("Pregnancies", "Number of pregnancies", 0, 20, "", "Enter 0 if not applicable."),
            num("Glucose", "Plasma glucose", 40, 300, "mg/dl", "Glucose after a 2-hour oral glucose tolerance test."),
            num("BloodPressure", "Diastolic blood pressure", 30, 140, "mm Hg", "The lower blood pressure number."),
            num("SkinThickness", "Triceps skin fold thickness", 5, 100, "mm", "Measured by a clinician with a caliper."),
            num("Insulin", "2-hour serum insulin", 10, 900, "mu U/ml", "From a blood test."),
            num("BMI", "Body mass index", 10, 70, "kg/m²", "Weight in kg divided by height in metres squared.", step=0.1),
            num("DiabetesPedigreeFunction", "Diabetes pedigree function", 0.05, 2.5, "", "A score reflecting family history of diabetes.", step=0.01),
            num("Age", "Age", 18, 100, "years"),
        ],
    },
    "hypertension": {
        "name": "Hypertension", "icon": "gauge",
        "description": "Understand how lifestyle and clinical measures relate to high blood pressure risk.",
        "dataset": "Hypertension risk dataset (Framingham-derived, Kaggle)", "csv": "hypertension.csv",
        "target": {"column": ["Risk", "risk"], "positive": [1, "yes"]},
        "features": [
            num("age", "Age", 18, 100, "years"),
            sel("male", "Sex", [(1, "Male"), (0, "Female")], "Biological sex as recorded in the dataset.", column=["male", "Sex_male"]),
            flag("currentSmoker", "Current smoker"),
            num("cigsPerDay", "Cigarettes per day", 0, 70, "", "Enter 0 if you do not smoke."),
            num("totChol", "Total cholesterol", 100, 600, "mg/dl"),
            num("BMI", "Body mass index", 12, 60, "kg/m²", step=0.1),
            num("heartRate", "Resting heart rate", 40, 150, "bpm"),
            num("glucose", "Blood glucose", 40, 400, "mg/dl"),
            flag("diabetes", "Diagnosed diabetes"),
        ],
        "note": "Blood pressure readings are deliberately not inputs, because they would define the outcome.",
    },
    "liver": {
        "name": "Liver Disease", "icon": "liver",
        "description": "Use common liver function markers to estimate the likelihood of liver problems.",
        "dataset": "Indian Liver Patient Dataset (ILPD)", "csv": "liver.csv",
        "read_kwargs": {},
        "target": {"column": "Dataset", "positive": [1]},
        "features": [
            num("Age", "Age", 4, 100, "years"),
            sel("Gender", "Sex", [(1, "Male"), (0, "Female")], column="Gender", csv_map=SEX_MF),
            num("Total_Bilirubin", "Total bilirubin", 0.1, 80, "mg/dl", "Liver function blood test.", step=0.1),
            num("Direct_Bilirubin", "Direct bilirubin", 0.05, 40, "mg/dl", step=0.1),
            num("Alkaline_Phosphotase", "Alkaline phosphatase", 20, 2500, "IU/L"),
            num("Alamine_Aminotransferase", "Alanine aminotransferase (ALT)", 5, 2500, "IU/L"),
            num("Aspartate_Aminotransferase", "Aspartate aminotransferase (AST)", 5, 5000, "IU/L"),
            num("Total_Protiens", "Total proteins", 2, 10, "g/dl", step=0.1),
            num("Albumin", "Albumin", 0.5, 6, "g/dl", step=0.1),
            num("Albumin_and_Globulin_Ratio", "Albumin to globulin ratio", 0.1, 3, "", step=0.01),
        ],
    },
    "kidney": {
        "name": "Kidney Disease", "icon": "kidney",
        "description": "Review blood and urine measures linked to chronic kidney disease risk.",
        "dataset": "UCI Chronic Kidney Disease", "csv": "kidney.csv",
        "target": {"column": "classification", "positive": ["ckd"]},
        "features": [
            num("age", "Age", 2, 100, "years"),
            num("bp", "Blood pressure", 40, 200, "mm Hg", "Diastolic blood pressure."),
            sel("sg", "Urine specific gravity", [(1.005, "1.005"), (1.010, "1.010"), (1.015, "1.015"), (1.020, "1.020"), (1.025, "1.025")],
                "From a urine test."),
            sel("al", "Urine albumin level", [(0, "0"), (1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")], "Urine dipstick scale from 0 to 5."),
            sel("su", "Urine sugar level", [(0, "0"), (1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")], "Urine dipstick scale from 0 to 5."),
            num("bgr", "Random blood glucose", 20, 500, "mg/dl"),
            num("bu", "Blood urea", 1, 400, "mg/dl"),
            num("sc", "Serum creatinine", 0.1, 80, "mg/dl", step=0.1),
            num("hemo", "Haemoglobin", 3, 18, "g/dl", step=0.1),
            flag("htn", "Hypertension", csv_map=YES_NO),
            flag("dm", "Diabetes mellitus", csv_map=YES_NO),
            flag("pe", "Pedal oedema (swollen feet or ankles)", csv_map=YES_NO),
        ],
    },
    "parkinsons": {
        "name": "Parkinson's Disease", "icon": "brain",
        "description": "Estimate risk from voice measurement features recorded in clinical studies.",
        "dataset": "UCI Parkinsons Dataset (voice measurements)", "csv": "parkinsons.csv",
        "target": {"column": "status", "positive": [1]},
        "note": "These are acoustic measurements from a clinical voice analysis, not something you can read from a symptom checklist.",
        "features": [
            num("MDVP:Fo(Hz)", "Average vocal fundamental frequency", 70, 280, "Hz", step=0.1),
            num("MDVP:Jitter(%)", "Jitter (variation in frequency)", 0, 0.05, "%", step=0.0001),
            num("MDVP:Shimmer", "Shimmer (variation in amplitude)", 0, 0.2, "", step=0.0001),
            num("NHR", "Noise-to-harmonics ratio", 0, 0.5, "", step=0.0001),
            num("HNR", "Harmonics-to-noise ratio", 5, 40, "dB", step=0.1),
            num("RPDE", "Recurrence period density entropy", 0.2, 0.8, "", step=0.001),
            num("DFA", "Detrended fluctuation analysis", 0.5, 0.9, "", step=0.001),
            num("spread1", "Nonlinear fundamental-frequency variation (spread1)", -9, -1, "", step=0.001),
            num("PPE", "Pitch period entropy", 0.01, 0.6, "", step=0.001),
        ],
    },
    "thyroid": {
        "name": "Thyroid Disease", "icon": "thyroid",
        "description": "Assess thyroid hormone levels and related information for risk estimation.",
        "dataset": "UCI Thyroid Disease (hypothyroid)", "csv": "thyroid.csv",
        "read_kwargs": {"na_values": "?"},
        "target": {"column": ["binaryClass", "Class", "class"], "positive": ["hypothyroid", "p"]},
        "features": [
            num("age", "Age", 1, 100, "years"),
            sel("sex", "Sex", [(1, "Male"), (0, "Female")], column="sex", csv_map=SEX_MF),
            num("TSH", "TSH", 0, 600, "mIU/L", "Thyroid-stimulating hormone.", step=0.01),
            num("T3", "T3", 0, 12, "nmol/L", step=0.01),
            num("TT4", "Total T4", 2, 450, "nmol/L"),
            num("T4U", "T4 uptake", 0.3, 2.5, "", step=0.01),
            num("FTI", "Free thyroxine index", 2, 400, ""),
        ],
    },
    "anemia": {
        "name": "Anemia", "icon": "drop",
        "description": "Use blood count values to estimate the likelihood of anemia.",
        "dataset": "Anemia dataset (complete blood count, Kaggle)", "csv": "anemia.csv",
        "target": {"column": "Result", "positive": [1]},
        "features": [
            sel("Gender", "Sex", [(0, "Male"), (1, "Female")]),
            num("Hemoglobin", "Haemoglobin", 3, 20, "g/dl", step=0.1),
            num("MCH", "Mean corpuscular haemoglobin (MCH)", 10, 40, "pg", step=0.1),
            num("MCHC", "Mean corpuscular haemoglobin concentration (MCHC)", 20, 40, "g/dl", step=0.1),
            num("MCV", "Mean corpuscular volume (MCV)", 50, 120, "fL", step=0.1),
        ],
    },
    "asthma": {
        "name": "Asthma", "icon": "wind",
        "description": "Consider symptoms, history and environment factors linked to asthma risk.",
        "dataset": "Asthma disease dataset (Kaggle)", "csv": "asthma.csv",
        "target": {"column": "Diagnosis", "positive": [1]},
        "features": [
            num("Age", "Age", 5, 90, "years"),
            sel("Gender", "Sex", [(0, "Male"), (1, "Female")]),
            num("BMI", "Body mass index", 10, 60, "kg/m²", step=0.1),
            flag("Smoking", "Smoker"),
            num("PollutionExposure", "Air pollution exposure", 0, 10, "", "Self-rated from 0 (none) to 10 (very high).", step=0.1),
            num("PollenExposure", "Pollen exposure", 0, 10, "", "Self-rated from 0 to 10.", step=0.1),
            num("DustExposure", "Dust exposure", 0, 10, "", "Self-rated from 0 to 10.", step=0.1),
            flag("PetAllergy", "Pet allergy"),
            flag("FamilyHistoryAsthma", "Family history of asthma"),
            flag("HistoryOfAllergies", "History of allergies"),
            flag("Eczema", "Eczema"),
            flag("HayFever", "Hay fever"),
            flag("Wheezing", "Wheezing"),
            flag("ShortnessOfBreath", "Shortness of breath"),
            flag("ChestTightness", "Chest tightness"),
            flag("Coughing", "Frequent coughing"),
        ],
    },
    "lung": {
        "name": "Lung Disease", "icon": "lungs",
        "description": "Review lifestyle and symptom factors associated with lung disease risk.",
        "dataset": "Lung cancer survey dataset (Kaggle)", "csv": "lung.csv",
        "target": {"column": "LUNG_CANCER", "positive": ["yes"]},
        "features": [
            sel("GENDER", "Sex", [(1, "Male"), (0, "Female")], csv_map=SEX_MF),
            num("AGE", "Age", 18, 100, "years"),
            flag("SMOKING", "Smoker", csv_map=ONE_TWO),
            flag("YELLOW_FINGERS", "Yellow fingers", csv_map=ONE_TWO),
            flag("CHRONIC DISEASE", "Chronic disease", csv_map=ONE_TWO),
            flag("FATIGUE", "Persistent fatigue", csv_map=ONE_TWO),
            flag("ALLERGY", "Allergy", csv_map=ONE_TWO),
            flag("WHEEZING", "Wheezing", csv_map=ONE_TWO),
            flag("ALCOHOL CONSUMING", "Regular alcohol consumption", csv_map=ONE_TWO),
            flag("COUGHING", "Frequent coughing", csv_map=ONE_TWO),
            flag("SHORTNESS OF BREATH", "Shortness of breath", csv_map=ONE_TWO),
            flag("CHEST PAIN", "Chest pain", csv_map=ONE_TWO),
        ],
    },
}

PUBLIC_FEATURE_KEYS = ("key", "label", "type", "min", "max", "step", "unit", "help", "options")


def public_schema(disease_id):
    spec = SCHEMAS[disease_id]
    features = [{k: f[k] for k in PUBLIC_FEATURE_KEYS if k in f and f[k] not in (None, "")} for f in spec["features"]]
    return {"id": disease_id, "name": spec["name"], "icon": spec["icon"], "description": spec["description"],
            "dataset": spec["dataset"], "note": spec.get("note"), "featureCount": len(features), "features": features}

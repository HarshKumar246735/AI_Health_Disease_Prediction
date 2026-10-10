H = {
    "data/diabetes.csv": "Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DiabetesPedigreeFunction,Age,Outcome",
    "data/liver.csv": "Age,Gender,Total_Bilirubin,Direct_Bilirubin,Alkaline_Phosphotase,Alamine_Aminotransferase,Aspartate_Aminotransferase,Total_Protiens,Albumin,Albumin_and_Globulin_Ratio,Dataset",
}
for path, header in H.items():
    text = open(path, encoding="utf-8").read()
    if not text.startswith(header.split(",")[0]):
        open(path, "w", encoding="utf-8").write(header + "\n" + text)
        print("header added:", path)
    else:
        print("already has header:", path)
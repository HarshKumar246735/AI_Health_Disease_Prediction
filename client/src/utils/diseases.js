// Catalog of supported conditions. Input-parameter counts are NOT stored here:
// they come from the ML service's feature schema (GET /api/diseases) in a later phase,
// so the forms always match the trained models.
export const DISEASES = [
  { id: 'heart', name: 'Heart Disease', icon: 'heart', description: 'Estimate cardiovascular risk from blood pressure, cholesterol, heart rate and related measures.' },
  { id: 'diabetes', name: 'Diabetes', icon: 'drop', description: 'Look at glucose, BMI, age and related indicators associated with diabetes risk.' },
  { id: 'hypertension', name: 'Hypertension', icon: 'gauge', description: 'Understand how lifestyle and clinical measures relate to high blood pressure risk.' },
  { id: 'liver', name: 'Liver Disease', icon: 'liver', description: 'Use common liver function markers to estimate the likelihood of liver problems.' },
  { id: 'kidney', name: 'Kidney Disease', icon: 'kidney', description: 'Review blood and urine measures linked to chronic kidney disease risk.' },
  { id: 'parkinsons', name: "Parkinson's Disease", icon: 'brain', description: 'Estimate risk from voice measurement features recorded in clinical studies.' },
  { id: 'thyroid', name: 'Thyroid Disease', icon: 'thyroid', description: 'Assess thyroid hormone levels and related information for risk estimation.' },
  { id: 'anemia', name: 'Anemia', icon: 'drop', description: 'Use blood count values to estimate the likelihood of anemia.' },
  { id: 'asthma', name: 'Asthma', icon: 'wind', description: 'Consider symptoms, history and environment factors linked to asthma risk.' },
  { id: 'lung', name: 'Lung Disease', icon: 'lungs', description: 'Review lifestyle and symptom factors associated with lung disease risk.' },
];

export const DISCLAIMER =
  'This platform provides educational risk estimates based on the information entered by the user. It is not a medical diagnosis and should not replace professional medical advice.';

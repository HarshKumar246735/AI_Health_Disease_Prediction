// General, educational information only. No medication advice, no personalised treatment.
const GENERAL = [
  'Regular health check-ups help you and your doctor notice changes early.',
  'Balanced nutrition, regular physical activity and enough sleep support overall health.',
  'Avoid tobacco and limit alcohol.',
];

const INSIGHTS = {
  heart: { title: 'Heart health', points: [
    'Aim for regular physical activity that you enjoy and can keep up.',
    'Favour vegetables, fruit, whole grains and healthy fats over heavily processed food.',
    'Avoid tobacco in every form, and limit salt and alcohol.',
    'Blood pressure and cholesterol are worth checking regularly, even when you feel well.',
    'Sleep and stress management also play a role in heart health.'] },
  diabetes: { title: 'Blood sugar and diabetes', points: [
    'Maintaining a healthy weight and staying active helps the body use insulin well.',
    'Choose whole grains and fibre-rich foods, and limit sugary drinks.',
    'Family history matters; mention it to your doctor.',
    'Regular screening is the only way to know your blood sugar status.',
    'Poor sleep and chronic stress can affect blood sugar.'] },
  hypertension: { title: 'Blood pressure', points: [
    'Reducing salt, staying active and keeping a healthy weight are widely recommended.',
    'Limit alcohol and avoid smoking.',
    'High blood pressure often has no symptoms, so regular measurement matters.',
    'Home blood pressure readings can be useful to share with your doctor.',
    'Stress management and good sleep support healthy blood pressure.'] },
  liver: { title: 'Liver health', points: [
    'Limit alcohol; heavy drinking is a major cause of liver damage.',
    'Maintain a healthy weight and stay physically active.',
    'Vaccination against hepatitis A and B is available; ask your doctor.',
    'Use supplements and herbal products only after speaking with a professional.',
    'Abnormal liver tests deserve follow-up with a clinician.'] },
  kidney: { title: 'Kidney health', points: [
    'Controlling blood pressure and blood sugar protects the kidneys.',
    'Stay hydrated and keep a balanced diet with limited salt.',
    'Ask a professional before regularly using over-the-counter pain relievers.',
    'Kidney problems can be silent, so routine blood and urine tests are important.',
    'Avoid smoking.'] },
  parkinsons: { title: "Parkinson's disease", points: [
    'Parkinson\'s is diagnosed by a neurologist through clinical examination, not by a score.',
    'Regular exercise supports balance, mobility and mood.',
    'Early symptoms can include tremor, stiffness, slowed movement or changes in handwriting or voice.',
    'If you notice such changes, speak with a doctor.',
    'Support from family, friends and community groups matters.'] },
  thyroid: { title: 'Thyroid health', points: [
    'The thyroid helps regulate energy and metabolism.',
    'Symptoms such as unusual fatigue, weight change or feeling too cold or warm can have many causes.',
    'Thyroid function is assessed with blood tests ordered by a clinician.',
    'Eat a varied diet; do not change supplements or iodine intake without advice.',
    'Regular check-ups help track changes over time.'] },
  anemia: { title: 'Blood health and anemia', points: [
    'Eating a varied diet with iron, folate and vitamin B12 sources supports healthy blood.',
    'Tiredness, pale skin or breathlessness can have many causes; a blood test is the way to check.',
    'Heavy periods, pregnancy and some conditions increase the chance of low iron.',
    'Do not start iron supplements without medical advice.',
    'Follow up on abnormal blood counts with a clinician.'] },
  asthma: { title: 'Lung health and asthma', points: [
    'Common triggers include dust, pollen, smoke, pets and cold air; noting your triggers can help.',
    'Avoid tobacco smoke, including second-hand smoke.',
    'Keep living spaces clean and well ventilated.',
    'Persistent wheezing, cough or breathlessness should be checked by a doctor.',
    'Regular activity supports lung fitness.'] },
  lung: { title: 'Lung health', points: [
    'Not smoking is the single most effective step for lung health.',
    'Avoid second-hand smoke, and reduce exposure to dust, fumes and air pollution where you can.',
    'A cough that lasts several weeks, chest pain or breathlessness should be checked by a doctor.',
    'Regular physical activity helps lung capacity.',
    'Ask your doctor about screening if you have a long history of smoking.'] },
};

exports.getInsights = (diseaseId) => ({ ...(INSIGHTS[diseaseId] || { title: 'General health', points: [] }), general: GENERAL });
exports.DISCLAIMER =
  'This platform provides educational risk estimates based on the information entered by the user. It is not a medical diagnosis and should not replace professional medical advice.';
exports.RESULT_NOTE =
  'The provided information indicates a higher or lower estimated risk. This is an educational prediction and not a diagnosis. Please consult a qualified healthcare professional for medical evaluation.';

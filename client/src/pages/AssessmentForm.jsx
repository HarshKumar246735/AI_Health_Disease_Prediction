import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import DynamicField from '../components/DynamicField.jsx';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Icon from '../components/Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import { getDisease } from '../services/diseaseService.js';
import { createPrediction } from '../services/predictionService.js';
import { friendlyError } from '../utils/errors.js';
import { DISCLAIMER } from '../utils/diseases.js';

const isBlank = (v) => v === undefined || v === '' || v === null;

function validate(features, values) {
  const errors = {};
  features.forEach((f) => {
    const v = values[f.key];
    if (f.type === 'boolean') return;
    if (isBlank(v)) { errors[f.key] = f.type === 'select' ? 'Choose an option.' : 'This field is required.'; return; }
    if (f.type === 'number') {
      const n = Number(v);
      if (!Number.isFinite(n)) errors[f.key] = 'Enter a number.';
      else if (n < f.min || n > f.max) errors[f.key] = `Enter a value between ${f.min} and ${f.max}.`;
    }
  });
  return errors;
}

export default function AssessmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => getDisease(id), [id]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const features = data?.disease.features || [];
  const completed = useMemo(
    () => features.filter((f) => f.type === 'boolean' || !isBlank(values[f.key])).length,
    [features, values]
  );

  const onChange = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(features, values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) {
      document.getElementById('assessment-form')?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const inputData = {};
    features.forEach((f) => { inputData[f.key] = f.type === 'boolean' ? Number(values[f.key] || 0) : Number(values[f.key]); });

    setSubmitting(true);
    try {
      const assessment = await createPrediction(id, inputData);
      toast.success('Assessment complete and saved to your history.');
      navigate(`/predictions/${assessment._id}`, { state: { justCompleted: true } });
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      setFormError(friendlyError(err, "We couldn't complete the assessment right now. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader
        title={loading ? 'Loading assessment' : `${data.disease.name} assessment`}
        subtitle="Enter your information as accurately as you can. Values from recent medical tests give the most meaningful estimate."
        action={<Link to="/assessment" className="btn btn--secondary">Change condition</Link>}
      />
      {loading ? (
        <div className="card form-card"><div className="form-grid">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={64} />)}</div></div>
      ) : (
        <form id="assessment-form" className="card form-card" onSubmit={onSubmit} noValidate>
          {data.disease.note && <p className="callout"><Icon name="info" size={18} /> {data.disease.note}</p>}
          {formError && <div className="form-alert" role="alert"><Icon name="alert" size={18} /> {formError}</div>}
          <div className="form-progress" aria-live="polite">
            <div className="form-progress__bar"><i style={{ width: `${(completed / features.length) * 100}%` }} /></div>
            <span>{completed} of {features.length} completed</span>
          </div>
          <div className="form-grid">
            {features.map((f) => (
              <DynamicField key={f.key} feature={f} value={values[f.key] ?? ''} error={errors[f.key]} onChange={onChange} />
            ))}
          </div>
          <footer className="form-foot">
            <p>{DISCLAIMER}</p>
            <Button type="submit" size="lg" loading={submitting}>Get risk estimate</Button>
          </footer>
        </form>
      )}
    </>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import RiskGauge from '../components/RiskGauge.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import Button from '../components/Button.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Icon from '../components/Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { useToast } from '../context/ToastContext.jsx';
import { deletePrediction, downloadReport, getPrediction } from '../services/predictionService.js';
import { downloadBlob, featureMap, formatDateTime, formatValue } from '../utils/format.js';
import { friendlyError } from '../utils/errors.js';
import { DISCLAIMER } from '../utils/diseases.js';

export default function PredictionDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => getPrediction(id), [id]);
  const [downloading, setDownloading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onDownload = async () => {
    setDownloading(true);
    try {
      downloadBlob(await downloadReport(id), `HealthPredict-${data.assessment.disease}.pdf`);
    } catch (err) {
      toast.error(friendlyError(err, "We couldn't create the report. Please try again."));
    } finally {
      setDownloading(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deletePrediction(id);
      toast.success('Assessment deleted.');
      navigate('/history', { replace: true });
    } catch (err) {
      toast.error(friendlyError(err));
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading) {
    return (
      <>
        <Skeleton height={48} width={320} />
        <div className="result-grid"><Skeleton height={320} radius={18} /><Skeleton height={320} radius={18} /></div>
      </>
    );
  }

  const { assessment: a, features, insights } = data;
  const byKey = featureMap(features);
  const fresh = state?.justCompleted;
  const wording = a.riskLevel === 'High' ? 'a higher estimated risk' : a.riskLevel === 'Moderate' ? 'a moderate estimated risk' : 'a lower estimated risk';

  return (
    <>
      <PageHeader
        title={fresh ? 'Assessment complete' : `${a.diseaseName} result`}
        subtitle={`${a.diseaseName} · ${formatDateTime(a.createdAt)}`}
        action={<span className="saved-chip"><Icon name="check" size={16} /> Saved to your history</span>}
      />

      <section className="card result-hero">
        <div className="result-hero__gauge">
          <RiskGauge value={a.probability} level={a.riskLevel} />
          <RiskBadge level={a.riskLevel} />
        </div>
        <div className="result-hero__copy">
          <h2>Estimated risk: {a.riskLevel}</h2>
          <p>
            Based on the information provided, the model estimates {wording} for {a.diseaseName.toLowerCase()} (about {a.probability}%).
            Please consult a qualified healthcare professional for medical evaluation.
          </p>
          <p className="result-hero__notice"><Icon name="shield" size={16} /> This result is an educational risk estimate and is not a medical diagnosis.</p>
          <div className="result-hero__actions">
            <Button onClick={onDownload} loading={downloading}>Download report</Button>
            <Button href="#details" variant="secondary">View details</Button>
            <Button to="/assessment" variant="secondary">New assessment</Button>
          </div>
        </div>
      </section>

      <div className="result-grid" id="details">
        <section className="card">
          <h3>What influenced this estimate</h3>
          <p className="muted">{a.explanation || 'No single value stood out.'}</p>
          {a.factors?.length > 0 && (
            <ul className="factors">
              {a.factors.map((f) => (
                <li key={f.feature}>
                  <span>{f.label}</span>
                  <span className={`factor factor--${f.direction}`}>{f.direction === 'increases' ? 'Raised estimate' : 'Lowered estimate'}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="muted small">Influence is calculated from this model only and does not show cause and effect.</p>
        </section>

        <section className="card">
          <h3>Information you entered</h3>
          <dl className="input-list">
            {Object.entries(a.inputData).map(([key, value]) => (
              <div key={key}><dt>{byKey[key]?.label || key}</dt><dd>{formatValue(byKey[key], value)}</dd></div>
            ))}
          </dl>
        </section>
      </div>

      <section className="card">
        <h3>{insights.title}: general information</h3>
        <ul className="bullets">
          {[...insights.points, ...insights.general].map((p) => <li key={p}>{p}</li>)}
        </ul>
        <p className="callout"><Icon name="info" size={18} /> {DISCLAIMER}</p>
      </section>

      <div className="detail-foot">
        <Link to="/history" className="btn btn--secondary">Back to history</Link>
        <Button variant="ghost" className="danger-text" onClick={() => setConfirmDelete(true)}>Delete this assessment</Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this assessment?"
        message="This permanently removes the result from your history. This can't be undone."
        loading={deleting}
        onConfirm={onDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

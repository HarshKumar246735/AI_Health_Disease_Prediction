import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import Icon from '../components/Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { getDisease } from '../services/diseaseService.js';
import { DISCLAIMER, DISEASES } from '../utils/diseases.js';

export default function Insights() {
  const [selected, setSelected] = useState(DISEASES[0].id);
  const { data, loading, error, reload } = useFetch(() => getDisease(selected), [selected]);

  return (
    <>
      <PageHeader title="Health insights" subtitle="General, educational information. It is not personal medical advice." />
      <div className="tabs" role="tablist" aria-label="Condition">
        {DISEASES.map((d) => (
          <button key={d.id} role="tab" type="button" aria-selected={selected === d.id} className={`tab ${selected === d.id ? 'is-active' : ''}`} onClick={() => setSelected(d.id)}>
            {d.name}
          </button>
        ))}
      </div>
      <section className="card" role="tabpanel">
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="skeleton-stack"><Skeleton height={28} width={220} />{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height={20} />)}</div>
        ) : (
          <>
            <h2 className="card__title">{data.insights.title}</h2>
            <ul className="bullets">{data.insights.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <h3 className="card__subtitle">For everyone</h3>
            <ul className="bullets">{data.insights.general.map((p) => <li key={p}>{p}</li>)}</ul>
          </>
        )}
        <p className="callout"><Icon name="info" size={18} /> {DISCLAIMER}</p>
      </section>
    </>
  );
}

import Icon from './Icon.jsx';
import Button from './Button.jsx';

// parameterCount is optional: it is shown only when the ML feature schema has been loaded.
export default function DiseaseCard({ disease, to, parameterCount }) {
  return (
    <article className="disease-card">
      <div className="disease-card__icon"><Icon name={disease.icon} size={24} /></div>
      <h3>{disease.name}</h3>
      <p>{disease.description}</p>
      <div className="disease-card__footer">
        {parameterCount ? <span className="disease-card__meta">{parameterCount} inputs</span> : <span />}
        <Button to={to} variant="ghost">Start assessment</Button>
      </div>
    </article>
  );
}

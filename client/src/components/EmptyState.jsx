import Icon from './Icon.jsx';

export default function EmptyState({ icon = 'file', title, text, action }) {
  return (
    <div className="state">
      <span className="state__icon"><Icon name={icon} size={26} /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

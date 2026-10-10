import Icon from './Icon.jsx';

const ICONS = { success: 'check', error: 'alert', info: 'info' };

export default function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <Icon name={ICONS[t.type]} size={18} />
          <p>{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Dismiss notification"><Icon name="x" size={16} /></button>
        </div>
      ))}
    </div>
  );
}

import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon"><Icon name="alert" size={26} /></span>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

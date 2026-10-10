import { useId } from 'react';
import Icon from './Icon.jsx';

// options: [{ value, label }]. `placeholder` renders a disabled first option.
export default function Select({ label, options, error, hint, placeholder, className = '', hideLabel = false, ...rest }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'field__label'}>{label}</label>
      <div className="field__control field__control--select">
        <select id={id} aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert"><Icon name="alert" size={14} /> {error}</p>
      ) : hint ? <p id={`${id}-hint`} className="field__hint">{hint}</p> : null}
    </div>
  );
}

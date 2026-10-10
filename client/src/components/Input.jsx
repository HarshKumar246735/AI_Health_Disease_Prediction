import { useId, useState } from 'react';
import Icon from './Icon.jsx';

// Labeled input with inline error + optional show/hide toggle for passwords.
export default function Input({ label, error, hint, icon, suffix, type = 'text', className = '', ...rest }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">{label}</label>
      <div className="field__control">
        {icon && <Icon name={icon} size={18} className="field__icon" />}
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={icon ? 'has-icon' : ''}
          {...rest}
        />
        {suffix && <span className="field__suffix">{suffix}</span>}
        {isPassword && (
          <button type="button" className="field__toggle" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide password' : 'Show password'}>
            <Icon name={visible ? 'eyeOff' : 'eye'} size={18} />
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert"><Icon name="alert" size={14} /> {error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

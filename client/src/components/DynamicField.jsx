import { useId } from 'react';
import Input from './Input.jsx';
import Select from './Select.jsx';

// Renders the right control for one feature of the selected model.
export default function DynamicField({ feature, value, error, onChange }) {
  const switchId = useId();

  if (feature.type === 'number') {
    return (
      <Input
        label={feature.label}
        type="number"
        inputMode="decimal"
        min={feature.min}
        max={feature.max}
        step={feature.step || 1}
        suffix={feature.unit}
        hint={error ? undefined : [feature.help, `Range ${feature.min} to ${feature.max}`].filter(Boolean).join(' · ')}
        error={error}
        value={value}
        onChange={(e) => onChange(feature.key, e.target.value)}
      />
    );
  }

  if (feature.type === 'select') {
    return (
      <Select
        label={feature.label}
        options={feature.options.map((o) => ({ value: o.value, label: o.label }))}
        placeholder="Choose an option"
        hint={feature.help}
        error={error}
        value={value}
        onChange={(e) => onChange(feature.key, e.target.value)}
      />
    );
  }

  const on = Number(value) === 1;
  return (
    <div className="switch-field">
      <div>
        <label htmlFor={switchId} className="field__label">{feature.label}</label>
        {feature.help && <p className="field__hint">{feature.help}</p>}
      </div>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={on}
        className={`switch ${on ? 'is-on' : ''}`}
        onClick={() => onChange(feature.key, on ? 0 : 1)}
      >
        <span className="switch__thumb" />
        <span className="switch__text">{on ? 'Yes' : 'No'}</span>
      </button>
    </div>
  );
}

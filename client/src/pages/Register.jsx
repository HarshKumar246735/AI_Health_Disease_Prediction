import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { passwordStrength, validateEmail, validateName, validatePassword } from '../utils/validators.js';
import { friendlyError } from '../utils/errors.js';

const STRENGTH_LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const strength = passwordStrength(form.password);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: form.confirm !== form.password ? 'Passwords do not match.' : form.confirm ? '' : 'Confirm your password.',
    };
    setErrors(next);
    setFormError('');
    if (Object.values(next).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(friendlyError(err, "We couldn't create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start tracking your health-risk assessments in one place.">
      <form onSubmit={onSubmit} noValidate className="auth-form">
        {formError && <div className="form-alert" role="alert"><Icon name="alert" size={18} /> {formError}</div>}
        <Input label="Full name" icon="user" autoComplete="name" value={form.name} onChange={update('name')} error={errors.name} placeholder="Your full name" />
        <Input label="Email" type="email" icon="mail" autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} placeholder="name@example.com" />
        <div>
          <Input label="Password" type="password" icon="lock" autoComplete="new-password" value={form.password} onChange={update('password')} error={errors.password} hint="At least 8 characters, with a letter and a number." />
          {form.password && (
            <div className="strength" aria-live="polite">
              <div className={`strength__bar strength--${strength}`}><i /><i /><i /><i /></div>
              <span>{STRENGTH_LABELS[strength]}</span>
            </div>
          )}
        </div>
        <Input label="Confirm password" type="password" icon="lock" autoComplete="new-password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
        <Button type="submit" size="lg" loading={submitting} className="btn--block">Create account</Button>
        <p className="form-note">By creating an account you agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy policy</Link>.</p>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
    </AuthShell>
  );
}

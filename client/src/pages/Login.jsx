import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateEmail } from '../utils/validators.js';
import { friendlyError } from '../utils/errors.js';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {
      email: validateEmail(form.email),
      password: form.password ? '' : 'Enter your password.',
    };
    setErrors(next);
    setFormError('');
    if (next.email || next.password) return;

    setSubmitting(true);
    try {
      const user = await login({ email: form.email.trim(), password: form.password, remember: form.remember });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(location.state?.from || (user.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setFormError(friendlyError(err, "We couldn't sign you in. Check your details and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue your health assessments.">
      <form onSubmit={onSubmit} noValidate className="auth-form">
        {formError && <div className="form-alert" role="alert"><Icon name="alert" size={18} /> {formError}</div>}
        <Input label="Email" type="email" icon="mail" autoComplete="email" value={form.email} onChange={update('email')} error={errors.email} placeholder="name@example.com" />
        <Input label="Password" type="password" icon="lock" autoComplete="current-password" value={form.password} onChange={update('password')} error={errors.password} placeholder="Your password" />
        <div className="auth-form__row">
          <label className="check">
            <input type="checkbox" checked={form.remember} onChange={update('remember')} />
            <span>Remember me</span>
          </label>
          <button type="button" className="link-btn" onClick={() => setShowForgot((s) => !s)} aria-expanded={showForgot}>Forgot password?</button>
        </div>
        {showForgot && (
          <p className="form-note" role="status">Password reset by email isn't available yet. Sign in with your current password, then change it from your profile.</p>
        )}
        <Button type="submit" size="lg" loading={submitting} className="btn--block">Login</Button>
      </form>
      <p className="auth-switch">New to HealthPredict? <Link to="/register">Create an account</Link></p>
    </AuthShell>
  );
}

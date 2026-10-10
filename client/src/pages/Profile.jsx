import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useFetch from '../hooks/useFetch.js';
import api from '../services/api.js';
import { changePassword, updateProfile } from '../services/authService.js';
import { validateEmail, validateName, validatePassword } from '../utils/validators.js';
import { friendlyError } from '../utils/errors.js';
import { formatDate } from '../utils/format.js';

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const me = useFetch(() => api.get('/auth/me').then((r) => r.data));

  const [info, setInfo] = useState({ name: user.name, email: user.email });
  const [infoErrors, setInfoErrors] = useState({});
  const [savingInfo, setSavingInfo] = useState(false);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const saveInfo = async (e) => {
    e.preventDefault();
    const errs = { name: validateName(info.name), email: validateEmail(info.email) };
    setInfoErrors(errs);
    if (errs.name || errs.email) return;
    setSavingInfo(true);
    try {
      const data = await updateProfile({ name: info.name.trim(), email: info.email.trim() });
      setUser(data.user);
      toast.success('Profile updated.');
    } catch (err) {
      setInfoErrors({ email: friendlyError(err, "We couldn't update your profile.") });
    } finally {
      setSavingInfo(false);
    }
  };

  const savePw = async (e) => {
    e.preventDefault();
    const errs = {
      currentPassword: pw.currentPassword ? '' : 'Enter your current password.',
      newPassword: validatePassword(pw.newPassword),
      confirm: pw.confirm === pw.newPassword ? '' : 'Passwords do not match.',
    };
    setPwErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setSavingPw(true);
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed.');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwErrors({ currentPassword: err.response?.data?.errors?.currentPassword, newPassword: err.response?.data?.errors?.newPassword || (!err.response?.data?.errors && friendlyError(err)) });
    } finally {
      setSavingPw(false);
    }
  };

  const bind = (setter, errs, setErrs, key) => (e) => { setter((v) => ({ ...v, [key]: e.target.value })); setErrs((x) => ({ ...x, [key]: '' })); };

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your account details and password." />

      <section className="card profile-summary">
        <span className="avatar avatar--lg" aria-hidden="true">{user.name[0]?.toUpperCase()}</span>
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
        </div>
        <dl>
          <div><dt>Member since</dt><dd>{formatDate(user.createdAt)}</dd></div>
          <div><dt>Total assessments</dt><dd>{me.loading ? <Skeleton width={30} height={18} /> : me.data?.totalAssessments ?? '—'}</dd></div>
          <div><dt>Role</dt><dd>{user.role === 'ADMIN' ? 'Administrator' : 'User'}</dd></div>
        </dl>
      </section>

      <div className="grid-2">
        <form className="card form-stack" onSubmit={saveInfo} noValidate>
          <h3>Update profile</h3>
          <Input label="Full name" icon="user" value={info.name} onChange={bind(setInfo, infoErrors, setInfoErrors, 'name')} error={infoErrors.name} />
          <Input label="Email" type="email" icon="mail" value={info.email} onChange={bind(setInfo, infoErrors, setInfoErrors, 'email')} error={infoErrors.email} />
          <Button type="submit" loading={savingInfo}>Save changes</Button>
        </form>

        <form className="card form-stack" onSubmit={savePw} noValidate>
          <h3>Change password</h3>
          <Input label="Current password" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={bind(setPw, pwErrors, setPwErrors, 'currentPassword')} error={pwErrors.currentPassword} />
          <Input label="New password" type="password" autoComplete="new-password" value={pw.newPassword} onChange={bind(setPw, pwErrors, setPwErrors, 'newPassword')} error={pwErrors.newPassword} hint="At least 8 characters, with a letter and a number." />
          <Input label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} onChange={bind(setPw, pwErrors, setPwErrors, 'confirm')} error={pwErrors.confirm} />
          <Button type="submit" loading={savingPw}>Update password</Button>
        </form>
      </div>

      <section className="card profile-logout">
        <div><h3>Sign out</h3><p className="muted">You will need to sign in again to see your assessments.</p></div>
        <Button variant="secondary" onClick={() => { logout(); navigate('/', { replace: true }); }}><Icon name="arrow" size={16} /> Logout</Button>
      </section>
    </>
  );
}

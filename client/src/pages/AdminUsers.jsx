import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Skeleton from '../components/Skeleton.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteAdminUser, getAdminUser, getAdminUsers, setUserRole } from '../services/adminService.js';
import { formatDate } from '../utils/format.js';
import { friendlyError } from '../utils/errors.js';

const ROLES = [{ value: 'USER', label: 'User' }, { value: 'ADMIN', label: 'Admin' }];

function UserDetail({ id, onChanged, onClose }) {
  const toast = useToast();
  const { user: me } = useAuth();
  const { data, loading, error } = useFetch(() => getAdminUser(id), [id]);
  const [role, setRole] = useState(null);
  const [saving, setSaving] = useState(false);
  const current = role ?? data?.user.role;
  const isSelf = data && String(data.user.id) === String(me.id);

  const save = async () => {
    setSaving(true);
    try {
      await setUserRole(id, current);
      toast.success('Role updated.');
      onChanged();
      onClose();
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <ErrorState message={error} />;
  if (loading) return <div className="skeleton-stack"><Skeleton height={24} /><Skeleton height={24} /><Skeleton height={80} /></div>;
  return (
    <>
      <dl className="input-list">
        <div><dt>Name</dt><dd>{data.user.name}</dd></div>
        <div><dt>Email</dt><dd>{data.user.email}</dd></div>
        <div><dt>Joined</dt><dd>{formatDate(data.user.createdAt)}</dd></div>
        <div><dt>Assessments</dt><dd>{data.assessmentCount}</dd></div>
      </dl>
      <h3 className="card__subtitle">Recent assessments</h3>
      {data.recent.length === 0 ? <p className="muted">No assessments yet.</p> : (
        <ul className="mini-list">
          {data.recent.map((a) => <li key={a._id}><span>{a.diseaseName}</span><RiskBadge level={a.riskLevel} /><span className="muted">{formatDate(a.createdAt)}</span></li>)}
        </ul>
      )}
      <div className="modal__row">
        <Select label="Role" options={ROLES} value={current} onChange={(e) => setRole(e.target.value)} disabled={isSelf} hint={isSelf ? "You can't change your own role." : undefined} />
        <Button onClick={save} loading={saving} disabled={isSelf || current === data.user.role}>Save role</Button>
      </div>
    </>
  );
}

export default function AdminUsers() {
  const toast = useToast();
  const { user: me } = useAuth();
  const [filters, setFilters] = useState({ search: '', role: '' });
  const [page, setPage] = useState(1);
  const search = useDebounce(filters.search);
  const { data, loading, error, reload } = useFetch(() => getAdminUsers({ page, limit: 10, search, role: filters.role }), [page, search, filters.role]);
  const [viewId, setViewId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const setFilter = (key) => (e) => { setFilters((f) => ({ ...f, [key]: e.target.value })); setPage(1); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAdminUser(toDelete.id);
      toast.success('User deleted.');
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Users" subtitle="View accounts, change roles and remove users." />
      <section className="card filters filters--2">
        <Input label="Search" icon="search" placeholder="Name or email" value={filters.search} onChange={setFilter('search')} />
        <Select label="Role" placeholder="All roles" options={ROLES} value={filters.role} onChange={setFilter('role')} />
      </section>
      <section className="card">
        {error ? <ErrorState message={error} onRetry={reload} /> : loading ? (
          <div className="skeleton-stack">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} height={46} />)}</div>
        ) : data.items.length === 0 ? (
          <EmptyState icon="user" title="No users found" text="Try a different search or role filter." />
        ) : (
          <>
            <div className="table-wrap table-only">
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Assessments</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {data.items.map((u) => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge role-badge--${u.role.toLowerCase()}`}>{u.role}</span></td>
                      <td>{u.assessmentCount}</td>
                      <td>{formatDate(u.createdAt)}</td>
                      <td className="table__actions">
                        <Button variant="ghost" onClick={() => setViewId(u.id)}>View</Button>
                        <Button variant="ghost" className="danger-text" disabled={String(u.id) === String(me.id)} onClick={() => setToDelete(u)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cards-only">
              {data.items.map((u) => (
                <article key={u.id} className="prediction-card">
                  <div className="prediction-card__top"><strong>{u.name}</strong><span className={`role-badge role-badge--${u.role.toLowerCase()}`}>{u.role}</span></div>
                  <p className="muted small">{u.email}</p>
                  <dl><div><dt>Assessments</dt><dd>{u.assessmentCount}</dd></div><div><dt>Joined</dt><dd>{formatDate(u.createdAt)}</dd></div></dl>
                  <div className="prediction-card__actions">
                    <Button variant="secondary" onClick={() => setViewId(u.id)}>View</Button>
                    <Button variant="ghost" className="danger-text" disabled={String(u.id) === String(me.id)} onClick={() => setToDelete(u)}>Delete</Button>
                  </div>
                </article>
              ))}
            </div>
            <Pagination page={data.page} pages={data.pages} onChange={setPage} />
          </>
        )}
      </section>

      <Modal open={Boolean(viewId)} title="User details" onClose={() => setViewId(null)}>
        {viewId && <UserDetail id={viewId} onChanged={reload} onClose={() => setViewId(null)} />}
      </Modal>
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this user?"
        message={toDelete ? `${toDelete.name} and all of their assessments will be permanently removed.` : ''}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

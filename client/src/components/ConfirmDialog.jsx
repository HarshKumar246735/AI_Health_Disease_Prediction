import Modal from './Modal.jsx';
import Button from './Button.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading = false, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="modal__text">{message}</p>
    </Modal>
  );
}

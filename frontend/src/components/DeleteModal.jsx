import { useState } from 'react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, itemName }) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!motivo.trim()) {
      setError('O motivo da exclusão é obrigatório');
      return;
    }

    if (motivo.trim().length < 5) {
      setError('O motivo deve ter pelo menos 5 caracteres');
      return;
    }

    onConfirm(motivo.trim());
    setMotivo('');
    setError('');
  };

  const handleClose = () => {
    setMotivo('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title || 'Confirmar Exclusão'}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <p>
            Tem certeza que deseja excluir <strong>{itemName}</strong>?
          </p>
          <p className="modal-warning">
            ⚠️ Esta ação não pode ser desfeita. Um registro será criado no histórico de exclusões.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="motivo">
                Motivo da Exclusão <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  setError('');
                }}
                placeholder="Descreva o motivo da exclusão..."
                rows="4"
                required
              />
              {error && <span className="error-message">{error}</span>}
              <small className="form-help">
                Mínimo de 5 caracteres. Este motivo será registrado no histórico de exclusões.
              </small>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-delete-confirm">
                Confirmar Exclusão
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;


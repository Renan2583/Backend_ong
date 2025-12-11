import { useState, useEffect } from 'react';
import apiService from '../services/api';
import './CrudPage.css';

const Veterinarios = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ pessoaId: '', CRMV: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    apiService.getPessoas().then(setPessoas).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const dataToSend = {
        pessoaId: parseInt(formData.pessoaId),
        CRMV: formData.CRMV
      };
      if (editingId) {
        await apiService.updateVeterinario(editingId, dataToSend);
        setSuccess('Veterinário atualizado com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createVeterinario(dataToSend);
        setSuccess('Veterinário cadastrado com sucesso!');
      }
      setFormData({ pessoaId: '', CRMV: '' });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar veterinário');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const veterinarios = await apiService.getVeterinarios();
      const vet = veterinarios.find(v => v.id === id);
      if (vet) {
        setFormData({
          pessoaId: vet.pessoaId || '',
          CRMV: vet.CRMV || ''
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar veterinário para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veterinário?')) return;
    setLoading(true);
    setError('');
    try {
      await apiService.deleteVeterinario(id);
      setSuccess('Veterinário excluído com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir veterinário');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ pessoaId: '', CRMV: '' });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getVeterinarios();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar veterinários');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Veterinário' : 'Cadastrar Veterinário'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Pessoa *</label>
              <select name="pessoaId" value={formData.pessoaId} onChange={handleChange} required>
                <option value="">Selecione uma pessoa</option>
                {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.cpf}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>CRMV *</label>
              <input type="text" name="CRMV" value={formData.CRMV} onChange={handleChange} required />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (editingId ? 'Atualizando...' : 'Cadastrando...') : (editingId ? 'Atualizar' : 'Cadastrar')}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn-cancel" disabled={loading}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="crud-list-section">
          <button onClick={handleListar} className="btn-listar">
            {showList ? 'Atualizar Lista' : 'Listar Veterinários'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhum veterinário cadastrado.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Nome</th><th>CRMV</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nome || '-'}</td>
                        <td>{item.CRMV}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => handleEdit(item.id)} className="btn-action btn-edit" title="Editar" disabled={loading}>✏️</button>
                            <button onClick={() => handleDelete(item.id)} className="btn-action btn-delete" title="Excluir" disabled={loading}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Veterinarios;


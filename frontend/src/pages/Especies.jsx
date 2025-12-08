import { useState } from 'react';
import apiService from '../services/api';
import './CrudPage.css';

const Especies = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ nome: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({ nome: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (editingId) {
        await apiService.updateEspecie(editingId, formData);
        setSuccess('Espécie atualizada com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createEspecie(formData);
        setSuccess('Espécie cadastrada com sucesso!');
      }
      setFormData({ nome: '' });
      if (showList) {
        handleListar();
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar espécie');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const especie = await apiService.getEspecies().then(especies => especies.find(e => e.id === id));
      setFormData({ nome: especie.nome || '' });
      setEditingId(id);
      setError('');
      setSuccess('');
      document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Erro ao carregar espécie para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta espécie?')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiService.deleteEspecie(id);
      setSuccess('Espécie excluída com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir espécie');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: '' });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getEspecies();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar espécies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Espécie' : 'Cadastrar Espécie'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
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
            {showList ? 'Atualizar Lista' : 'Listar Espécies'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhuma espécie cadastrada.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nome}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="btn-action btn-edit"
                              title="Editar"
                              disabled={loading}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn-action btn-delete"
                              title="Excluir"
                              disabled={loading}
                            >
                              🗑️
                            </button>
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

export default Especies;


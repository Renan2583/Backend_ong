import { useState } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './CrudPage.css';

const Recursos = () => {
  const { user } = useAuth();
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ tipo: '', nome: '', quantidade: '', valor: '', descricao: '' });
  const [editingId, setEditingId] = useState(null);

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
        ...formData,
        quantidade: parseInt(formData.quantidade) || 0,
        valor: parseFloat(formData.valor) || 0
      };
      if (editingId) {
        await apiService.updateRecurso(editingId, dataToSend);
        setSuccess('Recurso atualizado com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createRecurso(dataToSend);
        setSuccess('Recurso cadastrado com sucesso!');
      }
      setFormData({ tipo: '', nome: '', quantidade: '', valor: '', descricao: '' });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar recurso');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const recursos = await apiService.getRecursos();
      const recurso = recursos.find(r => r.id === id);
      if (recurso) {
        setFormData({
          tipo: recurso.tipo || '',
          nome: recurso.nome || '',
          quantidade: recurso.quantidade || '',
          valor: recurso.valor || '',
          descricao: recurso.descricao || ''
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar recurso para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este recurso?')) return;
    setLoading(true);
    setError('');
    try {
      await apiService.deleteRecurso(id);
      setSuccess('Recurso excluído com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir recurso');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ tipo: '', nome: '', quantidade: '', valor: '', descricao: '' });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getRecursos();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar recursos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Recurso' : 'Cadastrar Recurso'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  <option value="Ração">Ração</option>
                  <option value="Medicamento">Medicamento</option>
                  <option value="Material">Material</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nome *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantidade *</label>
                <input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Valor (R$) *</label>
                <input 
                  type="number" 
                  name="valor" 
                  value={formData.valor} 
                  onChange={handleChange} 
                  required 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea name="descricao" value={formData.descricao} onChange={handleChange} />
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
          {user?.tipo === 'Admin' && (
            <button onClick={handleListar} className="btn-listar">
              {showList ? 'Atualizar Lista' : 'Listar Recursos'}
            </button>
          )}
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhum recurso cadastrado.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Tipo</th><th>Nome</th><th>Quantidade</th><th>Valor (R$)</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.tipo}</td>
                        <td>{item.nome}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {item.valor ? parseFloat(item.valor).toFixed(2).replace('.', ',') : '0,00'}</td>
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

export default Recursos;


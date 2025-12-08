import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './CrudPage.css';

const Doacoes = () => {
  const { user } = useAuth();
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    pessoaId: '', dataDoacao: '', tipo: 'Monetária', valor: '', descricao: '', itens: []
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    apiService.getPessoas().then(setPessoas).catch(console.error);
    apiService.getRecursos().then(setRecursos).catch(console.error);
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
      // Formatar a data antes de enviar
      const formattedDate = formData.dataDoacao && formData.dataDoacao.includes('T')
        ? formData.dataDoacao.split('T')[0]
        : formData.dataDoacao || null;
      
      const payload = {
        pessoaId: parseInt(formData.pessoaId),
        dataDoacao: formattedDate,
        tipo: formData.tipo,
        valor: formData.tipo === 'Monetária' ? parseFloat(formData.valor) : null,
        descricao: formData.descricao,
        itens: formData.itens
      };
      if (editingId) {
        await apiService.updateDoacao(editingId, payload);
        setSuccess('Doação atualizada com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createDoacao(payload);
        setSuccess('Doação cadastrada com sucesso!');
      }
      setFormData({ pessoaId: '', dataDoacao: '', tipo: 'Monetária', valor: '', descricao: '', itens: [] });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar doação');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    return dateString;
  };

  const handleEdit = async (id) => {
    try {
      const doacoes = await apiService.getDoacoes();
      const doacao = doacoes.find(d => d.id === id);
      if (doacao) {
        setFormData({
          pessoaId: doacao.pessoaId || '',
          dataDoacao: formatDateForInput(doacao.dataDoacao) || '',
          tipo: doacao.tipo || 'Monetária',
          valor: doacao.valor || '',
          descricao: doacao.descricao || '',
          itens: doacao.itens || []
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar doação para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta doação?')) return;
    setLoading(true);
    setError('');
    try {
      await apiService.deleteDoacao(id);
      setSuccess('Doação excluída com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir doação');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ pessoaId: '', dataDoacao: '', tipo: 'Monetária', valor: '', descricao: '', itens: [] });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      // Se for usuário comum, buscar apenas suas doações
      if (user?.tipo === 'User') {
        const data = await apiService.getDoacoesByPessoaId(user.id);
        setItems(data);
      } else {
        // Admin vê todas
        const data = await apiService.getDoacoes();
        setItems(data);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar doações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Doação' : 'Cadastrar Doação'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Doador *</label>
                <select name="pessoaId" value={formData.pessoaId} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Data *</label>
                <input type="date" name="dataDoacao" value={formData.dataDoacao} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                  <option value="Monetária">Monetária</option>
                  <option value="Itens">Itens</option>
                </select>
              </div>
              {formData.tipo === 'Monetária' && (
                <div className="form-group">
                  <label>Valor *</label>
                  <input type="number" step="0.01" name="valor" value={formData.valor} onChange={handleChange} required />
                </div>
              )}
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
          <button onClick={handleListar} className="btn-listar">
            {showList ? 'Atualizar Lista' : user?.tipo === 'User' ? 'Minhas Doações' : 'Listar Doações'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhuma doação cadastrada.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Data</th><th>Tipo</th><th>Valor</th><th>Doador</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{new Date(item.dataDoacao).toLocaleDateString()}</td>
                        <td>{item.tipo}</td>
                        <td>{item.tipo === 'Monetária' ? `R$ ${item.valor}` : 'Itens'}</td>
                        <td>{item.doadorNome || '-'}</td>
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

export default Doacoes;


import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './CrudPage.css';

const Adocoes = () => {
  const { user } = useAuth();
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    animalId: '', pessoaId: '', dataAdocao: '', termoAssinado: false, observacoes: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    apiService.getAnimais().then(setAnimais).catch(console.error);
    apiService.getPessoas().then(setPessoas).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // Formatar a data antes de enviar
      const formattedDate = formData.dataAdocao && formData.dataAdocao.includes('T')
        ? formData.dataAdocao.split('T')[0]
        : formData.dataAdocao || null;
      
      const dataToSend = {
        ...formData,
        animalId: parseInt(formData.animalId),
        pessoaId: parseInt(formData.pessoaId),
        dataAdocao: formattedDate,
        termoAssinado: formData.termoAssinado ? 1 : 0
      };
      if (editingId) {
        await apiService.updateAdocao(editingId, dataToSend);
        setSuccess('Adoção atualizada com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createAdocao(dataToSend);
        setSuccess('Adoção cadastrada com sucesso!');
      }
      setFormData({ animalId: '', pessoaId: '', dataAdocao: '', termoAssinado: false, observacoes: '' });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar adoção');
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
      const adocoes = await apiService.getAdocoes();
      const adocao = adocoes.find(a => a.id === id);
      if (adocao) {
        setFormData({
          animalId: adocao.animalId || '',
          pessoaId: adocao.pessoaId || '',
          dataAdocao: formatDateForInput(adocao.dataAdocao) || '',
          termoAssinado: adocao.termoAssinado || false,
          observacoes: adocao.observacoes || ''
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar adoção para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta adoção?')) return;
    setLoading(true);
    setError('');
    try {
      await apiService.deleteAdocao(id);
      setSuccess('Adoção excluída com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir adoção');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ animalId: '', pessoaId: '', dataAdocao: '', termoAssinado: false, observacoes: '' });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      // Se for usuário comum, buscar apenas suas adoções
      if (user?.tipo === 'User') {
        const data = await apiService.getAdocoesByPessoaId(user.id);
        setItems(data);
      } else {
        // Admin vê todas
        const data = await apiService.getAdocoes();
        setItems(data);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar adoções');
    } finally {
      setLoading(false);
    }
  };

  // Para usuário comum, carregar lista automaticamente
  useEffect(() => {
    if (user?.tipo === 'User') {
      const loadUserAdocoes = async () => {
        setShowList(true);
        setError('');
        setLoading(true);
        try {
          const data = await apiService.getAdocoesByPessoaId(user.id);
          setItems(data);
        } catch (err) {
          setError(err.message || 'Erro ao carregar adoções');
        } finally {
          setLoading(false);
        }
      };
      loadUserAdocoes();
    }
  }, [user]);

  // Se for usuário comum, mostrar apenas a lista
  if (user?.tipo === 'User') {
    return (
      <div className="crud-page">
        <div className="crud-container">
          <div className="crud-list-section" style={{ width: '100%' }}>
            <h2>Minhas Adoções</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {showList && (
              <div className="list-container">
                {loading ? (
                  <p>Carregando...</p>
                ) : items.length === 0 ? (
                  <p>Você ainda não realizou nenhuma adoção.</p>
                ) : (
                  <div className="adocoes-grid">
                    {items.map((item) => (
                      <div key={item.id} className="adocao-card">
                        {item.animalFotoUrl ? (
                          <img 
                            src={item.animalFotoUrl} 
                            alt={item.animalNome}
                            className="adocao-animal-photo"
                          />
                        ) : (
                          <div className="adocao-animal-photo-placeholder">
                            <span>{item.especieNome?.toLowerCase().includes('gato') ? '🐱' : '🐕'}</span>
                            <p>Sem foto</p>
                          </div>
                        )}
                        <div className="adocao-info">
                          <h3>{item.animalNome}</h3>
                          <div className="adocao-details">
                            <p><strong>Espécie:</strong> {item.especieNome}</p>
                            <p><strong>Raça:</strong> {item.racaNome}</p>
                            {item.animalCor && <p><strong>Cor:</strong> {item.animalCor}</p>}
                            {item.animalDataNasc && (
                              <p><strong>Data de Nascimento:</strong> {
                                new Date(item.animalDataNasc).toLocaleDateString('pt-BR')
                              }</p>
                            )}
                            <p><strong>Data de Adoção:</strong> {
                              new Date(item.dataAdocao).toLocaleDateString('pt-BR')
                            }</p>
                            <p><strong>Termo Assinado:</strong> {item.termoAssinado ? 'Sim ✓' : 'Não'}</p>
                            {item.observacoes && (
                              <p><strong>Observações:</strong> {item.observacoes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin vê o formulário completo
  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Adoção' : 'Cadastrar Adoção'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Animal *</label>
                <select name="animalId" value={formData.animalId} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {animais.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.racaNome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Adotante *</label>
                <select name="pessoaId" value={formData.pessoaId} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Data de Adoção *</label>
                <input type="date" name="dataAdocao" value={formData.dataAdocao} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Observações</label>
              <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} />
            </div>
            <div className="form-group">
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                marginBottom: '1rem'
              }}>
                <p style={{
                  margin: 0,
                  color: '#495057',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  fontStyle: 'italic'
                }}>
                  "Declaro, para todos os fins, que assumo total responsabilidade pela guarda, bem-estar e cuidados do animal adotado, comprometendo-me a oferecer alimentação adequada, abrigo, atenção veterinária e um ambiente seguro, garantindo seu tratamento com respeito e carinho."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  name="termoAssinado" 
                  checked={formData.termoAssinado} 
                  onChange={handleChange}
                  id="termoAssinado"
                  required
                />
                <label htmlFor="termoAssinado" style={{ margin: 0, cursor: 'pointer' }}>
                  Concordo com o termo acima *
                </label>
              </div>
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
            {showList ? 'Atualizar Lista' : 'Listar Adoções'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhuma adoção cadastrada.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Animal</th><th>Adotante</th><th>Data</th><th>Termo</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.animalNome}</td>
                        <td>{item.adotanteNome}</td>
                        <td>{new Date(item.dataAdocao).toLocaleDateString()}</td>
                        <td>{item.termoAssinado ? 'Sim' : 'Não'}</td>
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

export default Adocoes;


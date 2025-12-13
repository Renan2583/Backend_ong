import { useState, useEffect } from 'react';
import apiService from '../services/api';
import DeleteModal from '../components/DeleteModal';
import './CrudPage.css';

const Racas = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nome: '', origem: '', tamanho: '', expectativaVida: '',
    temperamento: '', pelagem: '', especiesId: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, itemName: '' });
  const [itensRestaurados, setItensRestaurados] = useState(new Set());

  useEffect(() => {
    apiService.getEspecies().then(setEspecies).catch(console.error);
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
        ...formData,
        especiesId: parseInt(formData.especiesId)
      };
      if (editingId) {
        await apiService.updateRaca(editingId, dataToSend);
        setSuccess('Raça atualizada com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createRaca(dataToSend);
        setSuccess('Raça cadastrada com sucesso!');
      }
      setFormData({ nome: '', origem: '', tamanho: '', expectativaVida: '', temperamento: '', pelagem: '', especiesId: '' });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar raça');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const racas = await apiService.getRacas();
      const raca = racas.find(r => r.id === id);
      if (raca) {
        setFormData({
          nome: raca.nome || '',
          origem: raca.origem || '',
          tamanho: raca.tamanho || '',
          expectativaVida: raca.expectativaVida || '',
          temperamento: raca.temperamento || '',
          pelagem: raca.pelagem || '',
          especiesId: raca.especiesId || ''
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar raça para edição');
    }
  };

  const handleDeleteClick = (id, itemName) => {
    setDeleteModal({ isOpen: true, id, itemName });
  };

  const handleDeleteConfirm = async (motivo) => {
    if (!deleteModal.id) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiService.deleteRaca(deleteModal.id, motivo);
      setSuccess('Raça excluída com sucesso!');
      setDeleteModal({ isOpen: false, id: null, itemName: '' });
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir raça');
      setDeleteModal({ isOpen: false, id: null, itemName: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: '', origem: '', tamanho: '', expectativaVida: '', temperamento: '', pelagem: '', especiesId: '' });
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getRacas();
      setItems(data);
      
      // Verificar quais itens foram restaurados
      const restauradosSet = new Set();
      for (const item of data) {
        try {
          const { foiRestaurado } = await apiService.verificarSeFoiRestaurado('Raca', item.id);
          if (foiRestaurado) {
            restauradosSet.add(item.id);
          }
        } catch (err) {
          console.error('Erro ao verificar se foi restaurado:', err);
        }
      }
      setItensRestaurados(restauradosSet);
    } catch (err) {
      setError(err.message || 'Erro ao carregar raças');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Raça' : 'Cadastrar Raça'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Espécie *</label>
                <select name="especiesId" value={formData.especiesId} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {especies.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Origem</label>
                <input type="text" name="origem" value={formData.origem} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tamanho</label>
                <input type="text" name="tamanho" value={formData.tamanho} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expectativa de Vida</label>
                <input type="text" name="expectativaVida" value={formData.expectativaVida} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Pelagem</label>
                <select name="pelagem" value={formData.pelagem} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Pelo duro">Pelo duro</option>
                  <option value="Pelo comprido">Pelo comprido</option>
                  <option value="Pelo enrolado">Pelo enrolado</option>
                  <option value="Pelo curto">Pelo curto</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Temperamento</label>
              <textarea name="temperamento" value={formData.temperamento} onChange={handleChange} />
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
            {showList ? 'Atualizar Lista' : 'Listar Raças'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhuma raça cadastrada.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Nome</th><th>Espécie</th><th>Tamanho</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nome}</td>
                        <td>{item.especieNome}</td>
                        <td>{item.tamanho || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleEdit(item.id)} className="btn-action btn-edit" title="Editar" disabled={loading}>✏️</button>
                              {!itensRestaurados.has(item.id) && (
                                <button onClick={() => handleDeleteClick(item.id, item.nome)} className="btn-action btn-delete" title="Excluir" disabled={loading}>🗑️</button>
                              )}
                            </div>
                            {itensRestaurados.has(item.id) && (
                              <small style={{ 
                                color: '#28a745', 
                                fontSize: '0.75rem', 
                                fontWeight: '600',
                                fontStyle: 'italic'
                              }}>
                                ✅ Restaurado pelo administrador
                              </small>
                            )}
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
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, itemName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Raça"
        itemName={deleteModal.itemName}
      />
    </div>
  );
};

export default Racas;


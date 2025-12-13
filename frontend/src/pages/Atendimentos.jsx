import { useState, useEffect } from 'react';
import apiService from '../services/api';
import DeleteModal from '../components/DeleteModal';
import './CrudPage.css';

const Atendimentos = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [animalId, setAnimalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    animalId: '', dataAtendimento: '', tipo: '', descricao: '', custo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, itemName: '' });
  const [itensRestaurados, setItensRestaurados] = useState(new Set());

  useEffect(() => {
    apiService.getAnimais().then(setAnimais).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setListError('');
    setSuccess('');
    setLoading(true);
    try {
      // Formatar datetime para o formato correto do MySQL
      let formattedDateTime = formData.dataAtendimento;
      if (formattedDateTime && formattedDateTime.includes('T')) {
        // Para datetime-local, já vem no formato correto, mas garantimos
        formattedDateTime = formattedDateTime.replace('T', ' ');
      }
      
      const dataToSend = {
        ...formData,
        animalId: parseInt(formData.animalId),
        dataAtendimento: formattedDateTime || null,
        custo: formData.custo ? parseFloat(formData.custo) : null
      };
      if (editingId) {
        await apiService.updateAtendimento(editingId, dataToSend);
        setSuccess('Atendimento atualizado com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createAtendimento(dataToSend);
        setSuccess('Atendimento cadastrado com sucesso!');
      }
      setFormData({ animalId: '', dataAtendimento: '', tipo: '', descricao: '', custo: '' });
      if (showList) handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao salvar atendimento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      // Buscar o atendimento da lista atual ou buscar todos os atendimentos
      let atendimento = items.find(a => a.id === id);
      if (!atendimento && animalId) {
        const atendimentos = await apiService.getAtendimentosByAnimal(parseInt(animalId));
        atendimento = atendimentos.find(a => a.id === id);
      }
      if (atendimento) {
        // Converter data para formato adequado
        const dataAtendimento = atendimento.dataAtendimento ? 
          new Date(atendimento.dataAtendimento).toISOString().slice(0, 16) : '';
        setFormData({
          animalId: atendimento.animalId || '',
          dataAtendimento: dataAtendimento,
          tipo: atendimento.tipo || '',
          descricao: atendimento.descricao || '',
          custo: atendimento.custo || ''
        });
        setEditingId(id);
        setError('');
        setSuccess('');
        document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError('Erro ao carregar atendimento para edição');
    }
  };

  const handleDeleteClick = (id, itemName) => {
    setDeleteModal({ isOpen: true, id, itemName });
  };

  const handleDeleteConfirm = async (motivo) => {
    if (!deleteModal.id) return;
    
    setLoading(true);
    setListError('');
    setSuccess('');
    try {
      await apiService.deleteAtendimento(deleteModal.id, motivo);
      setSuccess('Atendimento excluído com sucesso!');
      setDeleteModal({ isOpen: false, id: null, itemName: '' });
      handleListar();
    } catch (err) {
      setListError(err.message || 'Erro ao excluir atendimento');
      setDeleteModal({ isOpen: false, id: null, itemName: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ animalId: '', dataAtendimento: '', tipo: '', descricao: '', custo: '' });
  };

  const handleListar = async () => {
    if (!animalId) {
      setListError('Selecione um animal para ver os atendimentos');
      return;
    }
    setShowList(true);
    setListError('');
    setLoading(true);
    try {
      const data = await apiService.getAtendimentosByAnimal(parseInt(animalId));
      setItems(data);
      
      // Verificar quais itens foram restaurados
      const restauradosSet = new Set();
      for (const item of data) {
        try {
          const { foiRestaurado } = await apiService.verificarSeFoiRestaurado('Atendimento', item.id);
          if (foiRestaurado) {
            restauradosSet.add(item.id);
          }
        } catch (err) {
          console.error('Erro ao verificar se foi restaurado:', err);
        }
      }
      setItensRestaurados(restauradosSet);
    } catch (err) {
      setListError(err.message || 'Erro ao carregar atendimentos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Atendimento' : 'Cadastrar Atendimento'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Animal *</label>
              <select name="animalId" value={formData.animalId} onChange={handleChange} required>
                <option value="">Selecione</option>
                {animais.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.racaNome}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Data *</label>
                <input type="datetime-local" name="dataAtendimento" value={formData.dataAtendimento} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  <option value="Vacina">Vacina</option>
                  <option value="Cirurgia">Cirurgia</option>
                  <option value="Consulta">Consulta</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Custo (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="custo" 
                  value={formData.custo} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Descrição *</label>
              <textarea 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleChange} 
                placeholder={formData.tipo === 'Outro' ? 'Digite aqui o tipo de atendimento e a descrição...' : 'Descrição do atendimento'}
                required 
              />
              {formData.tipo === 'Outro' && (
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.85rem' }}>
                  💡 Quando selecionar "Outro", digite na descrição acima qual é o tipo de atendimento.
                </small>
              )}
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
          <h2>Listar Atendimentos</h2>
          {listError && <div className="alert alert-error">{listError}</div>}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Animal para consultar atendimentos:</label>
            <select value={animalId} onChange={(e) => {
              setAnimalId(e.target.value);
              setListError(''); // Limpar erro ao mudar seleção
            }}>
              <option value="">Selecione um animal</option>
              {animais.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.racaNome}</option>)}
            </select>
          </div>
          <button onClick={handleListar} className="btn-listar">
            {showList ? 'Atualizar Lista' : 'Listar Atendimentos'}
          </button>
          {showList && (
            <div className="list-container">
              {loading ? <p>Carregando...</p> : items.length === 0 ? <p>Nenhum atendimento cadastrado.</p> : (
                <table className="data-table">
                  <thead>
                    <tr><th>ID</th><th>Animal</th><th>Data</th><th>Tipo</th><th>Custo</th><th>Descrição</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.animalNome || '-'}</td>
                        <td>{new Date(item.dataAtendimento).toLocaleString()}</td>
                        <td>{item.tipo}</td>
                        <td>{item.custo ? `R$ ${parseFloat(item.custo).toFixed(2)}` : '-'}</td>
                        <td>{item.descricao}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleEdit(item.id)} className="btn-action btn-edit" title="Editar" disabled={loading}>✏️</button>
                              {!itensRestaurados.has(item.id) && (
                                <button onClick={() => handleDeleteClick(item.id, `Atendimento #${item.id} - ${item.tipo} de ${item.animalNome || 'N/A'}`)} className="btn-action btn-delete" title="Excluir" disabled={loading}>🗑️</button>
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
        title="Excluir Atendimento"
        itemName={deleteModal.itemName}
      />
    </div>
  );
};

export default Atendimentos;


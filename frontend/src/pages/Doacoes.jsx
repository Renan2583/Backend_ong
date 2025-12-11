import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './CrudPage.css';

const Doacoes = () => {
  const { user } = useAuth();
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    pessoaId: '', dataDoacao: '', tipo: 'Monetária', valor: '', descricao: '', itens: []
  });
  const [editingId, setEditingId] = useState(null);
  const [novoItem, setNovoItem] = useState({ nome: '', valor: '', quantidade: '' });

  useEffect(() => {
    // Se for usuário comum, não precisa carregar lista de pessoas
    if (user?.tipo === 'Admin') {
      apiService.getPessoas().then(setPessoas).catch(console.error);
    } else if (user?.tipo === 'User' && user?.id) {
      // Usuário comum: preencher automaticamente com seus dados
      setFormData(prev => ({
        ...prev,
        pessoaId: user.id.toString()
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo' && value === 'Monetária') {
      // Limpar itens quando mudar para Monetária
      setFormData({ ...formData, tipo: value, itens: [] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleItemChange = (e) => {
    setNovoItem({ ...novoItem, [e.target.name]: e.target.value });
  };

  const adicionarItem = () => {
    if (!novoItem.nome || !novoItem.valor || !novoItem.quantidade) {
      setError('Preencha todos os campos do item (nome, valor e quantidade)');
      return;
    }
    if (parseFloat(novoItem.valor) <= 0 || parseInt(novoItem.quantidade) <= 0) {
      setError('Valor e quantidade devem ser maiores que zero');
      return;
    }
    const item = {
      nome: novoItem.nome,
      valor: parseFloat(novoItem.valor),
      quantidade: parseInt(novoItem.quantidade)
    };
    setFormData({
      ...formData,
      itens: [...formData.itens, item]
    });
    setNovoItem({ nome: '', valor: '', quantidade: '' });
    setError('');
  };

  const removerItem = (index) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index)
    });
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
      
      // Validar itens se for doação de itens
      if (formData.tipo === 'Itens' && (!formData.itens || formData.itens.length === 0)) {
        setError('Adicione pelo menos um item para doação de itens');
        setLoading(false);
        return;
      }

      const payload = {
        pessoaId: parseInt(formData.pessoaId),
        dataDoacao: formattedDate,
        tipo: formData.tipo,
        valor: formData.tipo === 'Monetária' ? parseFloat(formData.valor) : null,
        descricao: formData.descricao,
        itens: formData.tipo === 'Itens' ? formData.itens : []
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
      setNovoItem({ nome: '', valor: '', quantidade: '' });
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
      const doacao = await apiService.getDoacaoById(id);
      if (doacao) {
        // Se for usuário comum, garantir que só pode editar suas próprias doações
        if (user?.tipo === 'User' && doacao.doadorId !== user.id) {
          setError('Você só pode editar suas próprias doações');
          return;
        }

        // Formatar itens para o formato esperado
        const itensFormatados = doacao.itens ? doacao.itens.map(item => ({
          nome: item.nome || '',
          valor: item.valor || 0,
          quantidade: item.quantidade || 0
        })) : [];
        
        setFormData({
          pessoaId: doacao.doadorId || doacao.pessoaId || (user?.tipo === 'User' ? user.id.toString() : ''),
          dataDoacao: formatDateForInput(doacao.dataDoacao) || '',
          tipo: doacao.tipo || 'Monetária',
          valor: doacao.valor || '',
          descricao: doacao.descricao || '',
          itens: itensFormatados
        });
        setEditingId(id);
        setNovoItem({ nome: '', valor: '', quantidade: '' });
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
    setNovoItem({ nome: '', valor: '', quantidade: '' });
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
              {user?.tipo === 'Admin' ? (
                <div className="form-group">
                  <label>Doador *</label>
                  <select name="pessoaId" value={formData.pessoaId} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Doador</label>
                  <input 
                    type="text" 
                    value={user?.nome || 'Você'} 
                    disabled 
                    style={{ 
                      background: '#f0f0f0', 
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.25rem', color: '#666' }}>
                    Você está doando como {user?.nome}
                  </small>
                  {/* Campo hidden para manter o pessoaId no formulário */}
                  <input type="hidden" name="pessoaId" value={formData.pessoaId} />
                </div>
              )}
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
                  <label>Valor (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="valor" 
                    value={formData.valor} 
                    onChange={handleChange} 
                    required 
                    min="0.01"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {formData.tipo === 'Itens' && (
              <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 'bold' }}>
                  Itens Doados *
                </label>
                
                {/* Formulário para adicionar item */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem' }}>Nome do Item</label>
                    <input
                      type="text"
                      name="nome"
                      value={novoItem.nome}
                      onChange={handleItemChange}
                      placeholder="Ex: Ração Premium"
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem' }}>Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="valor"
                      value={novoItem.valor}
                      onChange={handleItemChange}
                      placeholder="0.00"
                      min="0.01"
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem' }}>Quantidade</label>
                    <input
                      type="number"
                      name="quantidade"
                      value={novoItem.quantidade}
                      onChange={handleItemChange}
                      placeholder="1"
                      min="1"
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={adicionarItem}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    + Adicionar
                  </button>
                </div>

                {/* Lista de itens adicionados */}
                {formData.itens.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '4px' }}>
                      <thead>
                        <tr style={{ background: '#007bff', color: 'white' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Valor Unit.</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qtd</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>Total</th>
                          <th style={{ padding: '0.5rem', textAlign: 'center' }}>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.itens.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '0.5rem' }}><strong>{item.nome}</strong></td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                              R$ {parseFloat(item.valor).toFixed(2).replace('.', ',')}
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantidade}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                              R$ {(parseFloat(item.valor) * parseInt(item.quantidade)).toFixed(2).replace('.', ',')}
                            </td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removerItem(index)}
                                style={{
                                  background: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '0.25rem 0.5rem',
                                  cursor: 'pointer'
                                }}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan="3" style={{ padding: '0.5rem', textAlign: 'right' }}>TOTAL:</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right', color: '#28a745', fontSize: '1.1rem' }}>
                            R$ {formData.itens.reduce((sum, item) => 
                              sum + (parseFloat(item.valor) * parseInt(item.quantidade)), 0
                            ).toFixed(2).replace('.', ',')}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            )}

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
                        <td>
                          {item.tipo === 'Monetária' 
                            ? `R$ ${parseFloat(item.valor || 0).toFixed(2).replace('.', ',')}` 
                            : item.itens && item.itens.length > 0
                            ? `${item.itens.length} item(ns) - Total: R$ ${item.itens.reduce((sum, i) => sum + (parseFloat(i.valor || 0) * parseInt(i.quantidade || 0)), 0).toFixed(2).replace('.', ',')}`
                            : 'Itens'}
                        </td>
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


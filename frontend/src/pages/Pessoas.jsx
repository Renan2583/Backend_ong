import { useState } from 'react';
import apiService from '../services/api';
import './CrudPage.css';

const Pessoas = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNasc: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    senha: '',
    tipo: 'User'
  });
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
      // Formatar a data antes de enviar
      const dataToSend = {
        ...formData,
        dataNasc: formData.dataNasc && formData.dataNasc.includes('T') 
          ? formData.dataNasc.split('T')[0] 
          : formData.dataNasc || null
      };
      
      if (editingId) {
        await apiService.updatePessoa(editingId, dataToSend);
        setSuccess('Pessoa atualizada com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createPessoa(formData);
        setSuccess('Pessoa cadastrada com sucesso!');
      }
      setFormData({
        nome: '',
        cpf: '',
        dataNasc: '',
        telefone: '',
        email: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        senha: ''
      });
      if (showList) {
        handleListar();
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar pessoa');
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
      const pessoa = await apiService.getPessoaById(id);
      setFormData({
        nome: pessoa.nome || '',
        cpf: pessoa.cpf || '',
        dataNasc: formatDateForInput(pessoa.dataNasc) || '',
        telefone: pessoa.telefone || '',
        email: pessoa.email || '',
        cep: pessoa.cep || '',
        logradouro: pessoa.logradouro || '',
        numero: pessoa.numero || '',
        complemento: pessoa.complemento || '',
        bairro: pessoa.bairro || '',
        cidade: pessoa.cidade || '',
        estado: pessoa.estado || '',
        senha: '', // Não carregar senha por segurança
        tipo: pessoa.tipo || 'User'
      });
      setEditingId(id);
      setError('');
      setSuccess('');
      document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Erro ao carregar pessoa para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiService.deletePessoa(id);
      setSuccess('Pessoa excluída com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir pessoa');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      cpf: '',
      dataNasc: '',
      telefone: '',
      email: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
        senha: '',
        tipo: 'User'
      });
    };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getPessoas();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Pessoa' : 'Cadastrar Pessoa'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>CPF *</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input type="date" name="dataNasc" value={formData.dataNasc} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Senha *</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Logradouro</label>
              <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cidade</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Usuário *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                  <option value="User">Usuário Comum</option>
                  <option value="Admin">Administrador</option>
                </select>
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
            {showList ? 'Atualizar Lista' : 'Listar Pessoas'}
          </button>

          {showList && (
            <div className="list-container">
              {loading ? (
                <p>Carregando...</p>
              ) : items.length === 0 ? (
                <p>Nenhuma pessoa cadastrada.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nome}</td>
                        <td>{item.cpf}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.tipo || 'User'}</td>
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

export default Pessoas;


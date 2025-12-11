import { useState, useEffect } from 'react';
import apiService from '../services/api';
import './CrudPage.css';

const Animais = () => {
  const [showList, setShowList] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    cor: '',
    dataNasc: '',
    racasId: '',
    pessoaId: '',
    fotoUrl: ''
  });
  const [fotoPreview, setFotoPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [racas, setRacas] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    loadRacas();
    loadPessoas();
  }, []);

  const loadRacas = async () => {
    try {
      const data = await apiService.getRacas();
      setRacas(data);
    } catch (err) {
      console.error('Erro ao carregar raças:', err);
    }
  };

  const loadPessoas = async () => {
    try {
      const data = await apiService.getPessoas();
      setPessoas(data);
    } catch (err) {
      console.error('Erro ao carregar pessoas:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const compressImage = (file, maxWidth = 600, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar se necessário (reduzido para 600px)
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para base64 com compressão maior (0.6)
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // Verificar tamanho do base64 (remover o prefixo data:image... para contar)
          const base64Size = compressedBase64.length - compressedBase64.indexOf(',') - 1;
          const sizeInMB = (base64Size * 3) / 4 / 1024 / 1024; // Aproximadamente 33% maior em base64
          
          // Se ainda for muito grande, comprimir mais
          if (sizeInMB > 1) {
            const lowerQuality = Math.max(0.3, quality - 0.2);
            const furtherCompressed = canvas.toDataURL('image/jpeg', lowerQuality);
            resolve(furtherCompressed);
          } else {
            resolve(compressedBase64);
          }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar se é uma imagem
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem');
        e.target.value = '';
        return;
      }

      // Validar tamanho (máximo 5MB antes da compressão)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        e.target.value = '';
        return;
      }

      setError(''); // Limpar erro se passou na validação
      setSuccess(''); // Limpar mensagem de sucesso anterior
      setLoading(true);

      try {
        // Comprimir a imagem antes de converter para base64
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, fotoUrl: compressedBase64 });
        setFotoPreview(compressedBase64);
      } catch (err) {
        setError('Erro ao processar a imagem');
        e.target.value = '';
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFoto = () => {
    setFormData({ ...formData, fotoUrl: '' });
    setFotoPreview(null);
    // Resetar o input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Formatar a data para garantir que está no formato YYYY-MM-DD
      let formattedDate = formData.dataNasc;
      if (formattedDate && formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0];
      }
      
      const dataToSend = {
        ...formData,
        dataNasc: formattedDate || null,
        racasId: parseInt(formData.racasId) || null,
        pessoaId: formData.pessoaId ? parseInt(formData.pessoaId) : null
      };

      if (editingId) {
        await apiService.updateAnimal(editingId, dataToSend);
        setSuccess('Animal atualizado com sucesso!');
        setEditingId(null);
      } else {
        await apiService.createAnimal(dataToSend);
        setSuccess('Animal cadastrado com sucesso!');
      }
      
      setFormData({
        nome: '',
        cor: '',
        dataNasc: '',
        racasId: '',
        pessoaId: '',
        fotoUrl: ''
      });
      setFotoPreview(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      if (showList) {
        handleListar();
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar animal');
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Se a data vier como ISO string (2025-10-10T03:00:00.000Z), pegar apenas a parte da data
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    // Se já vier no formato correto (YYYY-MM-DD), retornar como está
    return dateString;
  };

  const handleEdit = async (id) => {
    try {
      const animal = await apiService.getAnimalById(id);
      setFormData({
        nome: animal.nome || '',
        cor: animal.cor || '',
        dataNasc: formatDateForInput(animal.dataNasc) || '',
        racasId: animal.racasId || '',
        pessoaId: animal.pessoaId || '',
        fotoUrl: animal.fotoUrl || ''
      });
      if (animal.fotoUrl) {
        setFotoPreview(animal.fotoUrl);
      }
      setEditingId(id);
      setError('');
      setSuccess('');
      // Scroll para o formulário
      document.querySelector('.crud-form-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Erro ao carregar animal para edição');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await apiService.deleteAnimal(id);
      setSuccess('Animal excluído com sucesso!');
      handleListar();
    } catch (err) {
      setError(err.message || 'Erro ao excluir animal');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      cor: '',
      dataNasc: '',
      racasId: '',
      pessoaId: '',
      fotoUrl: ''
    });
    setFotoPreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleListar = async () => {
    setShowList(true);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.getAnimais();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar animais');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <div className="crud-form-section">
          <h2>{editingId ? 'Editar Animal' : 'Cadastrar Animal'}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cor</label>
                <input
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNasc"
                  value={formData.dataNasc}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Raça *</label>
                <select
                  name="racasId"
                  value={formData.racasId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma raça</option>
                  {racas.map((raca) => (
                    <option key={raca.id} value={raca.id}>
                      {raca.nome} ({raca.especieNome})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pessoa (Tutor)</label>
                <select
                  name="pessoaId"
                  value={formData.pessoaId}
                  onChange={handleChange}
                >
                  <option value="">Sem tutor</option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Foto do Animal</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.85rem' }}>
                  Formatos aceitos: JPG, PNG, GIF (máximo 5MB - será comprimida automaticamente)
                </small>
                {fotoPreview && (
                  <div className="image-preview-container">
                    <img 
                      src={fotoPreview} 
                      alt="Preview da foto" 
                      className="image-preview"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="remove-image-btn"
                      aria-label="Remover foto"
                    >
                      ×
                    </button>
                  </div>
                )}
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
            {showList ? 'Atualizar Lista' : 'Listar Animais'}
          </button>

          {showList && (
            <div className="list-container">
              {loading ? (
                <p>Carregando...</p>
              ) : items.length === 0 ? (
                <p>Nenhum animal cadastrado.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Cor</th>
                      <th>Raça</th>
                      <th>Espécie</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.fotoUrl ? (
                            <img 
                              src={item.fotoUrl} 
                              alt={item.nome}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#999',
                              fontSize: '12px'
                            }}>
                              Sem foto
                            </div>
                          )}
                        </td>
                        <td>{item.id}</td>
                        <td>{item.nome}</td>
                        <td>{item.cor || '-'}</td>
                        <td>{item.racaNome}</td>
                        <td>{item.especieNome}</td>
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

export default Animais;


import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/global.css';
import './Caes.css'; // Reutilizando o mesmo CSS

const Gatos = () => {
  const { user } = useAuth();
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adocaoLoading, setAdocaoLoading] = useState(false);
  const [adocaoError, setAdocaoError] = useState('');
  const [adocaoSuccess, setAdocaoSuccess] = useState('');
  const [termoAssinado, setTermoAssinado] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    loadAnimaisDisponiveis();
  }, []);

  const loadAnimaisDisponiveis = async () => {
    setLoading(true);
    setError('');
    try {
      // Buscar todos os animais e filtrar por espécie "Gato" e sem tutor
      const allAnimais = await apiService.getAnimais();
      const gatosDisponiveis = allAnimais.filter(animal => 
        animal.especieNome && 
        (animal.especieNome.toLowerCase().includes('gato') || 
         animal.especieNome.toLowerCase().includes('felino')) && 
        !animal.pessoaId // Animais sem tutor estão disponíveis para adoção
      );
      setAnimais(gatosDisponiveis);
    } catch (err) {
      setError('Erro ao carregar gatos disponíveis para adoção');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnimalClick = async (animal) => {
    try {
      // Buscar informações completas do animal
      const animalCompleto = await apiService.getAnimalById(animal.id);
      setSelectedAnimal(animalCompleto);
      setShowModal(true);
      setAdocaoError('');
      setAdocaoSuccess('');
      setTermoAssinado(false);
      setObservacoes('');
    } catch (err) {
      console.error('Erro ao carregar detalhes do animal:', err);
      setAdocaoError('Erro ao carregar informações do animal');
    }
  };

  const handleAdotar = async () => {
    if (!user || !selectedAnimal) return;
    
    if (!termoAssinado) {
      setAdocaoError('Você precisa concordar com o termo para adotar');
      return;
    }
    
    setAdocaoLoading(true);
    setAdocaoError('');
    setAdocaoSuccess('');
    
    try {
      const hoje = new Date().toISOString().split('T')[0];
      await apiService.createAdocao({
        animalId: selectedAnimal.id,
        pessoaId: user.id,
        dataAdocao: hoje,
        termoAssinado: true,
        observacoes: observacoes || 'Adoção realizada pelo próprio usuário'
      });
      
      setAdocaoSuccess('Adoção realizada com sucesso!');
      // Atualizar lista de animais
      setTimeout(() => {
        loadAnimaisDisponiveis();
        setShowModal(false);
        setTermoAssinado(false);
        setObservacoes('');
      }, 2000);
    } catch (err) {
      setAdocaoError(err.message || 'Erro ao realizar adoção');
    } finally {
      setAdocaoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animais-container">
        <h1>Gatos Disponíveis para Adoção</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animais-container">
        <h1>Gatos Disponíveis para Adoção</h1>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="animais-container">
      <h1>Gatos Disponíveis para Adoção</h1>
      
      {animais.length === 0 ? (
        <p className="no-animals">Nenhum gato disponível para adoção no momento.</p>
      ) : (
        <div className="animais-grid">
          {animais.map((animal) => (
            <div 
              key={animal.id} 
              className="animal-card"
            >
              <div 
                onClick={() => handleAnimalClick(animal)}
                style={{ cursor: 'pointer' }}
              >
                {animal.fotoUrl ? (
                  <img 
                    src={animal.fotoUrl} 
                    alt={animal.nome}
                    className="animal-photo"
                  />
                ) : (
                  <div className="animal-photo-placeholder">
                    <span>🐱</span>
                    <p>Sem foto</p>
                  </div>
                )}
                <div className="animal-info">
                  <h3>{animal.nome}</h3>
                  <p><strong>Raça:</strong> {animal.racaNome}</p>
                  {animal.cor && <p><strong>Cor:</strong> {animal.cor}</p>}
                </div>
              </div>
              {user && (
                <button
                  className="btn-adotar-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnimalClick(animal);
                  }}
                  style={{
                    width: '100%',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#218838'}
                  onMouseLeave={(e) => e.target.style.background = '#28a745'}
                >
                  🏠 Adotar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes do Animal */}
      {showModal && selectedAnimal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Detalhes do Animal</h2>
            
            <div className="animal-details">
              {selectedAnimal.fotoUrl && (
                <div className="animal-detail-photo">
                  <img src={selectedAnimal.fotoUrl} alt={selectedAnimal.nome} />
                </div>
              )}
              
              <div className="animal-detail-info">
                <h3>{selectedAnimal.nome}</h3>
                <p><strong>Espécie:</strong> {selectedAnimal.especieNome}</p>
                <p><strong>Raça:</strong> {selectedAnimal.racaNome}</p>
                {selectedAnimal.cor && <p><strong>Cor:</strong> {selectedAnimal.cor}</p>}
                {selectedAnimal.dataNasc && (
                  <p><strong>Data de Nascimento:</strong> {
                    new Date(selectedAnimal.dataNasc).toLocaleDateString('pt-BR')
                  }</p>
                )}
                {selectedAnimal.tutorNome && (
                  <p><strong>Tutor:</strong> {selectedAnimal.tutorNome}</p>
                )}
              </div>
            </div>

            {!selectedAnimal.pessoaId && user && (
              <>
                <div className="form-group-modal">
                  <label>Observações (opcional)</label>
                  <textarea
                    className="form-input"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Adicione observações sobre a adoção..."
                    rows="3"
                  />
                </div>

                <div className="termo-declaracao">
                  <div className="termo-box">
                    <p>
                      "Declaro, para todos os fins, que assumo total responsabilidade pela guarda, bem-estar e cuidados do animal adotado, comprometendo-me a oferecer alimentação adequada, abrigo, atenção veterinária e um ambiente seguro, garantindo seu tratamento com respeito e carinho."
                    </p>
                  </div>
                  <div className="termo-checkbox">
                    <input
                      type="checkbox"
                      id="termoAssinado"
                      checked={termoAssinado}
                      onChange={(e) => setTermoAssinado(e.target.checked)}
                    />
                    <label htmlFor="termoAssinado">
                      Concordo com o termo acima *
                    </label>
                  </div>
                </div>

                {adocaoError && <div className="alert alert-error">{adocaoError}</div>}
                {adocaoSuccess && <div className="alert alert-success">{adocaoSuccess}</div>}

                <button 
                  className="btn-adotar"
                  onClick={handleAdotar}
                  disabled={adocaoLoading || !termoAssinado}
                >
                  {adocaoLoading ? 'Processando...' : 'Adotar este animal'}
                </button>
              </>
            )}
            
            {!user && (
              <p className="login-required">Faça login para adotar este animal</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gatos;


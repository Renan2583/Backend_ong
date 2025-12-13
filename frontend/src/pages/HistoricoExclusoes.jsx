import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import DetalhesExclusaoModal from '../components/DetalhesExclusaoModal';
import './CrudPage.css';
import './Relatorios.css';

const HistoricoExclusoes = () => {
  const { user } = useAuth();
  const [restaurando, setRestaurando] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [detalhesModal, setDetalhesModal] = useState({ isOpen: false, dadosAntigos: null, tipoEntidade: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

  useEffect(() => {
    if (user && user.cpf === '37842476870') {
      carregarHistorico();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filtroTipo]);

  const carregarHistorico = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let data;
      if (filtroTipo) {
        data = await apiService.getHistoricoExclusoesByTipo(filtroTipo);
      } else {
        data = await apiService.getHistoricoExclusoes();
      }
      setHistorico(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar histórico de exclusões');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      'Doacao': 'Doação',
      'Atendimento': 'Atendimento',
      'Adocao': 'Adoção',
      'Recurso': 'Recurso',
      'Pessoa': 'Pessoa',
      'Animal': 'Animal',
      'Raca': 'Raça'
    };
    return tipos[tipo] || tipo;
  };

  const handleRestaurar = async (id) => {
    if (!window.confirm('Tem certeza que deseja restaurar esta exclusão?')) return;
    
    setRestaurando(true);
    setError('');
    try {
      await apiService.restaurarExclusao(id);
      setSuccess('Exclusão restaurada com sucesso!');
      carregarHistorico();
    } catch (err) {
      setError(err.message || 'Erro ao restaurar exclusão');
    } finally {
      setRestaurando(false);
    }
  };

  const historicoFiltrado = historico.filter(item => {
    if (filtroDataInicio && new Date(item.dataExclusao) < new Date(filtroDataInicio)) {
      return false;
    }
    if (filtroDataFim && new Date(item.dataExclusao) > new Date(filtroDataFim + 'T23:59:59')) {
      return false;
    }
    return true;
  });

  // Verificar se é o CPF autorizado
  if (!user || user.cpf !== '37842476870') {
    return (
      <div className="relatorios-page">
        <div className="relatorios-container">
          <h1 className="relatorios-title">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relatorios-page">
      <div className="relatorios-container">
        <h1 className="relatorios-title">📋 Histórico de Exclusões</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Filtros */}
        <div className="relatorios-filters" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Tipo de Entidade
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Todos os tipos</option>
                <option value="Doacao">Doações</option>
                <option value="Atendimento">Atendimentos</option>
                <option value="Adocao">Adoções</option>
                <option value="Recurso">Recursos</option>
                <option value="Pessoa">Pessoas</option>
                <option value="Animal">Animais</option>
                <option value="Raca">Raças</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Data Início
              </label>
              <input
                type="date"
                value={filtroDataInicio}
                onChange={(e) => setFiltroDataInicio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Data Fim
              </label>
              <input
                type="date"
                value={filtroDataFim}
                onChange={(e) => setFiltroDataFim(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          <button
            onClick={carregarHistorico}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            🔄 Atualizar
          </button>
        </div>

        {loading ? (
          <div className="relatorios-loading">
            <p>Carregando histórico de exclusões...</p>
          </div>
        ) : historicoFiltrado.length === 0 ? (
          <p className="relatorio-empty">
            {historico.length === 0 
              ? 'Nenhuma exclusão registrada no histórico.' 
              : 'Nenhuma exclusão encontrada com os filtros aplicados.'}
          </p>
        ) : (
          <div className="relatorio-table-container">
            <table className="relatorio-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>ID da Entidade</th>
                  <th>Motivo</th>
                  <th>Excluído Por</th>
                  <th>Data da Exclusão</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {historicoFiltrado.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: item.tipoEntidade === 'Doacao' ? '#e3f2fd' : 
                                        item.tipoEntidade === 'Atendimento' ? '#fff3e0' : '#f3e5f5',
                        color: item.tipoEntidade === 'Doacao' ? '#1976d2' : 
                               item.tipoEntidade === 'Atendimento' ? '#f57c00' : '#7b1fa2'
                      }}>
                        {getTipoLabel(item.tipoEntidade)}
                      </span>
                    </td>
                    <td>#{item.entidadeId}</td>
                    <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                      {item.motivo}
                    </td>
                    <td>
                      {item.excluidoPorNome || 'Usuário não encontrado'}
                      {item.excluidoPorCpf && (
                        <small style={{ display: 'block', color: '#666', fontSize: '0.875rem' }}>
                          CPF: {item.excluidoPorCpf}
                        </small>
                      )}
                    </td>
                    <td>{formatDate(item.dataExclusao)}</td>
                    <td>
                      {item.restaurado ? (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          backgroundColor: '#d4edda',
                          color: '#155724'
                        }}>
                          ✅ Restaurado
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          backgroundColor: '#f8d7da',
                          color: '#721c24'
                        }}>
                          ❌ Excluído
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <button
                          onClick={() => setDetalhesModal({ 
                            isOpen: true, 
                            dadosAntigos: item.dadosAntigos, 
                            tipoEntidade: item.tipoEntidade 
                          })}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          📋 Ver Detalhes
                        </button>
                        {!item.restaurado && (
                          <button
                            onClick={() => handleRestaurar(item.id)}
                            disabled={restaurando}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: restaurando ? 'not-allowed' : 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              opacity: restaurando ? 0.6 : 1
                            }}
                          >
                            {restaurando ? 'Restaurando...' : '🔄 Restaurar'}
                          </button>
                        )}
                        {item.restaurado && item.dataRestauracao && (
                          <small style={{ display: 'block', color: '#28a745', fontSize: '0.875rem', fontWeight: '600' }}>
                            ✅ Restaurado em: {formatDate(item.dataRestauracao)}
                          </small>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DetalhesExclusaoModal
        isOpen={detalhesModal.isOpen}
        onClose={() => setDetalhesModal({ isOpen: false, dadosAntigos: null, tipoEntidade: '' })}
        dadosAntigos={detalhesModal.dadosAntigos}
        tipoEntidade={detalhesModal.tipoEntidade}
      />
    </div>
  );
};

export default HistoricoExclusoes;


import { useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './CrudPage.css';
import './Relatorios.css';

const Relatorios = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('doacoes');
  const [relatorioDoacoes, setRelatorioDoacoes] = useState([]);
  const [relatorioRecursos, setRelatorioRecursos] = useState([]);
  const [relatorioAdocoes, setRelatorioAdocoes] = useState([]);
  const [relatorioAtendimentos, setRelatorioAtendimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroDataInicioRecursos, setFiltroDataInicioRecursos] = useState('');
  const [filtroDataFimRecursos, setFiltroDataFimRecursos] = useState('');
  const [filtroDataInicioAdocoes, setFiltroDataInicioAdocoes] = useState('');
  const [filtroDataFimAdocoes, setFiltroDataFimAdocoes] = useState('');
  const [filtroDataInicioAtendimentos, setFiltroDataInicioAtendimentos] = useState('');
  const [filtroDataFimAtendimentos, setFiltroDataFimAtendimentos] = useState('');

  useEffect(() => {
    if (user?.tipo === 'Admin') {
      carregarRelatorios();
    }
  }, [user, activeTab]);

  const carregarRelatorios = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'doacoes') {
        const data = await apiService.getRelatorioDoacoes();
        setRelatorioDoacoes(data);
      } else if (activeTab === 'recursos') {
        const data = await apiService.getRelatorioRecursos();
        setRelatorioRecursos(data);
      } else if (activeTab === 'adocoes') {
        const data = await apiService.getRelatorioAdocoes();
        setRelatorioAdocoes(data);
      } else if (activeTab === 'atendimentos') {
        const data = await apiService.getRelatorioAtendimentos();
        setRelatorioAtendimentos(data);
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCpf = (cpf) => {
    if (!cpf) return '-';
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Verificar se é admin
  if (user?.tipo !== 'Admin') {
    return (
      <div className="crud-page">
        <div className="crud-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Acesso Restrito</h2>
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relatorios-page">
      <div className="relatorios-container">
        <h1 className="relatorios-title">📊 Relatórios</h1>
        
        {error && <div className="alert alert-error">{error}</div>}

        {/* Tabs */}
        <div className="relatorios-tabs">
          <button
            onClick={() => setActiveTab('doacoes')}
            className={`relatorios-tab ${activeTab === 'doacoes' ? 'active' : ''}`}
          >
            💖 Doações
          </button>
          <button
            onClick={() => setActiveTab('recursos')}
            className={`relatorios-tab ${activeTab === 'recursos' ? 'active' : ''}`}
          >
            🦴 Recursos
          </button>
          <button
            onClick={() => setActiveTab('adocoes')}
            className={`relatorios-tab ${activeTab === 'adocoes' ? 'active' : ''}`}
          >
            🏠 Adoções
          </button>
          <button
            onClick={() => setActiveTab('atendimentos')}
            className={`relatorios-tab ${activeTab === 'atendimentos' ? 'active' : ''}`}
          >
            🩺 Atendimentos
          </button>
        </div>

        {loading ? (
          <div className="relatorios-loading">
            <p>Carregando relatórios...</p>
          </div>
        ) : (
          <>
            {/* Relatório de Doações */}
            {activeTab === 'doacoes' && (
              <div className="relatorio-section">
                <h2 className="relatorio-section-title">Relatório de Doações por Pessoa</h2>
                
                {/* Filtros */}
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      🔍 Filtrar por nome
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do doador..."
                      value={filtroNome}
                      onChange={(e) => setFiltroNome(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data inicial
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
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data final
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
                  {(filtroDataInicio || filtroDataFim || filtroNome) && (
                    <button
                      onClick={() => {
                        setFiltroNome('');
                        setFiltroDataInicio('');
                        setFiltroDataFim('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {relatorioDoacoes.length === 0 ? (
                  <p className="relatorio-empty">Nenhuma doação encontrada.</p>
                ) : (() => {
                  // Função auxiliar para obter a primeira data de doação
                  const getPrimeiraDataDoacao = (doacoes) => {
                    if (!doacoes || doacoes.length === 0) return null;
                    const datas = doacoes
                      .map(d => d.dataDoacao)
                      .filter(d => d)
                      .sort();
                    return datas.length > 0 ? datas[0] : null;
                  };

                  // Função auxiliar para verificar se a data está no intervalo
                  const dataNoIntervalo = (dataString, dataInicio, dataFim) => {
                    if (!dataString) return false;
                    const data = new Date(dataString);
                    const inicio = dataInicio ? new Date(dataInicio) : null;
                    const fim = dataFim ? new Date(dataFim) : null;
                    
                    if (inicio && data < inicio) return false;
                    if (fim) {
                      const fimCompleto = new Date(fim);
                      fimCompleto.setHours(23, 59, 59, 999);
                      if (data > fimCompleto) return false;
                    }
                    return true;
                  };

                  const doacoesFiltradas = relatorioDoacoes.filter(item => {
                    // Filtro por nome
                    const passaNome = !filtroNome || 
                      item.pessoaNome.toLowerCase().includes(filtroNome.toLowerCase());
                    
                    // Filtro por data - verifica se alguma doação está no intervalo
                    const passaData = !filtroDataInicio && !filtroDataFim ? true :
                      item.doacoes && item.doacoes.some(doacao => 
                        dataNoIntervalo(doacao.dataDoacao, filtroDataInicio, filtroDataFim)
                      );
                    
                    return passaNome && passaData;
                  });

                  if (doacoesFiltradas.length === 0) {
                    return <p className="relatorio-empty">Nenhuma doação encontrada com o filtro aplicado.</p>;
                  }

                  return (
                    <>
                      <div className="relatorio-table-wrapper">
                        <table className="relatorio-table">
                          <thead>
                            <tr>
                              <th>Nome</th>
                              <th>CPF</th>
                              <th>Email</th>
                              <th>Primeira Doação</th>
                              <th>Total de Doações</th>
                              <th>Valor Total</th>
                              <th>Detalhes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doacoesFiltradas.map((item) => {
                              // Obter a primeira data de doação
                              const primeiraData = item.doacoes && item.doacoes.length > 0
                                ? item.doacoes
                                    .map(d => d.dataDoacao)
                                    .filter(d => d)
                                    .sort()[0]
                                : null;
                              
                              return (
                                <tr key={item.pessoaId}>
                                  <td data-label="Nome"><strong>{item.pessoaNome}</strong></td>
                                  <td data-label="CPF">{formatCpf(item.cpf)}</td>
                                  <td data-label="Email">{item.email || '-'}</td>
                                  <td data-label="Primeira Doação">
                                    {primeiraData ? formatDate(primeiraData) : '-'}
                                  </td>
                                  <td data-label="Total de Doações" className="text-center">{item.totalDoacoes}</td>
                                  <td data-label="Valor Total" className="text-right valor-total">
                                    {formatCurrency(item.valorTotalMonetario || 0)}
                                  </td>
                                  <td data-label="Detalhes">
                                  <details className="detalhes-dropdown">
                                    <summary>Ver detalhes ({item.totalDoacoes} doação(ões))</summary>
                                    <div className="detalhes-content">
                                      {item.doacoes && item.doacoes.length > 0 ? (
                                        item.doacoes.map((doacao, idx) => (
                                          <div key={idx} className="detalhe-item" style={{ 
                                            marginBottom: '1rem', 
                                            padding: '1rem',
                                            background: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #dee2e6'
                                          }}>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                              <strong>Doação #{doacao.id}</strong>
                                            </div>
                                            <div style={{ marginBottom: '0.25rem' }}>
                                              <strong>Data:</strong> {formatDate(doacao.dataDoacao)}
                                            </div>
                                            <div style={{ marginBottom: '0.25rem' }}>
                                              <strong>Tipo:</strong> {doacao.tipo}
                                            </div>
                                            {doacao.tipo === 'Monetária' || doacao.tipo === 'Monetaria' ? (
                                              <div style={{ marginBottom: '0.25rem' }}>
                                                <strong>Valor:</strong> {formatCurrency(doacao.valor || 0)}
                                              </div>
                                            ) : (
                                              <div style={{ marginTop: '0.5rem' }}>
                                                <strong>Itens Doados:</strong>
                                                <ul style={{ marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                                                  {doacao.itens && doacao.itens.length > 0 ? (
                                                    doacao.itens.map((itemDoacao, itemIdx) => (
                                                      <li key={itemIdx} style={{ marginBottom: '0.25rem' }}>
                                                        {itemDoacao.nome} - 
                                                        Qtd: {itemDoacao.quantidade} - 
                                                        Valor Unit.: {formatCurrency(itemDoacao.valor)} - 
                                                        Total: {formatCurrency(itemDoacao.valor * itemDoacao.quantidade)}
                                                      </li>
                                                    ))
                                                  ) : (
                                                    <li>Nenhum item encontrado</li>
                                                  )}
                                                </ul>
                                              </div>
                                            )}
                                            {doacao.descricao && (
                                              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #dee2e6' }}>
                                                <strong>Descrição:</strong> {doacao.descricao}
                                              </div>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <p>Sem detalhes disponíveis</p>
                                      )}
                                    </div>
                                  </details>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="relatorio-footer">
                              <td colSpan="4" className="text-right"><strong>TOTAL GERAL:</strong></td>
                              <td className="text-right total-geral">
                                {formatCurrency(
                                  doacoesFiltradas.reduce((sum, item) => sum + (parseFloat(item.valorTotalMonetario) || 0), 0)
                                )}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Relatório de Recursos */}
            {activeTab === 'recursos' && (
              <div className="relatorio-section">
                <h2 className="relatorio-section-title">Relatório de Recursos</h2>
                
                {/* Filtros por data */}
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data inicial (doações)
                    </label>
                    <input
                      type="date"
                      value={filtroDataInicioRecursos}
                      onChange={(e) => setFiltroDataInicioRecursos(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data final (doações)
                    </label>
                    <input
                      type="date"
                      value={filtroDataFimRecursos}
                      onChange={(e) => setFiltroDataFimRecursos(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  {(filtroDataInicioRecursos || filtroDataFimRecursos) && (
                    <button
                      onClick={() => {
                        setFiltroDataInicioRecursos('');
                        setFiltroDataFimRecursos('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {relatorioRecursos.length === 0 ? (
                  <p className="relatorio-empty">Nenhum recurso encontrado.</p>
                ) : (() => {
                  // Nota: Filtro de data para recursos seria baseado nas doações relacionadas
                  // Por simplicidade, vamos apenas mostrar todos os recursos
                  // O filtro pode ser implementado no backend se necessário
                  const recursosFiltrados = relatorioRecursos;
                  
                  return (
                  <div className="relatorio-table-wrapper">
                    <table className="relatorio-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tipo</th>
                          <th>Nome</th>
                          <th>Quantidade</th>
                          <th>Valor Unit.</th>
                          <th>Valor Total</th>
                          <th>Total Doado</th>
                          <th>Valor Doado</th>
                          <th>Descrição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recursosFiltrados.map((item) => (
                          <tr key={item.id}>
                            <td data-label="ID">{item.id}</td>
                            <td data-label="Tipo">{item.tipo}</td>
                            <td data-label="Nome"><strong>{item.nome}</strong></td>
                            <td data-label="Quantidade" className="text-center">{item.quantidade || 0}</td>
                            <td data-label="Valor Unit." className="text-right">{formatCurrency(item.valor || 0)}</td>
                            <td data-label="Valor Total" className="text-right valor-total">
                              {formatCurrency((item.quantidade || 0) * (item.valor || 0))}
                            </td>
                            <td data-label="Total Doado" className="text-center">{item.totalDoacoes || 0}</td>
                            <td data-label="Valor Doado" className="text-right valor-doado">
                              {formatCurrency(item.valorTotalDoacoes || 0)}
                            </td>
                            <td data-label="Descrição">{item.descricao || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="relatorio-footer">
                          <td colSpan="4" className="text-right"><strong>TOTAIS:</strong></td>
                          <td className="text-right">
                            {formatCurrency(
                              recursosFiltrados.reduce((sum, item) => sum + (parseFloat(item.valor) || 0), 0)
                            )}
                          </td>
                          <td className="text-right">
                            {formatCurrency(
                              recursosFiltrados.reduce((sum, item) => sum + ((item.quantidade || 0) * (item.valor || 0)), 0)
                            )}
                          </td>
                          <td className="text-center">
                            {recursosFiltrados.reduce((sum, item) => sum + (parseInt(item.totalDoacoes) || 0), 0)}
                          </td>
                          <td className="text-right total-geral">
                            {formatCurrency(
                              recursosFiltrados.reduce((sum, item) => sum + (parseFloat(item.valorTotalDoacoes) || 0), 0)
                            )}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  );
                })()}
              </div>
            )}

            {/* Relatório de Adoções */}
            {activeTab === 'adocoes' && (
              <div className="relatorio-section">
                <h2 className="relatorio-section-title">Relatório de Adoções</h2>
                
                {/* Filtros por data */}
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data inicial
                    </label>
                    <input
                      type="date"
                      value={filtroDataInicioAdocoes}
                      onChange={(e) => setFiltroDataInicioAdocoes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data final
                    </label>
                    <input
                      type="date"
                      value={filtroDataFimAdocoes}
                      onChange={(e) => setFiltroDataFimAdocoes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  {(filtroDataInicioAdocoes || filtroDataFimAdocoes) && (
                    <button
                      onClick={() => {
                        setFiltroDataInicioAdocoes('');
                        setFiltroDataFimAdocoes('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {relatorioAdocoes.length === 0 ? (
                  <p className="relatorio-empty">Nenhuma adoção encontrada.</p>
                ) : (() => {
                  // Função auxiliar para verificar se a data está no intervalo
                  const dataNoIntervalo = (dataString, dataInicio, dataFim) => {
                    if (!dataString) return false;
                    const data = new Date(dataString);
                    const inicio = dataInicio ? new Date(dataInicio) : null;
                    const fim = dataFim ? new Date(dataFim) : null;
                    
                    if (inicio && data < inicio) return false;
                    if (fim) {
                      const fimCompleto = new Date(fim);
                      fimCompleto.setHours(23, 59, 59, 999);
                      if (data > fimCompleto) return false;
                    }
                    return true;
                  };

                  const adocoesFiltradas = relatorioAdocoes.filter(item =>
                    dataNoIntervalo(item.dataAdocao, filtroDataInicioAdocoes, filtroDataFimAdocoes)
                  );

                  if (adocoesFiltradas.length === 0) {
                    return <p className="relatorio-empty">Nenhuma adoção encontrada com o filtro aplicado.</p>;
                  }

                  return (
                  <div className="relatorio-cards">
                    {adocoesFiltradas.map((item) => (
                      <div key={item.adocaoId} className="relatorio-card">
                        <div className="card-animal">
                          <div className="animal-foto">
                            {item.animalFotoUrl ? (
                              <>
                                <img 
                                  src={
                                    item.animalFotoUrl.startsWith('data:') || item.animalFotoUrl.startsWith('http')
                                      ? item.animalFotoUrl 
                                      : `data:image/jpeg;base64,${item.animalFotoUrl}`
                                  } 
                                  alt={item.animalNome}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.nextElementSibling;
                                    if (placeholder) placeholder.style.display = 'flex';
                                  }}
                                />
                                <div className="animal-foto-placeholder" style={{ display: 'none' }}>
                                  <span>🐾</span>
                                  <span>Sem foto</span>
                                </div>
                              </>
                            ) : (
                              <div className="animal-foto-placeholder">
                                <span>🐾</span>
                                <span>Sem foto</span>
                              </div>
                            )}
                          </div>
                          <div className="animal-info">
                            <h3>{item.animalNome}</h3>
                            <p><strong>Espécie:</strong> {item.especieNome}</p>
                            <p><strong>Raça:</strong> {item.racaNome}</p>
                            <p><strong>Cor:</strong> {item.animalCor || '-'}</p>
                            {item.animalDataNasc && (
                              <p><strong>Data de Nascimento:</strong> {formatDate(item.animalDataNasc)}</p>
                            )}
                          </div>
                        </div>
                        <div className="card-adotante">
                          <h4>👤 Adotante</h4>
                          <p><strong>Nome:</strong> {item.adotanteNome}</p>
                          <p><strong>CPF:</strong> {formatCpf(item.adotanteCpf)}</p>
                          {item.adotanteEmail && <p><strong>Email:</strong> {item.adotanteEmail}</p>}
                          {item.adotanteTelefone && <p><strong>Telefone:</strong> {item.adotanteTelefone}</p>}
                        </div>
                        <div className="card-adocao">
                          <h4>📅 Informações da Adoção</h4>
                          <p><strong>Data da Adoção:</strong> {formatDate(item.dataAdocao)}</p>
                          <p><strong>Termo Assinado:</strong> {item.termoAssinado ? '✅ Sim' : '❌ Não'}</p>
                          {item.observacoes && (
                            <p><strong>Observações:</strong> {item.observacoes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  );
                })()}
              </div>
            )}

            {/* Relatório de Atendimentos */}
            {activeTab === 'atendimentos' && (
              <div className="relatorio-section">
                <h2 className="relatorio-section-title">Relatório de Atendimentos</h2>
                
                {/* Filtros por data */}
                <div style={{ 
                  marginBottom: '1.5rem', 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem',
                  alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data inicial
                    </label>
                    <input
                      type="date"
                      value={filtroDataInicioAtendimentos}
                      onChange={(e) => setFiltroDataInicioAtendimentos(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      📅 Data final
                    </label>
                    <input
                      type="date"
                      value={filtroDataFimAtendimentos}
                      onChange={(e) => setFiltroDataFimAtendimentos(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  {(filtroDataInicioAtendimentos || filtroDataFimAtendimentos) && (
                    <button
                      onClick={() => {
                        setFiltroDataInicioAtendimentos('');
                        setFiltroDataFimAtendimentos('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                {relatorioAtendimentos.length === 0 ? (
                  <p className="relatorio-empty">Nenhum atendimento encontrado.</p>
                ) : (() => {
                  // Função auxiliar para verificar se a data está no intervalo
                  const dataNoIntervalo = (dataString, dataInicio, dataFim) => {
                    if (!dataString) return false;
                    const data = new Date(dataString);
                    const inicio = dataInicio ? new Date(dataInicio) : null;
                    const fim = dataFim ? new Date(dataFim) : null;
                    
                    if (inicio && data < inicio) return false;
                    if (fim) {
                      const fimCompleto = new Date(fim);
                      fimCompleto.setHours(23, 59, 59, 999);
                      if (data > fimCompleto) return false;
                    }
                    return true;
                  };

                  const atendimentosFiltrados = relatorioAtendimentos.filter(item =>
                    dataNoIntervalo(item.dataAtendimento, filtroDataInicioAtendimentos, filtroDataFimAtendimentos)
                  );

                  if (atendimentosFiltrados.length === 0) {
                    return <p className="relatorio-empty">Nenhum atendimento encontrado com o filtro aplicado.</p>;
                  }

                  return (
                    <div className="relatorio-cards">
                      {atendimentosFiltrados.map((item) => (
                        <div key={item.atendimentoId} className="relatorio-card">
                          <div className="card-animal">
                            <div className="animal-foto">
                              {item.animalFotoUrl ? (
                                <>
                                  <img 
                                    src={
                                      item.animalFotoUrl.startsWith('data:') || item.animalFotoUrl.startsWith('http')
                                        ? item.animalFotoUrl 
                                        : `data:image/jpeg;base64,${item.animalFotoUrl}`
                                    } 
                                    alt={item.animalNome}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const placeholder = e.target.nextElementSibling;
                                      if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                  />
                                  <div className="animal-foto-placeholder" style={{ display: 'none' }}>
                                    <span>🐾</span>
                                    <span>Sem foto</span>
                                  </div>
                                </>
                              ) : (
                                <div className="animal-foto-placeholder">
                                  <span>🐾</span>
                                  <span>Sem foto</span>
                                </div>
                              )}
                            </div>
                            <div className="animal-info">
                              <h3>{item.animalNome}</h3>
                              <p><strong>Espécie:</strong> {item.especieNome}</p>
                              <p><strong>Raça:</strong> {item.racaNome}</p>
                              <p><strong>Cor:</strong> {item.animalCor || '-'}</p>
                              {item.animalDataNasc && (
                                <p><strong>Data de Nascimento:</strong> {formatDate(item.animalDataNasc)}</p>
                              )}
                            </div>
                          </div>
                          <div className="card-adocao">
                            <h4>🩺 Informações do Atendimento</h4>
                            <p><strong>Data:</strong> {formatDate(item.dataAtendimento)}</p>
                            <p><strong>Tipo:</strong> {item.tipo}</p>
                            {item.custo && (
                              <p><strong>Custo:</strong> {formatCurrency(item.custo)}</p>
                            )}
                            {item.veterinarioNome && (
                              <p><strong>Veterinário:</strong> {item.veterinarioNome}</p>
                            )}
                            {item.veterinarioCRMV && (
                              <p><strong>CRMV:</strong> {item.veterinarioCRMV}</p>
                            )}
                            {item.descricao && (
                              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #dee2e6' }}>
                                <strong>Descrição:</strong>
                                <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{item.descricao}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Relatorios;

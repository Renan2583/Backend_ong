import './DeleteModal.css';
import '../pages/CrudPage.css';

const DetalhesExclusaoModal = ({ isOpen, onClose, dadosAntigos, tipoEntidade }) => {
  if (!isOpen || !dadosAntigos) return null;

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  const renderFormulario = () => {
    if (!dadosAntigos) {
      return <p>Nenhum dado disponível.</p>;
    }

    switch (tipoEntidade) {
      case 'Doacao':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>📋 Detalhes da Doação</h3>
            
            <div className="form-group">
              <label>Data da Doação</label>
              <input 
                type="date" 
                value={formatDateForInput(dadosAntigos.dataDoacao)} 
                disabled 
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>Tipo de Doação</label>
              <select 
                value={dadosAntigos.tipo || 'Monetária'} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              >
                <option value="Monetária">Monetária</option>
                <option value="Itens">Itens</option>
              </select>
            </div>

            {dadosAntigos.tipo === 'Monetária' && (
              <div className="form-group">
                <label>Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={dadosAntigos.valor || ''} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.tipo === 'Itens' && dadosAntigos.itens && dadosAntigos.itens.length > 0 && (
              <div className="form-group">
                <label>Itens da Doação</label>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '4px', marginTop: '0.5rem' }}>
                  <thead>
                    <tr style={{ background: '#007bff', color: 'white' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Item</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Valor Unit.</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qtd</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosAntigos.itens.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '0.5rem' }}><strong>{item.nome}</strong></td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          R$ {parseFloat(item.valor || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantidade || 0}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                          R$ {(parseFloat(item.valor || 0) * parseInt(item.quantidade || 0)).toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                      <td colSpan="3" style={{ padding: '0.5rem', textAlign: 'right' }}>TOTAL:</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', color: '#28a745', fontSize: '1.1rem' }}>
                        R$ {dadosAntigos.itens.reduce((sum, item) => 
                          sum + (parseFloat(item.valor || 0) * parseInt(item.quantidade || 0)), 0
                        ).toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="form-group">
              <label>Descrição</label>
              <textarea 
                value={dadosAntigos.descricao || ''} 
                disabled
                rows="4"
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.doadorNome && (
              <div className="form-group">
                <label>Doador</label>
                <input 
                  type="text" 
                  value={dadosAntigos.doadorNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}
          </form>
        );

      case 'Atendimento':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>🏥 Detalhes do Atendimento</h3>
            
            <div className="form-group">
              <label>Data do Atendimento</label>
              <input 
                type="datetime-local" 
                value={formatDateTimeForInput(dadosAntigos.dataAtendimento)} 
                disabled 
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <input 
                type="text" 
                value={dadosAntigos.tipo || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.animalNome && (
              <div className="form-group">
                <label>Animal</label>
                <input 
                  type="text" 
                  value={dadosAntigos.animalNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.veterinarioNome && (
              <div className="form-group">
                <label>Veterinário</label>
                <input 
                  type="text" 
                  value={dadosAntigos.veterinarioNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.custo && (
              <div className="form-group">
                <label>Custo (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={dadosAntigos.custo} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.descricao && (
              <div className="form-group">
                <label>Descrição</label>
                <textarea 
                  value={dadosAntigos.descricao} 
                  disabled
                  rows="4"
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}
          </form>
        );

      case 'Adocao':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>🏠 Detalhes da Adoção</h3>
            
            <div className="form-group">
              <label>Data da Adoção</label>
              <input 
                type="date" 
                value={formatDateForInput(dadosAntigos.dataAdocao)} 
                disabled 
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.animalNome && (
              <div className="form-group">
                <label>Animal</label>
                <input 
                  type="text" 
                  value={dadosAntigos.animalNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.adotanteNome && (
              <div className="form-group">
                <label>Adotante</label>
                <input 
                  type="text" 
                  value={dadosAntigos.adotanteNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            <div className="form-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={dadosAntigos.termoAssinado || false} 
                  disabled
                  style={{ marginRight: '0.5rem' }}
                />
                Termo Assinado
              </label>
            </div>

            {dadosAntigos.observacoes && (
              <div className="form-group">
                <label>Observações</label>
                <textarea 
                  value={dadosAntigos.observacoes} 
                  disabled
                  rows="4"
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}
          </form>
        );

      case 'Recurso':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>📦 Detalhes do Recurso</h3>
            
            <div className="form-group">
              <label>Tipo</label>
              <input 
                type="text" 
                value={dadosAntigos.tipo || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text" 
                value={dadosAntigos.nome || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input 
                type="number" 
                value={dadosAntigos.quantidade || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>Valor (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                value={dadosAntigos.valor || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.descricao && (
              <div className="form-group">
                <label>Descrição</label>
                <textarea 
                  value={dadosAntigos.descricao} 
                  disabled
                  rows="4"
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}
          </form>
        );

      case 'Pessoa':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none', maxHeight: '70vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>👤 Detalhes da Pessoa</h3>
            
            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text" 
                value={dadosAntigos.nome || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            <div className="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                value={dadosAntigos.cpf || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.dataNasc && (
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input 
                  type="date" 
                  value={formatDateForInput(dadosAntigos.dataNasc)} 
                  disabled 
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.telefone && (
              <div className="form-group">
                <label>Telefone</label>
                <input 
                  type="text" 
                  value={dadosAntigos.telefone} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.email && (
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={dadosAntigos.email} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.cep && (
              <div className="form-group">
                <label>CEP</label>
                <input 
                  type="text" 
                  value={dadosAntigos.cep} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.logradouro && (
              <div className="form-group">
                <label>Logradouro</label>
                <input 
                  type="text" 
                  value={dadosAntigos.logradouro} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.numero && (
              <div className="form-group">
                <label>Número</label>
                <input 
                  type="text" 
                  value={dadosAntigos.numero} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.complemento && (
              <div className="form-group">
                <label>Complemento</label>
                <input 
                  type="text" 
                  value={dadosAntigos.complemento} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.bairro && (
              <div className="form-group">
                <label>Bairro</label>
                <input 
                  type="text" 
                  value={dadosAntigos.bairro} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.cidade && (
              <div className="form-group">
                <label>Cidade</label>
                <input 
                  type="text" 
                  value={dadosAntigos.cidade} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.estado && (
              <div className="form-group">
                <label>Estado</label>
                <input 
                  type="text" 
                  value={dadosAntigos.estado} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.tipo && (
              <div className="form-group">
                <label>Tipo de Usuário</label>
                <select 
                  value={dadosAntigos.tipo} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
          </form>
        );

      case 'Animal':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>🐾 Detalhes do Animal</h3>
            
            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text" 
                value={dadosAntigos.nome || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.cor && (
              <div className="form-group">
                <label>Cor</label>
                <input 
                  type="text" 
                  value={dadosAntigos.cor} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.dataNasc && (
              <div className="form-group">
                <label>Data de Nascimento</label>
                <input 
                  type="date" 
                  value={formatDateForInput(dadosAntigos.dataNasc)} 
                  disabled 
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.racaNome && (
              <div className="form-group">
                <label>Raça</label>
                <input 
                  type="text" 
                  value={dadosAntigos.racaNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.especieNome && (
              <div className="form-group">
                <label>Espécie</label>
                <input 
                  type="text" 
                  value={dadosAntigos.especieNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.tutorNome && (
              <div className="form-group">
                <label>Tutor</label>
                <input 
                  type="text" 
                  value={dadosAntigos.tutorNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.fotoUrl && (
              <div className="form-group">
                <label>Foto</label>
                <div style={{ marginTop: '0.5rem' }}>
                  <img 
                    src={
                      dadosAntigos.fotoUrl.startsWith('data:') || dadosAntigos.fotoUrl.startsWith('http')
                        ? dadosAntigos.fotoUrl 
                        : `data:image/jpeg;base64,${dadosAntigos.fotoUrl}`
                    } 
                    alt={dadosAntigos.nome}
                    style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
            )}
          </form>
        );

      case 'Raca':
        return (
          <form className="crud-form" style={{ pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>🐕 Detalhes da Raça</h3>
            
            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text" 
                value={dadosAntigos.nome || ''} 
                disabled
                style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
              />
            </div>

            {dadosAntigos.especieNome && (
              <div className="form-group">
                <label>Espécie</label>
                <input 
                  type="text" 
                  value={dadosAntigos.especieNome} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.origem && (
              <div className="form-group">
                <label>Origem</label>
                <input 
                  type="text" 
                  value={dadosAntigos.origem} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.tamanho && (
              <div className="form-group">
                <label>Tamanho</label>
                <input 
                  type="text" 
                  value={dadosAntigos.tamanho} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.expectativaVida && (
              <div className="form-group">
                <label>Expectativa de Vida</label>
                <input 
                  type="text" 
                  value={dadosAntigos.expectativaVida} 
                  disabled
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.temperamento && (
              <div className="form-group">
                <label>Temperamento</label>
                <textarea 
                  value={dadosAntigos.temperamento} 
                  disabled
                  rows="4"
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}

            {dadosAntigos.pelagem && (
              <div className="form-group">
                <label>Pelagem</label>
                <textarea 
                  value={dadosAntigos.pelagem} 
                  disabled
                  rows="4"
                  style={{ opacity: 1, backgroundColor: '#f8f9fa' }}
                />
              </div>
            )}
          </form>
        );

      default:
        return (
          <div className="detalhes-container">
            <p>Dados não disponíveis para este tipo de entidade.</p>
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(dadosAntigos, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>Detalhes da Exclusão</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {renderFormulario()}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesExclusaoModal;

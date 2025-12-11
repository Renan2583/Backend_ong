import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './Login.css';

// Lista de estados brasileiros
const estadosBrasil = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Dados do formulário de cadastro (todos os campos)
  const [registerData, setRegisterData] = useState({
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
    confirmarSenha: ''
  });

  // Se já estiver logado, redireciona para home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const formatCpf = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    return value;
  };

  const handleCpfChange = (e) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(cpf.replace(/\D/g, ''), senha);
      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'CPF ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar CEP na API ViaCEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    // Só busca se tiver 8 dígitos
    if (cepLimpo.length !== 8) {
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setRegisterData(prev => ({
          ...prev,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      } else {
        setError('CEP não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      const formatted = formatCpf(value);
      setRegisterData({ ...registerData, cpf: formatted });
    } else if (name === 'telefone') {
      const formatted = formatTelefone(value);
      setRegisterData({ ...registerData, telefone: formatted });
    } else if (name === 'cep') {
      // Formatar CEP
      const numbers = value.replace(/\D/g, '');
      const formatted = numbers.length <= 8 
        ? numbers.replace(/(\d{5})(\d)/, '$1-$2')
        : value;
      setRegisterData({ ...registerData, cep: formatted });
      
      // Buscar CEP quando tiver 8 dígitos
      if (numbers.length === 8) {
        buscarCep(formatted);
      }
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (registerData.senha !== registerData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (registerData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!registerData.nome || !registerData.cpf || !registerData.dataNasc || !registerData.senha) {
      setError('Nome, CPF, Data de Nascimento e Senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const pessoaData = {
        nome: registerData.nome,
        cpf: registerData.cpf.replace(/\D/g, ''),
        dataNasc: registerData.dataNasc,
        telefone: registerData.telefone.replace(/\D/g, '') || '',
        email: registerData.email || '',
        cep: registerData.cep || '',
        logradouro: registerData.logradouro || '',
        numero: registerData.numero || '',
        complemento: registerData.complemento || '',
        bairro: registerData.bairro || '',
        cidade: registerData.cidade || '',
        estado: registerData.estado || '',
        senha: registerData.senha,
        tipo: 'User' // Usuário cadastrado pelo login sempre é User
      };

      await apiService.createPessoa(pessoaData);
      setError('');
      // Após cadastro, fazer login automaticamente
      // Após cadastro bem-sucedido, fazer login automaticamente
      try {
        await login(registerData.cpf.replace(/\D/g, ''), registerData.senha);
        navigate('/home');
      } catch (loginError) {
        // Se o login automático falhar, apenas redireciona para login
        setIsRegisterMode(false);
        setError('Cadastro realizado! Faça login para continuar.');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className={`login-wrapper ${isRegisterMode ? 'register-mode' : ''}`}>
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🐕</span>
            </div>
            <h2>{isRegisterMode ? 'Criar Conta' : 'Bem-vindo de volta!'}</h2>
            <p>{isRegisterMode ? 'Preencha os dados para se cadastrar' : 'Faça login para continuar'}</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {!isRegisterMode ? (
            // Formulário de Login
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-input"
                  id="senha"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          ) : (
            // Formulário de Cadastro
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="nome"
                  name="nome"
                  placeholder="Digite seu nome completo"
                  value={registerData.nome}
                  onChange={handleRegisterChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cpf-register" className="form-label">
                  CPF *
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="cpf-register"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={registerData.cpf}
                  onChange={handleRegisterChange}
                  maxLength={14}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dataNasc-register" className="form-label">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  className="form-input"
                  id="dataNasc-register"
                  name="dataNasc"
                  value={registerData.dataNasc}
                  onChange={handleRegisterChange}
                  required
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone-register" className="form-label">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="form-input"
                  id="telefone-register"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={registerData.telefone}
                  onChange={handleRegisterChange}
                  maxLength={15}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-register" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  id="email-register"
                  name="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cep-register" className="form-label">
                  CEP
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="cep-register"
                  name="cep"
                  placeholder="00000-000"
                  value={registerData.cep}
                  onChange={handleRegisterChange}
                  disabled={loading || loadingCep}
                  maxLength={9}
                />
                {loadingCep && <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>Buscando CEP...</small>}
              </div>

              <div className="form-group">
                <label htmlFor="logradouro-register" className="form-label">
                  Logradouro
                </label>
                <input
                  type="text"
                  className="form-input"
                  id="logradouro-register"
                  name="logradouro"
                  placeholder="Rua, Avenida, etc."
                  value={registerData.logradouro}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row-register">
                <div className="form-group">
                  <label htmlFor="numero-register" className="form-label">
                    Número
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="numero-register"
                    name="numero"
                    placeholder="123"
                    value={registerData.numero}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="complemento-register" className="form-label">
                    Complemento
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="complemento-register"
                    name="complemento"
                    placeholder="Apto, Bloco, etc."
                    value={registerData.complemento}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row-register">
                <div className="form-group">
                  <label htmlFor="bairro-register" className="form-label">
                    Bairro
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="bairro-register"
                    name="bairro"
                    placeholder="Nome do bairro"
                    value={registerData.bairro}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cidade-register" className="form-label">
                    Cidade
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="cidade-register"
                    name="cidade"
                    placeholder="Nome da cidade"
                    value={registerData.cidade}
                    onChange={handleRegisterChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="estado-register" className="form-label">
                  Estado
                </label>
                <select
                  className="form-input"
                  id="estado-register"
                  name="estado"
                  value={registerData.estado}
                  onChange={handleRegisterChange}
                  disabled={loading}
                >
                  <option value="">Selecione o estado</option>
                  {estadosBrasil.map(estado => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {estado.sigla} - {estado.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="senha-register" className="form-label">
                  Senha *
                </label>
                <input
                  type="password"
                  className="form-input"
                  id="senha-register"
                  name="senha"
                  placeholder="Mínimo 6 caracteres"
                  value={registerData.senha}
                  onChange={handleRegisterChange}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha" className="form-label">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  className="form-input"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  placeholder="Digite a senha novamente"
                  value={registerData.confirmarSenha}
                  onChange={handleRegisterChange}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </button>
            </form>
          )}

          <div className="login-footer">
            {!isRegisterMode ? (
              <p>Não tem uma conta? <a href="#cadastro" onClick={(e) => { e.preventDefault(); setIsRegisterMode(true); setError(''); }}>Cadastre-se</a></p>
            ) : (
              <p>Já tem uma conta? <a href="#login" onClick={(e) => { e.preventDefault(); setIsRegisterMode(false); setError(''); }}>Faça login</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

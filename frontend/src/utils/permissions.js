// Utilitário para verificar permissões de usuário

export const isAdmin = (user) => {
  return user && user.tipo === 'Admin';
};

export const isUser = (user) => {
  return user && user.tipo === 'User';
};

// Rotas permitidas para usuários comuns
export const USER_ROUTES = [
  '/home',
  '/Caes',
  '/Gatos',
  '/doacoes',
  '/adocoes'
];

// Rotas permitidas apenas para administradores
export const ADMIN_ROUTES = [
  '/animais',
  '/pessoas',
  '/especies',
  '/racas',
  '/veterinarios',
  '/atendimentos',
  '/relatorios'
];

// Verifica se o usuário tem permissão para acessar uma rota
export const canAccessRoute = (user, path) => {
  if (!user) return false;
  
  // Admin tem acesso a tudo
  if (isAdmin(user)) return true;
  
  // Usuário comum só tem acesso às rotas permitidas
  if (isUser(user)) {
    return USER_ROUTES.includes(path);
  }
  
  return false;
};

// Retorna os itens do menu permitidos para o usuário
export const getMenuItems = (user) => {
  const allItems = [
    { path: '/animais', label: '🐕 Animais', icon: '🐕', adminOnly: true },
    { path: '/pessoas', label: '👨‍👩‍👧‍👦 Pessoas', icon: '👨‍👩‍👧‍👦', adminOnly: true },
    { path: '/especies', label: '🐶 Espécies', icon: '🐶', adminOnly: true },
    { path: '/racas', label: '🧬 Raças', icon: '🧬', adminOnly: true },
    { path: '/veterinarios', label: '👨‍⚕️ Veterinários', icon: '👨‍⚕️', adminOnly: true },
    { path: '/recursos', label: '🦴 Recursos', icon: '🦴', adminOnly: true },
    { path: '/doacoes', label: '💖 Doações', icon: '💖', adminOnly: false },
    { path: '/atendimentos', label: '🩺 Atendimentos', icon: '🩺', adminOnly: true },
    { path: '/adocoes', label: '🏠 Adoções', icon: '🏠', adminOnly: false },
    { path: '/relatorios', label: '📊 Relatórios', icon: '📊', adminOnly: true },
  ];

  if (!user) return [];
  
  // Admin vê tudo
  if (isAdmin(user)) return allItems;
  
  // Usuário comum vê apenas os itens não adminOnly
  return allItems.filter(item => !item.adminOnly);
};


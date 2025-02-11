// Função para cadastrar um novo usuário
export const register = (email, password) => {
    return new Promise((resolve, reject) => {
      // Recupera os usuários salvos no localStorage, ou cria um array vazio caso não exista
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Verifica se o e-mail já está cadastrado
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        reject({ success: false, message: 'Usuário já cadastrado.' });
      } else {
        // Cria um novo usuário
        const newUser = { id: users.length + 1, email, password };
        users.push(newUser);
  
        // Salva os usuários atualizados no localStorage
        localStorage.setItem('users', JSON.stringify(users));
  
        resolve({ success: true, user: newUser });
      }
    });
  };
  
  // Função de login
  export const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Recupera os usuários salvos no localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
  
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          resolve({ success: true, user });
        } else {
          reject({ success: false, message: 'Usuário não cadastrado!' });
        }
      }, 1000); // Simula um atraso de rede
    });
  };
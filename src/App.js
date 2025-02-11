import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import './App.css';

// Função para cadastro de usuário (deve ser colocada no arquivo correto, como auth.js)
const users = [
  { id: 1, email: 'user@example.com', password: 'Senha123!' },
];

// Função para cadastrar um novo usuário
const register = (email, password) => {
  return new Promise((resolve, reject) => {
    // Verifica se o e-mail já está cadastrado
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      reject({ success: false, message: 'Usuário já cadastrado.' });
    } else {
      // Cria um novo usuário
      const newUser = { id: users.length + 1, email, password };
      users.push(newUser);
      resolve({ success: true, user: newUser });
    }
  });
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Controla a tela de cadastro

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
  };

  const handleRegister = (email, password) => {
    register(email, password)
      .then(() => {
        alert('Usuário registrado com sucesso!');
        setIsRegistering(false); // Retorna à tela de login após sucesso
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <div>
          <p>Bem-vindo, {userEmail}!</p>
          <LogoutButton onLogout={handleLogout} />
        </div>
      ) : isRegistering ? (
        <div>
          <h3>Cadastro de Usuário</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const password = e.target.password.value;
              handleRegister(email, password);
            }}
          >
            <input type="email" name="email" placeholder="E-mail" required /><br></br>
            <input type="password" name="password" placeholder="Senha" required /><br></br>
            <button type="submit">Cadastrar</button>
          </form>
          <button onClick={() => setIsRegistering(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          <h1>Sistema de Login e Cadastro</h1>
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default App;

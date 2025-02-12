import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage"; // Hook para salvar no localStorage
import { validateEmail, validatePassword } from "../utils/validation";
import { login, register } from "../api/auth"; // Simulação da API de autenticação

// Importe as imagens para os ícones
import eyeOpenIcon from "../assets/images/eye-open.png"; // Caminho da imagem de olho aberto
import eyeClosedIcon from "../assets/images/eye-closed.png"; // Caminho da imagem de olho fechado

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe] = useLocalStorage("rememberMe", false); // Removido setRememberMe pois não estava sendo usado
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-login se houver credenciais salvas
  const handleAutoLogin = async (savedEmail, savedPassword) => {
    try {
      setLoading(true);
      const response = await login(savedEmail, savedPassword);
      if (response.success) {
        onLogin(response.user.email);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega credenciais salvas ao iniciar
  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem("savedEmail");
      const savedPassword = localStorage.getItem("savedPassword");
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        handleAutoLogin(savedEmail, savedPassword);
      }
    }
  }, []); // Removida a dependência rememberMe para evitar o warning

  // Validações antes do envio do formulário
  const validateFields = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailError(isEmailValid ? "" : "Por favor, insira um e-mail válido.");
    setPasswordError(
      isPasswordValid
        ? ""
        : "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
    );

    return isEmailValid && isPasswordValid;
  };

  // Manipula o envio do formulário (Login ou Cadastro)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setLoading(true);
      if (isRegistering) {
        await register(email, password);
        setIsRegistering(false); // Retorna para a tela de login após cadastrar
      } else {
        const response = await login(email, password);
        if (response.success) {
          if (rememberMe) {
            localStorage.setItem("savedEmail", email);
            localStorage.setItem("savedPassword", password);
          } else {
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
          }
          onLogin(response.user.email);
        }
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h3>{isRegistering ? "Cadastrar Novo Usuário" : "Login"}</h3>

        <div>
          <input
            type="email"
            value={email}
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() =>
              setEmailError(validateEmail(email) ? "" : "Por favor, insira um e-mail válido.")
            }
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setPasswordError(
                validatePassword(password)
                  ? ""
                  : "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
              )
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-btn"
          >
            {showPassword ? (
              <img src={eyeOpenIcon} alt="Mostrar senha" width={20} height={20} />
            ) : (
              <img src={eyeClosedIcon} alt="Ocultar senha" width={20} height={20} />
            )}
          </button>
          {passwordError && <span className="error">{passwordError}</span>}
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : isRegistering ? "Cadastrar" : "Entrar"}
        </button>

        <p>
          {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-button"
          >
            {isRegistering ? "Faça login" : "Cadastre-se"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;


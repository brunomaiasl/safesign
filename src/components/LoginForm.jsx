import React, { useState, useEffect, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { validateEmail, validatePassword } from "../utils/validation";
import { login, register } from "../api/auth";
import eyeOpenIcon from "../assets/images/eye-open.png";
import eyeClosedIcon from "../assets/images/eye-closed.png";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe] = useLocalStorage("rememberMe", false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAutoLogin = useCallback(async (savedEmail, savedPassword) => {
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
  }, [onLogin]);

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
  }, [handleAutoLogin, rememberMe]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Adicionando o useEffect para remover ou esconder a div.glasp-extension-toaster
  useEffect(() => {
    const removeAndHideGlaspElements = () => {
      // Remover a extensão Glasp
      const glaspExtension = document.querySelector(".glasp-extension");
      if (glaspExtension) {
        glaspExtension.remove();
      }

      // Remover ou esconder a div.glasp-extension-toaster
      const glaspToaster = document.querySelector(".glasp-extension-toaster");
      if (glaspToaster) {
        glaspToaster.remove();  // Remover a div
        // Ou, se preferir esconder em vez de remover:
        // glaspToaster.style.display = "none";
      }
    };

    removeAndHideGlaspElements();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      setLoading(true);
      if (isRegistering) {
        await register(email, password);
        setSuccessMessage("Usuário cadastrado com sucesso! Faça login.");
        setIsRegistering(false);
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

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div>
          <input
            type="email"
            value={email}
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailError(validateEmail(email) ? "" : "Por favor, insira um e-mail válido.")}
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordError(
              validatePassword(password)
                ? ""
                : "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial."
            )}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-password-btn">
            <img src={showPassword ? eyeOpenIcon : eyeClosedIcon} alt="Mostrar senha" width={20} height={20} />
          </button>
          {passwordError && <span className="error">{passwordError}</span>}
        </div>

        {error && <span className="error">{error}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Processando..." : isRegistering ? "Cadastrar" : "Entrar"}
        </button>

        <p>
          {isRegistering ? "Já tem uma conta?" : "Não tem uma conta?"} {" "}
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
            {isRegistering ? "Faça login" : "Cadastre-se"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;




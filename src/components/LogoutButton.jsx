// src/components/LogoutButton.jsx
import React from 'react';

const LogoutButton = ({ onLogout }) => {
  return (
    <button onClick={onLogout} className="logout-button">
      Sair
    </button>
  );
};

export default LogoutButton;
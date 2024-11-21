import React, { useState } from 'react';
import styles from '../Login/Login.module.css'; // Importa o CSS modularizado
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Mensagem de erro, se houver
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Enviando dados de login para o backend
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: username,
        password: password,
      });

      // Armazenar o token JWT no localStorage
      localStorage.setItem('token', response.data.access_token);

      // Redirecionado para a Home após login
      navigate('/Home');
    } catch (error) {
      setError('Usuário ou senha incorretos'); // Mensagem de erro caso autenticação falhe
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {/* Adiciona a imagem acima do título */}
        <img
          src="/images/Logo Minimalista Materiais de Construção Azul e Laranja.png" // Caminho correto da imagem
          alt="Minha Loja"
          className={styles.logoImage}
        />
        <h2 className={styles.loginTitle}>Faça seu login de acesso</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>
            Usuário
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.formInput}
            placeholder="Digite seu usuário"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.formInput}
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" className={styles.loginButton}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;

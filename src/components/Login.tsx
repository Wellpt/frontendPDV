import React , { useState } from "react";
import './login.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [ username, setUsername] = useState('');
  const [ password, setPassword] = useState('');
  const [ error, setError] = useState(''); // Exibir mensagem de erro se houver
  const navigate = useNavigate() // hook do reqct para redirecionamento

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Enviando dados de login backend 
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: username,
        password: password,
      });

      console.log (response.data)

      // Armazenar o token JWT no localStorage
      localStorage.setItem('token', response.data.token);

      // Redirecionado para a Home apos login
      navigate('/Home');
    }catch (error) {
      console.log (error)
      setError('Usuario ou senha incorretos'); // mensagem de erro caso autenticação falhe
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input 
            type="text" 
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder="Digite seu usuario"
             />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
};

export default Login

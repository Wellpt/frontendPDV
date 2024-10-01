import React from 'react';
import ReactDOM from 'react-dom/client';  // Agora estamos importando do pacote `react-dom/client`
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

// Criar o root e renderizar o App
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

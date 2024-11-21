import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login.tsx";
import Produto from './components/Produto/Produto.tsx'
import Home from './components/Home/Home.tsx'
import PrivateRoute from "./PrivateRoute.tsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Definir a rota de login */}
                <Route path="/login" element={<Login />} />
                
                {/* Rotas protegidas */}
                <Route path="/home" element={<PrivateRoute component={Home} />} />

                <Route path="/produto" element={<PrivateRoute component={Produto} />} />
                
                {/* Redirecionar para /login se a rota for / */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

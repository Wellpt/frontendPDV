import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login.tsx";
import Home from './components/Home.tsx'
import PrivateRoute from "./PrivateRoute.tsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Definir a rota de login */}
                <Route path="/login" element={<Login />} />
                
                {/* Rota protegida */}
                <Route path="/home" element={<PrivateRoute component={Home} />} />
                
                {/* Redirecionar para /login se a rota for / */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

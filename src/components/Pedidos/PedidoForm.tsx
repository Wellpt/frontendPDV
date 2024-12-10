import React, { useState} from "react";
import axios from 'axios';
import style from './Pedidos.module.css';

const PedidoForm = ({ onPedidoCreated }: {onPedidoCreated: () => void }) => {

    const [customerId, setCustomerId] =useState('');
    const [itens, setItens] = useState('');
    const [total, setTotal] = useState('');

    const handleCreatePedido = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post (
                'http://localhost:3000/orders',
                {customerId, itens: JSON.parse(itens), total: parseFloat(total) },
                {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            onPedidoCreated();
            setCustomerId('');
            setItens('');
            setTotal('');
        } catch (error) {
            console.error ('Erro ao criar o pedido:', error);
        }
    };
    
    return (
        <form className={style.form} onSubmit={handleCreatePedido}>
            <h2>Criar pedido</h2>
            <input 
                type="text" 
                placeholder="ID do cliente"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
            />
            <textarea
                placeholder='Itens (Exemplo: [{"produtoId": 1, "quantidade": 2}])'
                value={itens}
                onChange={(e) => setItens(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required 
            />
            <button type="submit">Criar pedido</button>
        </form>
    );
};

export default PedidoForm
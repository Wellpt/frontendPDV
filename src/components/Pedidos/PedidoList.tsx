import axios from 'axios';
import React from 'react';
import styles from '../Pedidos/Pedidos.module.css';

const PedidoList = ({ pedidos, onPedidosDeleted }: {pedidos: any[]; onPedidosDeleted: () => void }) => {
    console.log("Pedidos recebidos pelo PedidoList:", pedidos);


    const handleDeletePedido = async (id: number) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token não encontrado');
                return;
            }


            await axios.delete(`http://localhost:3000/orders/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onPedidosDeleted();
        } catch (error) {
            console.error('Erro ao deletar o pedido:', error);
        }
    };
    return (
        <div className={styles.list}>
            <h2>Click em Mostrar Pedidos para ver todos</h2>
            {pedidos.orders?.length > 0 ? (
                pedidos.orders.map((pedido, index) => (
                    <div key={pedido.id || index} className={styles.pedido}>
                        <p>ID: {pedido.id}</p>
                        <ul>
                            {pedido.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.productName} - Quantidade: {item.quantity} - Preço Unitário: {item.unitPrice}
                                </li>
                            ))}
                        </ul>
                        <p>Valor Total do Pedido: {pedido.totalPrice || 0}</p>
                        <p>Data: {new Date(pedido.createdAt).toLocaleString()}</p>
                        <p>Status: {pedido.status}</p>
                        <h3>Itens:</h3>
                        <button className ={styles.delete} onClick={() => handleDeletePedido(pedido.id)}>Deletar</button>
                    </div>
                ))
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default PedidoList;
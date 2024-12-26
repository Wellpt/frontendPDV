import axios from 'axios';
import React from 'react';
import styles from '../Pedidos/Pedidos.module.css';

const PedidoList = ({ pedidos, onPedidosDeleted }: { pedidos: any[]; onPedidosDeleted: () => void }) => {
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

    const handlePrintPedido = (pedido) => {
        if (!pedido || !pedido.items) {
            console.error('Pedido invalido ou sem itens:', pedido);
            return;
        }

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
             <head>
            <title>Impressão de Pedido</title>
            <style>
                @media print {
                    body {
                        margin: 0;
                        padding: 10px;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                    }

                    @page {
                        size: 80mm auto; /* Tamanho do papel */
                        margin: 0;
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    .header img {
                        max-width: 60%; /* Redimensiona o logo */
                        margin-bottom: 10px;
                    }

                    .header p {
                        margin: 2px 0; /* Ajusta margens entre linhas */
                        font-size: 12px;
                    }

                    .divider {
                        border-top: 1px dashed #000; /* Linha pontilhada */
                        margin: 10px 0;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        text-align: left;
                        padding: 5px;
                        border-bottom: 1px solid #ddd;
                    }

                    .total {
                        font-weight: bold;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
            <body>
            <div class="header">
                <p><strong>LOJA MATERIAL FILANO</strong></p>
                <p>Materias de construção para toda sua obra</p>
                <p>Bairro XXXX</p>
                <p>Numero XXXX CIDADE XXXX</p>
                <p>Telelefone: XXXXXXXXX</p>
            </div>
            <div class="divider"></div>
            <h1>Detalhes do Pedido</h1>
            <p><strong>ID:</strong> ${pedido.id || 'N/A'}</p>
            <p><strong>Status:</strong> ${pedido.status || 'N/A'}</p>
            <p><strong>Data:</strong> ${pedido.createdAt ? new Date(pedido.createdAt).toLocaleString() : 'N/A'}</p>
            <h2>Itens</h2>
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${pedido.items
                        .map(
                            (item) =>
                                `<tr>
                                    <td>${item.productName || 'Produto'}</td>
                                    <td>${item.quantity || 0}</td>
                                    <td>${(item.quantity * item.unitPrice || 0).toFixed(2)}</td>
                                </tr>`
                        )
                        .join('')}
                    <tr>
                        <td colspan="2" class="total">Total</td>
                        <td class="total">${pedido.totalPrice ? pedido.totalPrice.toFixed(2) : '0.00'}</td>
                    </tr>
                </tbody>
            </table>
            <div class="divider"></div>
            <p style="text-align: center;">Obrigado pela preferência!</p>
        </body>
            </html>`
            );
        }

        if (printWindow) {
            printWindow.print();
            printWindow.document.close();
        } else {
            console.error('Erro ao abrir janela de impressão.');
        }
    };


    return (
        <div className={styles.list}>
            <h2>Click em Mostrar Pedidos para ver todos</h2>
            {pedidos.orders?.length > 0 ? (
                pedidos.orders.map((pedido, index) => (
                    <div key={pedido.id || index} className={styles.pedido}>
                        <p>ID: {pedido.id}</p>
                        <h3>Itens:</h3>
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
                        <div className="form-buttons-container">
                            <button
                                className={styles.delete}
                                onClick={(e) => {
                                    e.stopPropagation(); // Impede propagação do evento
                                    handleDeletePedido(pedido.id);
                                }}
                            >
                                Deletar
                            </button>
                            <button
                                className={styles.imprimir}
                                onClick={(e) => {
                                    e.preventDefault(); // Impede comportamento padrão
                                    e.stopPropagation(); // Impede propagação do evento
                                    handlePrintPedido(pedido);
                                }}
                            >
                                Imprimir
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default PedidoList;
// import styles from './Produto.module.css';

import styles from '../Pedidos/Pedidos.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PedidoList from './PedidoList.tsx';
import Modal from '../Modal/Modal.tsx';
import ModalPedido from '../Modal/ModalPedido.tsx'; // Importa o novo modal para criar pedidos
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Pedidos = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [showPedidos, setShowPedidos] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [message, setMessage] = useState<string | object | object[]>('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    // Função para buscar todos os pedidos
    const fetchPedidos = async () => {
        try {
            console.log('Executando fetchPedidos...');
            const response = await axios.get('http://localhost:3000/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log ("Dados recebidos:", response.data)
            setPedidos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os pedidos:', error);
        }
    };
    const taggerPedidos = async () => {
        if (showPedidos) {
            setShowPedidos(false);
            setPedidos([]);
        }else {
            await fetchPedidos();
            setShowPedidos(true);
        }
    }

    // Função para criar um novo pedido
    const handleCreatePedido = async (pedido: { products: { productName: string; quantity: number }[]; status: string }) => {
        try {
            const response = await axios.post('http://localhost:3000/orders', pedido, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data) {
                setMessage('Pedido criado com sucesso.');
                fetchPedidos(); // Atualiza a lista de pedidos
            } else {
                setMessage('Não foi possível criar o pedido.');
            }
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            setMessage('Erro ao criar o pedido. Verifique os dados e tente novamente.');
        } finally {
            setIsModalOpen(false); // Fecha o modal de novo pedido
            setIsMessageModalOpen(true); // Exibe o modal de mensagem
        }
    };

    // Função para buscar pedidos com base em critérios
    const handleSearchPedidos = async (criteria: { customerId?: string }) => {
        try {
            const response = await axios.get('http://localhost:3000/orders/search', {
                params: criteria,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setPedidos(response.data); // Atualiza a lista com os resultados
            setMessage('Busca concluída.'); // Exibe uma mensagem de sucesso
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            setMessage('Erro ao buscar pedidos. Verifique os dados e tente novamente.');
        } finally {
            setIsSearchModalOpen(false); // Fecha o modal de busca
            setIsMessageModalOpen(true); // Exibe o modal de mensagem
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftColumn}>
            <h1 className={styles.title}>Gerenciador de Pedidos</h1>
                <img
                    src="/images/Logo Minimalista Materiais de Construção Azul e Laranja.png"
                    alt="Imagem da loja"
                    className={styles.logoImage}
                />
            </div>
            <div className={styles.rightColumn}>
                <div className={styles.buttonsContainer}>
                    <button className={styles.button} onClick={() => setIsModalOpen(true)}>
                    <AddCircleIcon style={{ marginRight: '8px' }} /> Novo Pedido
                    </button>
                    <button className={styles.button} onClick={taggerPedidos}>
                    <SearchIcon style={{ marginRight: '8px' }} />
                        {showPedidos ? 'Ocultar Pedidos' : 'Ver Pedidos'}
                    </button>
                    
                    <button className={styles.button} onClick={() => setIsSearchModalOpen(true)}>
                    <SearchIcon style={{ marginRight: '8px' }} />Buscar ID
                    </button>
                    <button className={styles.voltar} onClick={() => navigate('/home')}>
                            <HomeIcon style={{ marginRight: '8px' }} /> Voltar para Home
                    </button>
                    
                </div>
                {/* Lista de pedidos */}
                <PedidoList pedidos={pedidos} onPedidosDeleted={fetchPedidos} />
            </div>

            {/* ModalPedido para criar novo pedido */}
            <ModalPedido
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePedido}
            />

            {/* Modal para buscar pedidos */}
            <Modal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                title="Buscar Pedidos"
                inputs={[{ name: 'customerId', placeholder: 'ID do Cliente (opcional)', type: 'text' }]}
                onSubmit={(data) => handleSearchPedidos({ customerId: data.customerId })}
            />

            {/* Modal de mensagem */}
            <Modal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    setIsMessageModalOpen(false);
                    setMessage('');
                }}
                title="Mensagem"
                message={message}
            />

            <footer className={styles.footer}>
                <p>© 2024 Minha Empresa - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Pedidos;

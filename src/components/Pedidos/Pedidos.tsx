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
import ListIcon from '@mui/icons-material/List';

const Pedidos = () => {
    const navigate = useNavigate();
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [showPedidos, setShowPedidos] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
    const [message, setMessage] = useState<string | object | object[]>('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [searchId, setSearchId] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<'dia' | 'semana' | 'mes' | ''>('');
    const [selectedStatus, setSelectedStatus] = useState<'CONCLUIDO' | 'PENDENTE' | ''>('');


    // Função para buscar todos os pedidos
    const fetchPedidos = async () => {
        try {
            console.log('Executando fetchPedidos...');
            const response = await axios.get('http://localhost:3000/orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Dados recebidos:", response.data)
            setPedidos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os pedidos:', error);
        }
    };
    const taggerPedidos = async () => {
        if (showPedidos) {
            setShowPedidos(false);
            setPedidos([]);
        } else {
            await fetchPedidos();
            setShowPedidos(true);
        }
    }

    // Função para buscar pedidos por periodo
    const handleFetchByPeriod = async () => {
        if (!selectedPeriod && !selectedStatus) {
            setMessage('Erro: Período e status são obrigatório para a busca.');
            setIsMessageModalOpen(true);
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/orders', {
                params: { periodo: selectedPeriod, status: selectedStatus },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            const { orders, totalBalance } = response.data;

            if (orders && orders.length > 0) {
                setPedidos(orders); // Atualiza os pedidos no estado
                setMessage(`Pedidos ${selectedStatus.toLocaleLowerCase()} encontrados para o período ${selectedPeriod}. Total acumulado: R$ ${totalBalance.toFixed(2)}`);
            } else {
                setPedidos([]); // Limpa os pedidos se nenhum for encontrado
                setMessage(`Nenhum pedido encontrado para o período ${selectedPeriod}.`);
            }

            setIsMessageModalOpen(true); // Exibe o modal
        } catch (error) {
            console.error('Erro ao buscar os pedidos:', error);
            setMessage('Erro ao buscar os pedidos. Verifique o período e tente novamente.');
            setPedidos([]); // Garante que os pedidos sejam limpos em caso de erro
            setIsMessageModalOpen(true);
        } finally {
            setIsPeriodModalOpen(false); // Fecha o modal de seleção de período
        }
    };


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

    // Função para buscar pedidos pelo ID
    const handleSearchPedidos = async (criteria: { customerId?: string }) => {
        try {
            if (!criteria.customerId) {
                setMessage('Erro: ID do pedido é obrigatório para a busca.');
                setIsMessageModalOpen(true); // Exibe o modal de mensagem de erro
                return;
            }

            const response = await axios.get(`http://localhost:3000/orders/${criteria.customerId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Verifica se o pedido foi encontrado
            if (!response.data || Object.keys(response.data).length === 0) {
                throw new Error('Pedido não encontrado');
            }

            setPedidos([response.data]); // Atualiza a lista com os resultados
            setMessage(`Pedido encontrado para o ID ${criteria.customerId}.`);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);

            // Exibe mensagem de erro
            setPedidos([]); // Limpa a lista de pedidos
            setMessage(`Erro: Pedido com ID ${criteria.customerId} não foi encontrado.`);
        } finally {
            setIsSearchModalOpen(false); // Fecha o modal de busca por ID
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
                        <ListIcon style={{ marginRight: '8px' }} />
                        {showPedidos ? 'Ocultar Pedidos' : 'Ver Pedidos'}
                    </button>

                    <button className={styles.button} onClick={() => setIsSearchModalOpen(true)}>
                        <SearchIcon style={{ marginRight: '8px' }} />Buscar ID
                    </button>
                    <button
                        className={styles.button}
                        onClick={() => setIsPeriodModalOpen(true)}
                    >
                        <SearchIcon style={{ marginRight: '8px' }} /> Relatório por Período
                    </button>
                    <button className={styles.voltar} onClick={() => navigate('/home')}>
                        <HomeIcon style={{ marginRight: '8px' }} /> Voltar para Home
                    </button>


                </div>
                {/* Lista de pedidos */}
                <PedidoList pedidos={pedidos} onPedidosDeleted={fetchPedidos} />
            </div>

            {/* Modal para Relatório por Período */}
<Modal
    isOpen={isPeriodModalOpen}
    onClose={() => setIsPeriodModalOpen(false)}
    title="Relatório de Pedidos por Período"
>
    <div>
        <h2>Selecione o Período</h2>
        <div className={styles.radioGroup}>
            <label>
                <input
                    type="radio"
                    name="period"
                    value="dia"
                    onChange={(e) => setSelectedPeriod(e.target.value as 'dia' | 'semana' | 'mes')}
                    checked={selectedPeriod === 'dia'}
                />
                Dia
            </label>
            <label>
                <input
                    type="radio"
                    name="period"
                    value="semana"
                    onChange={(e) => setSelectedPeriod(e.target.value as 'dia' | 'semana' | 'mes')}
                    checked={selectedPeriod === 'semana'}
                />
                Semana
            </label>
            <label>
                <input
                    type="radio"
                    name="period"
                    value="mes"
                    onChange={(e) => setSelectedPeriod(e.target.value as 'dia' | 'semana' | 'mes')}
                    checked={selectedPeriod === 'mes'}
                />
                Mês
            </label>
        </div>

        <h2>Selecione o Status</h2>
        <div className={styles.radioGroup}>
            <label>
                <input
                    type="radio"
                    name="status"
                    value="CONCLUIDO"
                    onChange={(e) => setSelectedStatus(e.target.value as 'CONCLUIDO' | 'PENDENTE')}
                    checked={selectedStatus === 'CONCLUIDO'}
                />
                Concluídos
            </label>
            <label>
                <input
                    type="radio"
                    name="status"
                    value="PENDENTE"
                    onChange={(e) => setSelectedStatus(e.target.value as 'CONCLUIDO' | 'PENDENTE')}
                    checked={selectedStatus === 'PENDENTE'}
                />
                Pendentes
            </label>
        </div>

        <div className={styles.formButtons}>
            <button
                onClick={handleFetchByPeriod}
                className={styles.submitButton}
            >
                Buscar
            </button>
        </div>
    </div>
</Modal>


            {/* ModalPedido para criar novo pedido */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Criar Novo Pedido"
            >
                <div>
                    {/* Adicionando os flags de status */}
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="CONCLUIDO"
                                checked={status === 'CONCLUIDO'}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            Concluído
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="PENDENTE"
                                checked={status === 'PENDENTE'}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            Pendente
                        </label>
                    </div>

                    {/* Botões de ações */}
                    <button
                        onClick={() => handleCreatePedido({ products: pedidoProducts, status })}
                        style={{
                            padding: '10px',
                            backgroundColor: '#00bf63',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Criar Pedido
                    </button>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        style={{
                            padding: '10px',
                            backgroundColor: '#ccc',
                            color: '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginLeft: '10px',
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </Modal>

            {/* ModalPedido para criar novo pedido */}
            <ModalPedido
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePedido}
            />

            {/* Modal para buscar pedidos */}
            <Modal
                isOpen={isSearchModalOpen}
                onClose={() => {
                    setIsSearchModalOpen(false);
                    setSearchId(''); // Limpa o input ao fechar
                }}
                title="Buscar Pedido"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Digite o ID do Pedido"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        style={{ padding: '8px', fontSize: '1rem', borderRadius: '5px' }}
                    />
                    <button
                        onClick={() => handleSearchPedidos({ customerId: searchId })}
                        style={{
                            padding: '10px',
                            backgroundColor: '#00bf63',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Buscar
                    </button>
                </div>
            </Modal>

             {/* Modal de mensagem */}
             <Modal
    isOpen={isMessageModalOpen}
    onClose={() => {
        setIsMessageModalOpen(false);
        setMessage('');
    }}
    title="Detalhes do Pedido"
>
    {pedidos.length > 0 ? (
        <div>
            <h2>Pedido ID: {pedidos[0].id}</h2>
            <p><strong>Status:</strong> {pedidos[0].status}</p>
            <p><strong>Data:</strong> {new Date(pedidos[0].createdAt).toLocaleString()}</p>
            <h3>Itens do Pedido:</h3>
            <ul>
                {pedidos[0].items.map((item, index) => (
                    <li key={index}>
                        Produto: <strong>{item.productName}</strong> <br />
                        Quantidade: {item.quantity} <br />
                        Preço Unitário: {item.unitPrice} <br />
                        Subtotal: {(item.quantity * item.unitPrice).toFixed(2)}
                    </li>
                ))}
            </ul>
            <p><strong>Total do Pedido:</strong> {pedidos[0].totalPrice}</p>
        </div>
    ) : (
        <p>{message || 'Nenhum pedido encontrado.'}</p>
    )}
</Modal>

            <footer className={styles.footer}>
                <p>© 2024 Minha Empresa - Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Pedidos;

import styles from './Produto.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal.tsx';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';

const Produto = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    const [isNameInputModalOpen, setNameInputModalOpen] = useState(false);
    const [message, setMessage] = useState<object | object[] | string>(''); // Garante o tipo correto para o modal
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const token = localStorage.getItem('token');

    // Função para criar um produto
    const handleCreateProduct = async (product: { name: string; price: number; description: string; stock: number }) => {
        try {

            // Conversão de valores de price e stock para números
        const formattedProduct = {
            ...product,
            price: parseFloat(product.price), // Converte price para Float
            stock: parseInt(product.stock, 10), // Converte stock para Integer
        };

            const response = await axios.post('http://localhost:3000/products', formattedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.product) {
                const productData = response.data.product;

                const sucessMessage = {
                    message: 'Produto criado com sucesso!',
                    product: productData
                };

                setMessage(sucessMessage); // Envia diretamente o objeto do produto para o modal
            } else {
                setMessage('Produto criado com sucesso, mas não foi possível obter os detalhes do produto.');
            }

            setIsMessageModalOpen(true);
        } catch (error) {
            console.error('Erro ao criar o produto:', error);
            setMessage('Erro ao criar o produto. Verifique os dados e tente novamente.');
            setIsMessageModalOpen(true);
        } finally {
            setIsModalOpen(false);
        }
    };

    // Função para buscar produto por ID
    const handleFetchProductById = async (productId: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data); // Passa como objeto
            setIsMessageModalOpen(true);
        } catch (error) {
            setMessage('Produto não encontrado.');
            setIsMessageModalOpen(true);
        }
    };

    // Função para buscar produto por nome
    const handleFetchProductByName = async (productName: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/products/name/${productName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data); // Passa como array de objetos
            setIsMessageModalOpen(true);
        } catch (error) {
            setMessage('Produto não encontrado.');
            setIsMessageModalOpen(true);
        }
    };

    // Função para buscar todos os produtos
    const handleFetchAllProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(response.data); // Passa como array de objetos
            setIsMessageModalOpen(true);
        } catch (error) {
            setMessage('Erro ao buscar os produtos.');
            setIsMessageModalOpen(true);
        }
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.leftColumn}>
                    <h1 className={styles.title}>Gerenciador de Vendas</h1>
                    <img
                        src="/images/Logo Minimalista Materiais de Construção Azul e Laranja.png"
                        alt="PDV Legal"
                        className={styles.logoImage}
                    />
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.buttonsContainer}>
                        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
                            <AddCircleIcon style={{ marginRight: '8px' }} /> Criar Produto
                        </button>
                        <button className={styles.button} onClick={() => setIsInputModalOpen(true)}>
                            <SearchIcon style={{ marginRight: '8px' }} /> Buscar por ID
                        </button>
                        <button className={styles.button} onClick={() => setNameInputModalOpen(true)}>
                            Buscar pelo Nome
                        </button>
                        <button className={styles.button} onClick={handleFetchAllProducts}>
                            Todos os Produtos
                        </button>
                        <button className={styles.voltar} onClick={() => navigate('/home')}>
                            <HomeIcon style={{ marginRight: '8px' }} /> Voltar para Home
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Criar Produto"
                inputs={[
                    { name: 'name', placeholder: 'Nome do Produto', type: 'text' },
                    { name: 'price', placeholder: 'Preço', type: 'number' },
                    { name: 'description', placeholder: 'Descrição', type: 'text' },
                    { name: 'stock', placeholder: 'Estoque', type: 'number' },
                ]}
                onSubmit={handleCreateProduct}
            />

            <Modal
                isOpen={isInputModalOpen}
                onClose={() => setIsInputModalOpen(false)}
                title="Buscar por ID"
                inputs={[{ name: 'id', placeholder: 'Digite o ID do produto', type: 'text' }]}
                onSubmit={(data) => handleFetchProductById(data.id)}
            />

            <Modal
                isOpen={isNameInputModalOpen}
                onClose={() => setNameInputModalOpen(false)}
                title="Buscar por Nome"
                inputs={[{ name: 'name', placeholder: 'Digite o Nome do produto', type: 'text' }]}
                onSubmit={(data) => handleFetchProductByName(data.name)}
            />

            <Modal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                title="Mensagem"
                message={message}
            />
            <Modal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} message={message} title={''} />
            <footer className={styles.footer}>
                <p>© 2024 Minha Empresa - Todos os direitos reservados.</p>
            </footer>
        </>
    );
};

export default Produto;

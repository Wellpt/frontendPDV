import styles from './Produto.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal.tsx';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';

const Produto = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isSearchByIdModalOpen, setIsSearchByIdModalOpen] = useState(false)
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
    const handlerDeleteProduct = async (productId: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data?.message) {
                setMessage(response.data.message);
            } else {
                setMessage(`Produto com ID ${productId} foi deletado com sucesso.`);
            }

            setIsMessageModalOpen(true);
        } catch (error) {
            console.error('Erro ao deletar o produto:', error);
            setMessage('Erro ao deletar o produto, verifique o ID e tente novamente.');
            setIsMessageModalOpen(true)
        } finally {
            setIsDeleteModalOpen(false);
        }
    }

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
                        <button className={styles.button} onClick={() => setIsSearchByIdModalOpen(true)}>
                            <SearchIcon style={{ marginRight: '8px' }} /> Buscar ID
                        </button>
                        <button className={styles.button} onClick={() => setNameInputModalOpen(true)}>
                            <SearchIcon style={{ marginRight: '8px' }} /> Buscar nome
                        </button>
                        <button className={styles.button} onClick={handleFetchAllProducts}>
                            <ListIcon style={{ marginRight: '8px' }} /> Todos produtos
                        </button>
                        <button className={styles.delete} onClick={() => setIsDeleteModalOpen(true)}>
                            <DeleteIcon style={{ marginRight: '8px' }} /> Deletar Produtos
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
                isOpen={isSearchByIdModalOpen}
                onClose={() => setIsSearchByIdModalOpen(false)} // Fecha o modal de entrada
                title="Buscar por ID"
                inputs={[{ name: 'id', placeholder: 'Digite o ID do produto', type: 'text' }]}
                onSubmit={(data) => {
                    handleFetchProductById(data.id); // Executa a busca
                    setIsSearchByIdModalOpen(false); // Fecha o modal de entrada
                }}
            />

            <Modal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    console.log('Fechando modal de mensagem');
                    setIsMessageModalOpen(false); // Fecha o modal de mensagem
                    setMessage(''); // Limpa a mensagem exibida
                }}
                title="Resultado da Busca por ID"
                message={message}
            />

            <Modal
                isOpen={isNameInputModalOpen}
                onClose={() => setNameInputModalOpen(false)} // Fecha o modal de entrada
                title="Buscar por Nome"
                inputs={[{ name: 'name', placeholder: 'Digite o Nome do produto', type: 'text' }]}
                onSubmit={(data) => {
                    handleFetchProductByName(data.name); // Executa a busca
                    setNameInputModalOpen(false); // Fecha o modal de entrada
                }}
            />

            <Modal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    console.log('Fechando modal de mensagem');
                    setIsMessageModalOpen(false); // Fecha o modal de mensagem
                    setMessage(''); // Limpa a mensagem exibida
                }}
                title="Resultado da Busca por Nome"
                message={message}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Deletar Produto"
                inputs={[{ name: 'id', placeholder: 'Digite o ID do produto', type: 'text' }]}
                onSubmit={(data) => handlerDeleteProduct(data.id)} // Passa o ID para a função de exclusão
            />

            <footer className={styles.footer}>
                <p>© 2024 Minha Empresa - Todos os direitos reservados.</p>
            </footer>
        </>
    );
};

export default Produto;

import styles from './Home.module.css'; // Importa o CSS modularizado
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // Hook para redirecionamento

    // Funções para fazer o redirecionamento
    const paginaProdutos = () => {
        navigate('/produto'); // Rota para Produtos
    };
    const paginaPedidos = () => {
        navigate('/pedidos'); // Rota para Pedidos
    };
    const areaUsuario = () => {
        navigate('/usuarios'); // Rota para Área de Usuários
    };

    return (
        <>
            <div className={styles.pageContainer}>
                {/* Coluna da esquerda */}
                <div className={styles.leftColumn}>
                    <img
                        src="/images/Logo Minimalista Materiais de Construção Azul e Laranja.png"
                        alt="Minha Loja"
                        className={styles.logoImage}
                    />
                    <h1 className={styles.title}>Bem-vindo ao Gerenciador de vendas</h1>
                    <p className={styles.subtitle}>
                        Escolha a área que deseja acessar e gerencie tudo com facilidade!
                    </p>
                </div>

                {/* Coluna da direita */}
                <div className={styles.rightColumn}>
                    <div className={styles.buttonsContainer}>
                        <button className={styles.button} onClick={paginaProdutos}>
                            Ir para Produtos
                        </button>
                        <button className={styles.button} onClick={paginaPedidos}>
                            Ir para Pedidos
                        </button>
                        <button className={styles.button} onClick={areaUsuario}>
                            Área de Usuários
                        </button>
                        <button className={styles.voltar} onClick={() => navigate('/login')}>
                            Deslogar
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>© 2024 Minha Empresa - Todos os direitos reservados.</p>
            </footer>
        </>
    );
};

export default Home;

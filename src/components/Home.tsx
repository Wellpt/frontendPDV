import React from "react";
import './home.css'

const Home = () => {
    const handlerCreateProduct = () => {
        //Direciona para rota que cria produto
        console.log ('Criar produto');
        //aqui vamos criar as funções para criar produto
    };
    const handlerfetchProductById = () => {
        console.log ('Buscar produto pelo ID')
        // Logica para buscar produto pelo ID
    };
    const handlerfetchProductByName = () => {
        console.log ('Busca produto pelo nome')
        // Logica para buscar produto pelo nome
    };
    const handlerfetchAllProduct = () => {
        console.log('Buscar todos os produtos')
        // Logica para buscar todos os produtos
    };

    return (
        <div className="home-container">
            <h1>Home de produtos</h1>
            <div className="buttons-container">
                <button className="home-button" onClick={handlerCreateProduct}>
                    Criar Produto
                </button>
                <button className="home-button" onClick={handlerfetchProductById}>
                    Buscar Produto por ID
                </button>
                <button className="home-button" onClick={handlerfetchProductByName}>
                    Buscar Produto pelo nome
                </button>
                <button className="home-button" onClick={handlerfetchAllProduct}>
                    Buscar todos os Produtos
                </button>
            </div>
        </div>
    );
    
};

export default Home
import React, { useState } from 'react';
import styles from './ModalPedido.module.css';

interface ModalPedidoProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pedido: { products: { productId: number; quantity: number }[]; status: string }) => void;
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ isOpen, onClose, onSubmit }) => {
    const [pedidoProducts, setPedidoProducts] = useState<{ productId: string; quantity: string }[]>([
        { productId: '', quantity: '' },
    ]);
    const [status, setStatus] = useState('');

    // Adiciona um novo produto ao formulário
    const addProduct = () => {
        setPedidoProducts([...pedidoProducts, { productId: '', quantity: '' }]);
    };

    // Remove um produto do formulário
    const removeProduct = (index: number) => {
        setPedidoProducts(pedidoProducts.filter((_, i) => i !== index));
    };

    // Atualiza o valor de um campo específico em um produto
    const handleProductChange = (index: number, field: 'productId' | 'quantity', value: string) => {
        const updatedProducts = [...pedidoProducts];
        updatedProducts[index][field] = value;
        setPedidoProducts(updatedProducts);
    };

    // Valida e submete os dados
    const handleSubmit = () => {
        const formattedProducts = pedidoProducts.map(({ productId, quantity }) => ({
            productId: parseInt(productId, 10), // Converte productId para número
            quantity: parseInt(quantity, 10), // Converte quantidade para número
        }));

        // Valida se todos os campos estão preenchidos
        if (formattedProducts.some((p) => !p.productId || !p.quantity)) {
            alert('Preencha todos os campos corretamente antes de enviar.');
            return;
        }

        if (!status) {
            alert('Defina o status do pedido.');
            return;
        }

        onSubmit({ products: formattedProducts, status }); // Submete os dados
        onClose(); // Fecha o modal
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Criar Novo Pedido</h2>

                <div className={styles.productList}>
                    {pedidoProducts.map((product, index) => (
                        <div key={index} className={styles.productItem}>
                            <input
                                type="number"
                                placeholder="ID do Produto"
                                value={product.productId}
                                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Quantidade"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            />
                            <button type="button" onClick={() => removeProduct(index)} className={styles.removeButton}>
                                Remover
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addProduct} className={styles.addButton}>
                        Adicionar Produto
                    </button>
                </div>

                <div className={styles.statusContainer}>
                    <input
                        type="text"
                        placeholder="Status do Pedido (EX: CONCLUIDO, PENDENTE)"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={styles.statusInput}
                    />
                </div>

                <div className={styles.actions}>
                    <button onClick={handleSubmit} className={styles.submitButton}>
                        Criar Pedido
                    </button>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalPedido;

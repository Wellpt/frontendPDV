import React, { useState } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit?: (data: any) => void; // Callback para salvar/buscar
    inputs?: { name: string; placeholder: string; type: string }[]; // Campos de entrada opcionais
    children?: React.ReactNode;
    message?: string | { message: string; product: object } | object | object[]; // Mensagem ou mensagem + produto
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, inputs, message, onSubmit }) => {
    const [formData, setFormData] = useState<{ [key: string]: string }>({});

    // Atualiza os campos de entrada dinamicamente
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Função para exibir uma tabela (para mensagens do tipo objeto/array)
    const renderTable = (data: object[] | object) => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return;
        }

        const arrayData = Array.isArray(data) ? data : [data];

        if (arrayData.length === 0 || typeof arrayData[0] !== 'object') {
            return <p>Dados inválidos fornecidos.</p>;
        }

        return (
            <table className={styles.table}>
                <thead>
                    <tr>
                        {Object.keys(arrayData[0]).map((key) => (
                            <th key={key}>{key.toUpperCase()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {arrayData.map((item: any, index) => (
                        <tr key={index}>
                            {Object.values(item).map((value, idx) => (
                                <td key={idx}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>

                {/* Renderiza campos de entrada, se fornecidos */}
                {inputs && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (onSubmit) onSubmit(formData);
                        }}
                    >
                        {inputs.map((input, index) => (
                            <input
                                key={index}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                value={formData[input.name] || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        ))}
                        <div className={styles.buttons}>
                            <button type="submit" className={styles.saveButton}>
                                Confirmar
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Renderiza mensagens, se fornecidas */}
                {message && typeof message === 'object' && 'message' in message && 'product' in message ? (
                    <div className={styles.messageContent}>
                        <p><strong>{(message as { message: string }).message}</strong></p>
                        {renderTable((message as { product: object }).product)}
                    </div>
                ) : (
                    <div className={styles.messageContent}>
                        {typeof message === 'string' ? (
                            <p>{message}</p>
                        ) : message !== undefined ? ( // Verificação para garantir que message não seja undefined
                            renderTable(message)
                        ) : null}
                    </div>
                )}

                {/* Botão "Fechar" no rodapé */}
                {message && (
                    <div className={styles.footer}>
                        <button className={styles.actionButton} onClick={onClose}>
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;

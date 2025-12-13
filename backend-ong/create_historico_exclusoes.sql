-- Tabela para armazenar histórico de exclusões
CREATE TABLE IF NOT EXISTS historico_exclusoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoEntidade ENUM('Doacao', 'Atendimento', 'Adocao', 'Recurso', 'Pessoa', 'Animal', 'Raca') NOT NULL,
    entidadeId INT NOT NULL,
    motivo TEXT NOT NULL,
    excluidoPor INT NOT NULL,
    dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dadosAntigos JSON,
    restaurado BOOLEAN DEFAULT FALSE,
    dataRestauracao DATETIME NULL,
    restauradoPor INT NULL,
    FOREIGN KEY (excluidoPor) REFERENCES pessoas(id),
    FOREIGN KEY (restauradoPor) REFERENCES pessoas(id),
    INDEX idx_tipo_entidade (tipoEntidade, entidadeId),
    INDEX idx_data_exclusao (dataExclusao),
    INDEX idx_restaurado (restaurado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Script para corrigir o campo 'tipo' na tabela doacoes
-- Execute este script no MySQL se o campo tipo for ENUM e não aceitar "Monetária"

-- Alterar o campo 'tipo' para VARCHAR(50) para aceitar qualquer valor
ALTER TABLE doacoes MODIFY COLUMN tipo VARCHAR(50);

-- Se preferir usar ENUM ao invés de VARCHAR, use:
-- ALTER TABLE doacoes MODIFY COLUMN tipo ENUM('Monetária', 'Itens') NOT NULL;


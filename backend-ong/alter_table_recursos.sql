-- Script para corrigir o campo 'tipo' e adicionar campo 'valor' na tabela recursos
-- Execute este script no MySQL

-- 1. Alterar o campo 'tipo' para VARCHAR(50) para aceitar qualquer valor
-- (ou se preferir manter ENUM, descomente a linha abaixo e ajuste os valores)
ALTER TABLE recursos MODIFY COLUMN tipo VARCHAR(50);

-- 2. Adicionar campo 'valor' para armazenar o valor estipulado em reais
ALTER TABLE recursos ADD COLUMN valor DECIMAL(10,2) DEFAULT 0.00 AFTER quantidade;

-- Se preferir usar ENUM ao invés de VARCHAR, use:
-- ALTER TABLE recursos MODIFY COLUMN tipo ENUM('Ração', 'Medicamento', 'Material', 'Outro') NOT NULL;


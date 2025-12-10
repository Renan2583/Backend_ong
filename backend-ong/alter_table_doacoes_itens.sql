-- Script para adicionar campos nomeItem e valorItem na tabela doacoes_itens
-- Execute este script no MySQL

-- Primeiro, permitir que recursoId seja NULL (para itens manuais)
ALTER TABLE doacoes_itens 
MODIFY COLUMN recursoId INT NULL;

-- Adicionar campos para armazenar nome e valor dos itens doados manualmente
ALTER TABLE doacoes_itens 
ADD COLUMN nomeItem VARCHAR(255) NULL AFTER quantidade,
ADD COLUMN valorItem DECIMAL(10,2) NULL AFTER nomeItem;

-- Agora a tabela suporta tanto itens de recursos (recursoId) quanto itens manuais (nomeItem, valorItem)


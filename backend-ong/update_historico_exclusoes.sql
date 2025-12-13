-- Atualizar tabela historico_exclusoes para incluir novos tipos e campos de restauração
-- Execute os comandos um por um, ignorando erros se as colunas/índices já existirem

-- 1. Atualizar ENUM para incluir novos tipos
ALTER TABLE historico_exclusoes 
MODIFY COLUMN tipoEntidade ENUM('Doacao', 'Atendimento', 'Adocao', 'Recurso', 'Pessoa', 'Animal', 'Raca') NOT NULL;

-- 2. Adicionar coluna restaurado (ignore erro se já existir)
ALTER TABLE historico_exclusoes 
ADD COLUMN restaurado BOOLEAN DEFAULT FALSE;

-- 3. Adicionar coluna dataRestauracao (ignore erro se já existir)
ALTER TABLE historico_exclusoes 
ADD COLUMN dataRestauracao DATETIME NULL;

-- 4. Adicionar coluna restauradoPor (ignore erro se já existir)
ALTER TABLE historico_exclusoes 
ADD COLUMN restauradoPor INT NULL;

-- 5. Adicionar foreign key (execute apenas se a coluna restauradoPor não tiver FK ainda)
-- Descomente a linha abaixo se necessário, mas pode dar erro se a FK já existir
-- ALTER TABLE historico_exclusoes 
-- ADD FOREIGN KEY (restauradoPor) REFERENCES pessoas(id);

-- 6. Criar índice (ignore erro se já existir)
CREATE INDEX idx_restaurado ON historico_exclusoes(restaurado);

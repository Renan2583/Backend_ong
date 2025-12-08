-- Script para alterar o tipo da coluna fotoUrl na tabela animais
-- Execute este script no MySQL para permitir armazenar imagens em base64

ALTER TABLE animais MODIFY COLUMN fotoUrl TEXT;

-- TEXT pode armazenar até 65.535 bytes
-- Se precisar de mais espaço, use LONGTEXT (até 4GB):
-- ALTER TABLE animais MODIFY COLUMN fotoUrl LONGTEXT;


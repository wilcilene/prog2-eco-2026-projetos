-- =====================================================
-- RACEHUB v3.0 - MIGRAÇÃO SEGURA
-- Execute este arquivo no banco existente.
-- Ele adiciona recursos sem apagar dados.
-- =====================================================

USE racehub;

-- Foto de perfil do usuário.
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS foto_perfil LONGTEXT NULL AFTER tipo;

-- Status e limite de inscritos das corridas.
ALTER TABLE corridas
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'aberta' AFTER horario;

ALTER TABLE corridas
ADD COLUMN IF NOT EXISTS limite_inscritos INT NOT NULL DEFAULT 20 AFTER status;

-- Potência do veículo, usada para ranking por categoria.
ALTER TABLE veiculos
ADD COLUMN IF NOT EXISTS potencia INT NULL AFTER cor;

-- Veículo escolhido na inscrição e nos resultados.
ALTER TABLE corridas_inscricoes
ADD COLUMN IF NOT EXISTS veiculo_id INT NULL AFTER piloto_id;

ALTER TABLE resultados
ADD COLUMN IF NOT EXISTS veiculo_id INT NULL AFTER piloto_id;

-- Padroniza registros antigos.
UPDATE corridas SET status = 'aberta' WHERE status IS NULL OR status = '';
UPDATE corridas SET limite_inscritos = 20 WHERE limite_inscritos IS NULL OR limite_inscritos <= 0;

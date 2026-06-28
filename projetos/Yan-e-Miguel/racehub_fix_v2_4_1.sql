USE racehub;

-- =====================================================
-- CORREÇÃO v2.4.1 - VEÍCULOS + TEMPOS ANTIGOS
-- =====================================================
-- Use este arquivo se o banco JÁ EXISTIA antes da versão com veículos.
-- Ele NÃO apaga dados.
-- Ele apenas garante as colunas necessárias para:
-- 1) cadastrar veículos;
-- 2) inscrever piloto em corrida com veículo;
-- 3) carregar tempos antigos mesmo sem veículo vinculado.
-- =====================================================

CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piloto_id INT NULL,
    marca VARCHAR(60) NULL,
    modelo VARCHAR(80) NULL,
    ano INT NULL,
    placa VARCHAR(20) NULL,
    cor VARCHAR(40) NULL,
    observacoes VARCHAR(255) NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Garante piloto_id em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'piloto_id'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN piloto_id INT NULL AFTER id',
    'SELECT "veiculos.piloto_id já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante marca em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'marca'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN marca VARCHAR(60) NULL AFTER piloto_id',
    'SELECT "veiculos.marca já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante modelo em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'modelo'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN modelo VARCHAR(80) NULL AFTER marca',
    'SELECT "veiculos.modelo já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante ano em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'ano'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN ano INT NULL AFTER modelo',
    'SELECT "veiculos.ano já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante placa em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'placa'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN placa VARCHAR(20) NULL AFTER ano',
    'SELECT "veiculos.placa já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante cor em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'cor'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN cor VARCHAR(40) NULL AFTER placa',
    'SELECT "veiculos.cor já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante observacoes em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'observacoes'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN observacoes VARCHAR(255) NULL AFTER cor',
    'SELECT "veiculos.observacoes já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante criado_em em veiculos.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'criado_em'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE veiculos ADD COLUMN criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER observacoes',
    'SELECT "veiculos.criado_em já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

CREATE TABLE IF NOT EXISTS corridas_inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    corrida_id INT NOT NULL,
    piloto_id INT NOT NULL,
    veiculo_id INT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_corrida_piloto (corrida_id, piloto_id)
);

-- Garante veiculo_id nas inscrições.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'corridas_inscricoes' AND COLUMN_NAME = 'veiculo_id'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE corridas_inscricoes ADD COLUMN veiculo_id INT NULL AFTER piloto_id',
    'SELECT "corridas_inscricoes.veiculo_id já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Garante veiculo_id em resultados.
-- Importante: fica NULL para tempos antigos, então eles continuam carregando.
SET @existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'resultados' AND COLUMN_NAME = 'veiculo_id'
);
SET @sql := IF(@existe = 0,
    'ALTER TABLE resultados ADD COLUMN veiculo_id INT NULL AFTER piloto_id',
    'SELECT "resultados.veiculo_id já existe" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

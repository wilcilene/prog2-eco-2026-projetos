USE racehub;

-- =====================================================
-- MIGRAÇÃO v2.4 - VEÍCULOS
-- Use este arquivo se você JÁ TEM o banco racehub criado e não quer apagar os dados.
-- Ele adiciona a estrutura necessária para veículos sem apagar tabelas antigas.
-- =====================================================

-- 1) Cria tabela de veículos, caso ainda não exista.
CREATE TABLE IF NOT EXISTS veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piloto_id INT NOT NULL,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    ano INT,
    placa VARCHAR(20),
    cor VARCHAR(40),
    observacoes VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (piloto_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- 2) Garante colunas extras em veiculos para bancos antigos.
SET @coluna_existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'cor'
);
SET @sql := IF(@coluna_existe = 0,
    'ALTER TABLE veiculos ADD COLUMN cor VARCHAR(40) NULL AFTER placa',
    'SELECT "Coluna cor já existe em veiculos" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

SET @coluna_existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'observacoes'
);
SET @sql := IF(@coluna_existe = 0,
    'ALTER TABLE veiculos ADD COLUMN observacoes VARCHAR(255) NULL AFTER cor',
    'SELECT "Coluna observacoes já existe em veiculos" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

SET @coluna_existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veiculos' AND COLUMN_NAME = 'criado_em'
);
SET @sql := IF(@coluna_existe = 0,
    'ALTER TABLE veiculos ADD COLUMN criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER observacoes',
    'SELECT "Coluna criado_em já existe em veiculos" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- 3) Adiciona veiculo_id em corridas_inscricoes, se ainda não existir.
SET @coluna_existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'corridas_inscricoes'
      AND COLUMN_NAME = 'veiculo_id'
);
SET @sql := IF(@coluna_existe = 0,
    'ALTER TABLE corridas_inscricoes ADD COLUMN veiculo_id INT NULL AFTER piloto_id',
    'SELECT "Coluna veiculo_id já existe em corridas_inscricoes" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- 4) Adiciona veiculo_id em resultados, se ainda não existir.
SET @coluna_existe := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'resultados'
      AND COLUMN_NAME = 'veiculo_id'
);
SET @sql := IF(@coluna_existe = 0,
    'ALTER TABLE resultados ADD COLUMN veiculo_id INT NULL AFTER piloto_id',
    'SELECT "Coluna veiculo_id já existe em resultados" AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE;

-- Observação:
-- Registros antigos podem ficar com veiculo_id NULL.
-- Novas inscrições e novos resultados passam a exigir veículo pelo backend.

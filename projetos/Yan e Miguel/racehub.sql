DROP DATABASE IF EXISTS racehub;
CREATE DATABASE racehub;
USE racehub;

-- =====================================================
-- BANCO DE DADOS RACEHUB
-- Este arquivo recria o banco do zero.
-- Use em instalação nova ou quando puder apagar os dados antigos.
-- =====================================================

-- =====================================================
-- USUÁRIOS
-- Guarda administradores, pilotos e clientes.
-- =====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin','piloto','cliente') NOT NULL,
    foto_perfil LONGTEXT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PISTAS
-- Guarda as pistas disponíveis no sistema.
-- =====================================================
CREATE TABLE pistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(150),
    comprimento DECIMAL(8,2)
);

INSERT INTO pistas(nome, localizacao, comprimento)
VALUES ('RaceHub Track', 'Principal', 2.45);

-- =====================================================
-- VEÍCULOS
-- Cada veículo pertence a um piloto.
-- Exemplo: Igor pode ter Gol Turbo e Civic, e escolher um deles na inscrição.
-- =====================================================
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    piloto_id INT NOT NULL,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    ano INT,
    placa VARCHAR(20),
    cor VARCHAR(40),
    potencia INT,
    observacoes VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (piloto_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);

-- =====================================================
-- CORRIDAS
-- Guarda os eventos/baterias cadastrados pelo admin.
-- =====================================================
CREATE TABLE corridas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    data DATE,
    horario TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'aberta',
    limite_inscritos INT NOT NULL DEFAULT 20,
    pista_id INT,

    FOREIGN KEY(pista_id)
    REFERENCES pistas(id)
);

-- =====================================================
-- INSCRIÇÕES EM CORRIDAS
-- Liga uma corrida a um piloto e ao veículo escolhido.
-- A UNIQUE KEY impede o mesmo piloto de se inscrever duas vezes na mesma corrida.
-- =====================================================
CREATE TABLE corridas_inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    corrida_id INT NOT NULL,
    piloto_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_corrida_piloto (corrida_id, piloto_id),

    FOREIGN KEY (corrida_id) REFERENCES corridas(id) ON DELETE CASCADE,
    FOREIGN KEY (piloto_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE
);

-- =====================================================
-- RESERVAS
-- Guarda reservas de horário da pista.
-- =====================================================
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(usuario_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL
);

-- =====================================================
-- RESULTADOS
-- Cada resultado registra corrida, piloto, veículo e tempo.
-- =====================================================
CREATE TABLE resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    corrida_id INT,
    piloto_id INT,
    veiculo_id INT,
    tempo_volta DECIMAL(8,3),
    classificacao INT,

    FOREIGN KEY(corrida_id) REFERENCES corridas(id) ON DELETE CASCADE,
    FOREIGN KEY(piloto_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY(veiculo_id) REFERENCES veiculos(id) ON DELETE SET NULL
);

-- =====================================================
-- ADMINS PADRÃO
-- São criados com senha em texto puro aqui apenas para facilitar o teste inicial.
-- Quando o server.js roda, ele cria/usa admins com senha criptografada.
-- =====================================================
INSERT INTO usuarios (nome, email, senha, tipo)
VALUES
('Admin Yan', 'yanaugustoscholze@gmail.com', 'yan', 'admin'),
('Admin Miguel', 'miguel@racehub.com', 'miguel', 'admin');

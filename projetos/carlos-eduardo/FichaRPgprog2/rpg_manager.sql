CREATE DATABASE rpg_manager;
USE rpg_manager;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE campanhas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario_id INT NOT NULL,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
);
CREATE TABLE personagens (
    id INT AUTO_INCREMENT PRIMARY KEY,

    campanha_id INT NOT NULL,

    jogador VARCHAR(100),
    personagem VARCHAR(100),

    idade INT,
    altura VARCHAR(50),
    genero VARCHAR(50),
    sexualidade VARCHAR(50),

    raca VARCHAR(100),
    classe VARCHAR(100),

    nivel INT,

    lore TEXT,

    imagem LONGTEXT,

    forca INT,
    destreza INT,
    constituicao INT,
    inteligencia INT,
    sabedoria INT,
    carisma INT,

    FOREIGN KEY (campanha_id)
    REFERENCES campanhas(id)
    ON DELETE CASCADE
);
SHOW TABLES;
DESCRIBE campanhas;
SELECT * FROM usuarios;
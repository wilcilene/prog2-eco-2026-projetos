# RPG Manager

Sistema web para gerenciamento de campanhas e personagens de RPG, desenvolvido com HTML, CSS, JavaScript, Node.js, Express e MySQL.

## Funcionalidades

* Cadastro e login de usuários
* Autenticação com JWT
* Cada usuário visualiza apenas suas próprias campanhas
* Criação e exclusão de campanhas
* Criação, edição e exclusão de personagens
* Armazenamento de personagens no banco de dados MySQL
* Upload de imagem do personagem
* Sistema de rolagem de dados integrado

---

# Requisitos

Antes de executar o projeto, instale:

* Node.js
* MySQL Server
* MySQL Workbench (opcional, mas recomendado)
* Visual Studio Code

---

# 1) Clonar ou baixar o projeto

Baixe o projeto e abra a pasta no Visual Studio Code.

Exemplo:

```bash
cd FichaRPgprog2
```

---

# 2) Instalar as dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Caso seja necessário instalar manualmente:

```bash
npm install express
npm install mysql2
npm install cors
npm install bcrypt
npm install jsonwebtoken
```

---

# 3) Criar o banco de dados

Abra o MySQL Workbench e execute o seguinte script:

```sql
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

    idade INT NULL,
    altura VARCHAR(50),
    genero VARCHAR(50),
    sexualidade VARCHAR(50),

    raca VARCHAR(100),
    classe VARCHAR(100),

    nivel INT NULL,

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
```

---

# 4) Criar o usuário do banco

Execute:

```sql
CREATE USER 'rpg_user'@'localhost'
IDENTIFIED BY 'rpg123';

GRANT ALL PRIVILEGES
ON rpg_manager.*
TO 'rpg_user'@'localhost';

FLUSH PRIVILEGES;
```

---

# 5) Configurar a conexão do MySQL

No arquivo:

```text
server.js
```

verifique se a configuração está assim:

```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "rpg_user",
    password: "rpg123",
    database: "rpg_manager"
});
```

Caso utilize outro usuário ou senha, altere esses valores.

---

# 6) Iniciar o servidor

No terminal:

```bash
node server.js
```

Se tudo estiver correto, aparecerá:

```text
MySQL conectado!
Servidor rodando na porta 3000
```

---

# 7) Abrir o sistema

Abra o navegador e acesse:

```text
http://localhost:3000/login.html
```

Não utilize arquivos HTML diretamente pelo explorador do Windows (file://), pois isso pode causar problemas de segurança e impedir o funcionamento correto do sistema.

---

# Fluxo de utilização

1. Criar uma conta na página de registro.
2. Fazer login.
3. Criar uma campanha.
4. Abrir a campanha.
5. Adicionar personagens.
6. Editar ou excluir personagens quando necessário.
7. Utilizar o sistema de rolagem de dados.

---

# Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* MySQL
* JWT (JSON Web Token)
* Bcrypt
* CORS

---

# Autor

Projeto desenvolvido por Carlos Eduardo Tschoeke.

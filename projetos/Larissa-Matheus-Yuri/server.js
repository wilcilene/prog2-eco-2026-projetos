// server.js

import app from "./app.js";

const port = 3000;

app.listen(port, () => {
    console.log(`
        Servidor rodando em http://localhost:${port}
        Aperte Ctrl+C para parar o servidor
        `);
});
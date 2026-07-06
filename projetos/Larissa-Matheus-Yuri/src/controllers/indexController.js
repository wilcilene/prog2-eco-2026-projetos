import path from "path";
import { fileURLToPath } from "url";

// recriando __dirname no padrão ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getHome(req, res) {
    const filePath = path.join(__dirname, "..", "..", "index.html" );

    res.sendFile(filePath);
}
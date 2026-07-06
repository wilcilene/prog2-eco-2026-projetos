// logica da api para salvar score do usuario

import { saveScore } from "../models/userModel.js";

export async function save(req, res) {

    const {id_user, newScore} = req.body;
    
    await saveScore(id_user, newScore);

    try {
        return res.status(200).json({ message: "Pontuação salva com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao salvar pontuação" });
    }
}
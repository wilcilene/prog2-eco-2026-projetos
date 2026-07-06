// logica da api de pegar os 10 melhores jogadores do ranking
import { getTopPlayers } from "../models/userModel.js";

export async function getRanking(req, res) {
    try {
        const topPlayers = await getTopPlayers();
        
        return res.status(200).json({ 
            message: "Ranking obtido com sucesso",
            ranking: topPlayers 
        });
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        return res.status(500).json({ message: "Erro ao buscar ranking" });
    }
}
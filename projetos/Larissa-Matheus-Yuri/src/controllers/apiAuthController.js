// logica da api de login e registro de usuarios

import { 
    findUserByEmail,
    createUser
    } from "../models/userModel.js";

export async function register(req, res) {

    const { username, email, password } = req.body;

    try {
        const usuarioExistente = await findUserByEmail(email);

        if (usuarioExistente) {
            return res.status(400).json({ message: "Email já está cadastrado" });
        }

        const novoUsuario = await createUser(username, email, password);

        return res.status(201).json({ message: "Usuário criado com sucesso", usuario: novoUsuario });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar usuário" });
    }
}

export async function login(req, res) {

    const { email, password } = req.body;

    try {
        const usuario = await findUserByEmail(email);

        if (!usuario || usuario.password !== password) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        return res.status(200).json({ message: "Login bem-sucedido", usuario: usuario });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao fazer login" });
    }
}
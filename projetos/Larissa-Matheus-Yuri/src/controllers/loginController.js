// logica de consumir a api de autenticação (tanto para login quanto para register) do usuario apos o botao for acionado

// alem disso tem que carregar os dados da api consumida para a classe Conta(salvar no state) e ir para a view de menu(por meio do metodo de navegarpara)

import { Conta } from "../classes/Conta.js";
import { setConta} from "../state/session.js";
import { telaLogin } from "../view/login.js";

export function loginController(navegarPara) {
    
    telaLogin();

    const formRegister = document.getElementById( "registerForm" );

    formRegister.addEventListener("submit", (event) => {
        register(event, navegarPara);
    });

    const formLogin = document.getElementById( "loginForm" );

    formLogin.addEventListener("submit", (event) => {
        login(event, navegarPara);
    });
}

async function register(event, navegarPara){
    event.preventDefault();
    
    const nome = document.querySelector("#registerName").value;
    const email = document.querySelector("#registerEmail").value.trim().toLowerCase();
    const senha = document.querySelector("#registerPassword").value;
    
    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username: nome,
                email: email,
                password: senha 
            })
        })
    
        const data = await response.json();
    
        if(!response.ok){
            alert(data.message);
            return;
        } else {
            alert(data.message);
    
            const conta = new Conta(
                data.usuario.id_user,
                data.usuario.username,
                data.usuario.maximum_score
            );
    
            setConta(conta);

            navegarPara('menu')
        }
    
    } catch (error) {
    console.error(error);
    }
}

async function login(event, navegarPara){

    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
    const senha = document.querySelector("#loginPassword").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                email: email,
                password: senha 
            })
        })

        const data = await response.json();

        if(!response.ok){
            alert(data.message);
            return;
        } else {
            alert(data.message);

            const conta = new Conta(
                data.usuario.id_user,
                data.usuario.username,
                data.usuario.maximum_score
            );

            setConta(conta);

            navegarPara('menu')
        }
    } catch (error) {
        console.error(error);
    }
}
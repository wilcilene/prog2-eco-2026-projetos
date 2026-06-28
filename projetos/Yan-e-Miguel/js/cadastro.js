bloquearLoginSeAutenticado();


        async function criarContaCliente(event){

            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value.trim();
            const confirmarSenha = document.getElementById("confirmarSenha").value.trim();
            const message = document.getElementById("cadastroMessage");

            message.style.color = "var(--danger)";
            message.textContent = "";

            if(!nome || !email || !senha || !confirmarSenha){
                message.textContent = "Preencha todos os campos.";
                return;
            }

            if(senha.length < 3){
                message.textContent = "A senha precisa ter pelo menos 3 caracteres.";
                return;
            }

            if(senha !== confirmarSenha){
                message.textContent = "As senhas não conferem.";
                return;
            }

            try{

                await apiPost("/usuarios", {
                    nome,
                    email,
                    senha,
                    tipo:"cliente"
                });

                message.style.color = "var(--success)";
                message.textContent = "Conta criada com sucesso. Redirecionando para o login...";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1200);

            }catch(erro){

                message.style.color = "var(--danger)";
                message.textContent = erro.message || "Erro ao criar conta.";

            }

        }

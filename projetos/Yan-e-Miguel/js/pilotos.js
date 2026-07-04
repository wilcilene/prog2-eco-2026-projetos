const usuarioAdminPilotos = requireAuth(["admin"]);

        let pilotosCache = [];

        if(usuarioAdminPilotos){
            carregarPilotos();
        }


        async function carregarPilotos(){

            try{

                preencherUsuarioLogado();

                const pilotos = await apiGet("/pilotos");

                pilotosCache = Array.isArray(pilotos) ? pilotos : [];

                renderizarPilotos(pilotosCache);

                preencherResumoPilotos(pilotosCache);

            }catch(erro){

                console.error(erro);

                setHTML("listaPilotos", `
                    <tr>
                        <td colspan="6">
                            <div class="alert alert-danger">
                                Não foi possível carregar os pilotos.
                            </div>
                        </td>
                    </tr>
                `);

            }

        }


        async function cadastrarPiloto(event){

            event.preventDefault();

            const nome = document.getElementById("nomePiloto").value.trim();
            const email = document.getElementById("emailPiloto").value.trim();
            const senha = document.getElementById("senhaPiloto").value.trim();
            const message = document.getElementById("pilotoMessage");

            message.style.color = "var(--danger)";
            message.textContent = "";

            if(!nome || !email || !senha){
                message.textContent = "Preencha todos os campos obrigatórios.";
                return;
            }

            if(senha.length < 3){
                message.textContent = "A senha precisa ter pelo menos 3 caracteres.";
                return;
            }

            try{

                await apiPost("/pilotos", {
                    nome,
                    email,
                    senha
                });

                message.style.color = "var(--success)";
                message.textContent = "Piloto cadastrado com sucesso.";

                event.target.reset();

                await carregarPilotos();

            }catch(erro){

                message.style.color = "var(--danger)";
                message.textContent = erro.message || "Erro ao cadastrar piloto.";

            }

        }


        async function excluirPiloto(id, nome){

            const confirmar = confirm(`Deseja realmente excluir o piloto "${nome}"?`);

            if(!confirmar){
                return;
            }

            try{

                await apiDelete(`/pilotos/${id}`);

                await carregarPilotos();

            }catch(erro){

                alert(erro.message || "Erro ao excluir piloto.");

            }

        }


        function renderizarPilotos(pilotos){

            if(!pilotos || pilotos.length === 0){

                setHTML("listaPilotos", `
                    <tr>
                        <td colspan="6">
                            ${mostrarVazio(
                                "Nenhum piloto cadastrado",
                                "Cadastre o primeiro piloto usando o formulário ao lado."
                            )}
                        </td>
                    </tr>
                `);

                return;

            }

            const html = pilotos.map(piloto => `

                <tr>
                    <td>
                        <span class="table-number">#${piloto.id}</span>
                    </td>

                    <td>
                        <strong style="color:white;">${piloto.nome || "-"}</strong>
                    </td>

                    <td>${piloto.email || "-"}</td>

                    <td>
                        <span class="status status-success">
                            Ativo
                        </span>
                    </td>

                    <td>${formatarData(piloto.criado_em)}</td>

                    <td>
                        <div class="table-actions">

                            <button 
                                class="action-btn" 
                                title="Visualizar piloto"
                                onclick="visualizarPiloto('${piloto.nome || "-"}','${piloto.email || "-"}')"
                            >
                                <i class="bi bi-eye"></i>
                            </button>

                            <button 
                                class="action-btn" 
                                title="Excluir piloto"
                                onclick="excluirPiloto(${piloto.id}, '${piloto.nome || "Piloto"}')"
                            >
                                <i class="bi bi-trash"></i>
                            </button>

                        </div>
                    </td>
                </tr>

            `).join("");

            setHTML("listaPilotos", html);

        }


        function filtrarPilotos(){

            const termo = document.getElementById("buscaPiloto").value
                .toLowerCase()
                .trim();

            if(!termo){
                renderizarPilotos(pilotosCache);
                return;
            }

            const filtrados = pilotosCache.filter(piloto => {

                const nome = String(piloto.nome || "").toLowerCase();
                const email = String(piloto.email || "").toLowerCase();

                return nome.includes(termo) || email.includes(termo);

            });

            renderizarPilotos(filtrados);

        }


        function preencherResumoPilotos(pilotos){

            setTexto("totalPilotosPagina", pilotos.length);

            setTexto("pilotosAtivosPagina", pilotos.length);

            if(pilotos.length === 0){
                setTexto("ultimoCadastroPiloto", "-");
                return;
            }

            const ultimo = pilotos[pilotos.length - 1];

            setTexto(
                "ultimoCadastroPiloto",
                ultimo.criado_em ? formatarDataCurta(ultimo.criado_em) : `#${ultimo.id}`
            );

        }


        function focarFormulario(){

            const form = document.getElementById("formPilotoBox");
            const input = document.getElementById("nomePiloto");

            if(form){
                form.scrollIntoView({
                    behavior:"smooth",
                    block:"center"
                });
            }

            setTimeout(() => {
                if(input){
                    input.focus();
                }
            }, 450);

        }


        function visualizarPiloto(nome, email){

            alert(`Piloto: ${nome}\nE-mail: ${email}`);

        }
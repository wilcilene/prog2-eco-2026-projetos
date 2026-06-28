# Guia de apresentação — RaceHub v3.0.2

Este arquivo serve como cola para explicar o projeto na apresentação.

## 1. Ideia geral do sistema

O RaceHub é um sistema de gerenciamento de pista/corridas. Ele possui três tipos de usuário:

- **Admin**: gerencia usuários, pilotos, veículos, corridas, reservas e tempos.
- **Piloto**: acompanha seus tempos, cadastra veículos e se inscreve em corridas.
- **Cliente**: agenda pista e consulta corridas/resultados.

## 2. Backend — `server.js`

O `server.js` é a API do sistema. Ele usa:

- `express`: cria o servidor e as rotas.
- `cors`: permite comunicação entre frontend e backend.
- `bcrypt`: criptografa senhas.
- `mysql2/promise`: acessa o banco MySQL pelo arquivo `db.js`.

Principais grupos de rotas:

- `/login`: autenticação.
- `/usuarios`: CRUD de usuários.
- `/pilotos`: listagem/cadastro de pilotos.
- `/veiculos`: cadastro, edição, listagem e exclusão de veículos.
- `/corridas`: cadastro, edição, exclusão e listagem de corridas.
- `/corridas/:id/inscrever`: inscrição do piloto em uma corrida escolhendo um veículo.
- `/reservas`: cadastro e controle de reservas.
- `/resultados`: cadastro e listagem de tempos, agora vinculados a piloto e veículo.
- `/pistas`: listagem de pistas.

## 3. Banco de dados

Arquivos importantes:

- `racehub.sql`: recria o banco do zero.
- `racehub_migracao_v2_4.sql`: adiciona veículos em um banco que já existe sem apagar dados.

Tabelas principais:

- `usuarios`: dados de login e tipo de usuário.
- `veiculos`: carros cadastrados para cada piloto.
- `corridas`: eventos cadastrados pelo admin.
- `corridas_inscricoes`: liga corrida + piloto + veículo.
- `resultados`: registra tempos de volta com corrida + piloto + veículo.
- `reservas`: horários reservados.

## 4. Fluxo novo de veículos

O fluxo profissional agora é:

1. O piloto cadastra um ou mais carros em `veiculos.html`.
2. Ao se inscrever em uma corrida, ele escolhe qual carro usará.
3. Na tela `tempos.html`, o admin seleciona:
   - corrida;
   - piloto;
   - veículo daquele piloto;
   - tempo de volta;
   - classificação.
4. Rankings e tabelas exibem o carro usado.

Exemplo:

> Igor cadastra dois carros: Civic e Gol Turbo. Ao entrar numa corrida, ele escolhe o Gol Turbo. Quando o admin lança o tempo, o sistema registra que o tempo foi feito pelo Igor usando o Gol Turbo.

## 5. Frontend

Arquivos principais:

- `script.js`: funções globais, login, logout, helpers da API, formatação, atalhos de sidebar e perfil.
- `js/veiculos.js`: lógica da página de veículos.
- `js/corridas.js`: cadastro de corridas e inscrição com veículo.
- `js/tempos.js`: registro de tempo com piloto e veículo.
- `js/piloto.js`: dashboard do piloto com inscrição em corridas.

## 6. O que explicar na apresentação

Sugestão de fala:

> O sistema possui controle de permissões por tipo de usuário. O admin gerencia a operação geral, o piloto acompanha desempenho e cadastra seus veículos, e o cliente pode reservar a pista. Uma melhoria importante foi vincular veículos aos pilotos, permitindo que cada inscrição e cada tempo registrem exatamente qual carro foi usado.

## 7. Melhorias futuras

Ainda daria para evoluir com:

- autenticação com token JWT;
- permissões reais no backend para cada tipo de usuário;
- modais no lugar de `alert` e `confirm`;
- upload de foto do veículo;
- relatórios em PDF;
- exportação de ranking;
- filtros por período;
- dashboard com gráficos.

## Correção v2.4.1 - Banco antigo com veículos

Nesta versão foi adicionada uma migração automática no `server.js`. Quando o servidor inicia, ele verifica se o banco antigo possui as tabelas e colunas necessárias para veículos.

Isso foi feito porque alguns bancos já tinham uma tabela `veiculos`, mas não tinham todas as colunas usadas pela versão nova, como `marca`, `modelo`, `ano`, `placa` ou `piloto_id`.

Também foi garantida a coluna `veiculo_id` na tabela `resultados`. Ela pode ficar vazia em tempos antigos, permitindo que resultados cadastrados antes da função de veículos continuem aparecendo na tela de tempos.

Arquivo extra incluído: `racehub_fix_v2_4_1.sql`, que faz a mesma correção manualmente pelo MySQL Workbench, sem apagar dados.


## Atualização v2.4.2

### Perfil com veículos
Na página `perfil.html`, o primeiro card deixou de mostrar apenas a inicial do nome e passou a mostrar a quantidade de veículos cadastrados pelo usuário. O arquivo `js/perfil.js` carrega os veículos pela rota `/pilotos/:id/veiculos` e monta duas listas: uma mini lista no card superior e uma lista completa dentro de "Dados atuais".

### Corridas em ordem de atualidade
A página `corridas.html` organiza a lista para mostrar primeiro a corrida futura mais próxima. Corridas finalizadas ficam no fim da tabela, da mais recente para a mais antiga.

### Bloqueio de cancelamento após corrida finalizada
Após a data e horário da corrida passarem, o sistema bloqueia o cancelamento de inscrição. Essa regra existe no frontend (`js/corridas.js`) e também no backend (`server.js`).

### Tempos sem classificação manual
O formulário de `tempos.html` não solicita mais classificação. A posição do ranking é calculada automaticamente pelo sistema com base no menor tempo de volta. O arquivo `js/tempos.js` sequencia os registros usando a ordenação por tempo.


## Ajustes v2.4.3

- O tipo `admin` agora aparece na interface como **Admin**, deixando o texto mais curto e consistente.
- O ranking do dashboard administrativo mostra no máximo 5 tempos: 1º dourado, 2º prateado, 3º bronze e demais em branco.
- O resumo técnico e o resumo operacional receberam correção de CSS para valores como `150.685s` não saírem dos cards.
- O dashboard do piloto foi corrigido para carregar corretamente últimos tempos, ranking e próximas corridas. O problema era um cache de resultados que estava sendo usado antes de ser declarado.

---

## Atualização v2.4.4 - Ranking universal e tema Black/Login

### Cores dos rankings
Todos os rankings do sistema passaram a seguir a mesma regra visual:

- 1º lugar: tempo em dourado;
- 2º lugar: tempo em prateado;
- 3º lugar: tempo em bronze;
- 4º lugar em diante: tempo em branco.

Essa regra foi centralizada no arquivo `css/final-ui.css`, usando seletores CSS como `.ranking-list .ranking-item:nth-child(1) .best-time`. Assim, não é necessário repetir a regra em cada arquivo JavaScript.

### Tema visual de teste
Foi criado o arquivo `css/theme-login-black.css`.

Esse arquivo funciona como um tema extra e fica importado por último no `style.css`, por isso ele consegue sobrescrever as cores principais do sistema. A proposta dele é testar o RaceHub com uma paleta mais preta/carbono, usando o mesmo estilo de fundo da tela de login.

Para voltar ao tema anterior, basta remover ou comentar esta linha no `style.css`:

```css
@import url("./css/theme-login-black.css");
```

# RaceHub v3.0 - Novas funções profissionais

## Foto de perfil
Agora o usuário pode escolher uma imagem na página `perfil.html`.
O arquivo `js/perfil.js` converte a imagem para Base64 e envia para o backend pela rota `PUT /usuarios/:id/perfil`.
O backend salva essa imagem na coluna `foto_perfil` da tabela `usuarios`.
Quando o usuário abre qualquer tela, o `script.js` verifica se existe `foto_perfil`: se existir, mostra a imagem no avatar; se não existir, mostra as iniciais do nome.

## Status e limite de inscritos em corridas
A tabela `corridas` agora possui os campos `status` e `limite_inscritos`.
O status define se a corrida está aberta, encerrada, finalizada ou cancelada.
O limite define a quantidade máxima de pilotos que podem se inscrever.
O backend bloqueia novas inscrições se a corrida estiver finalizada, cancelada, encerrada ou lotada.

## Cadastro de potência do veículo
A tabela `veiculos` recebeu o campo `potencia`.
Esse campo permite separar rankings por faixa de potência:
- Até 150 cv
- 151 a 250 cv
- 251 a 400 cv
- Acima de 400 cv

## Ranking por veículo
A rota `GET /rankings/veiculos` calcula o melhor tempo de cada carro.
Isso permite comparar não só pilotos, mas também os carros utilizados nas voltas.

## Ranking por potência
A rota `GET /rankings/potencia` agrupa resultados pela faixa de potência do veículo.
Essa função deixa o sistema mais justo, porque carros de potência parecida podem ser comparados entre si.

## Social RaceHub
Foi criada a página `social.html`, com o arquivo `js/social.js`.
Ela mostra uma lista pública de pilotos com:
- foto ou iniciais;
- quantidade de veículos;
- inscrições em corridas;
- tempos registrados;
- melhor volta.

## Detalhes da corrida
Foi criada a página `corrida-detalhes.html`, com o arquivo `js/corrida-detalhes.js`.
Ela mostra:
- dados da corrida;
- status;
- limite de inscritos;
- lista de inscritos;
- veículo usado por cada piloto;
- ranking daquela corrida.

## Modais personalizados
O `script.js` agora possui `rhAlert()` e `rhConfirm()`.
Essas funções criam modais visuais dentro do padrão do RaceHub, substituindo alertas simples em novas funções do sistema.

## Exportação e impressão
Na tela de relatórios foi adicionado botão de imprimir e exportar CSV.
A função `exportarTabelaCSV()` está no `script.js` e transforma uma tabela HTML em arquivo `.csv`.

## Notificações internas
A rota `GET /usuarios/:id/notificacoes` gera mensagens automáticas para admin e piloto.
O `script.js` mostra essas mensagens em um painel discreto dentro das páginas logadas.

## v3.0.1 - Correções de navegação e Social

### Social na sidebar
O arquivo `script.js` agora chama `garantirLinksGlobaisSidebar()` mais de uma vez após o carregamento da página. Isso foi feito porque algumas páginas recriam o menu lateral pelo próprio JavaScript. Sem essa correção, links globais como **Social** e **Perfil** podiam aparecer no início e depois sumir quando o menu era renderizado novamente.

### Rota `/pilotos-publicos`
A rota do backend foi reforçada para funcionar mesmo se o banco tiver vindo de versões antigas do RaceHub. Ela verifica se tabelas e colunas opcionais existem antes de montar a consulta SQL. Assim a página Social não quebra caso algum campo novo, como `foto_perfil`, ainda não esteja presente no banco.

### Botão Sair na sidebar
O CSS da sidebar foi ajustado para manter o botão **Sair** sempre visível. Quando o menu tem muitos itens, apenas a lista de links passa a ter rolagem interna, evitando que o botão fique escondido no final da tela.


## Atualização v3.0.2

### Perfil público de piloto
Foi criada a página `piloto-publico.html`. Ela permite clicar em um piloto na área Social ou nos rankings e abrir um perfil público com:

- dados básicos do piloto;
- lista de veículos cadastrados;
- inscrições em corridas;
- histórico de tempos;
- melhor volta e estatísticas gerais.

A página usa a rota `GET /pilotos-publicos/:id`, criada no `server.js`.

### Ranking por veículo com filtro de potência
Na tela de relatórios, o ranking por veículo agora possui um seletor de categoria:

- Todas as potências;
- Até 150 cv;
- 151 a 250 cv;
- 251 a 400 cv;
- Acima de 400 cv;
- Sem potência.

O filtro usa os dados já carregados da API `/rankings/veiculos` e filtra no frontend.

### Pilotos sem registro de tempo
O botão `Registrar tempo` e o formulário de cadastro de resultado ficam escondidos por padrão e só aparecem para usuários do tipo `admin`.
Pilotos e clientes apenas visualizam os resultados.

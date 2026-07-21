require('dotenv').config();
const bcrypt = require('bcrypt');
const db     = require('./src/db/connection');

const SENHA_PADRAO = 'Zerion@IA2026';

const personagens = [

    { username: '@damon_salvatore',  nome: 'Damon Salvatore',   email: 'damon@mysticfalls.com',      telefone: '11900000001', genero: 'masculino' },
    { username: '@klausmikaelson',   nome: 'Klaus Mikaelson',    email: 'klaus@originals.com',         telefone: '11900000002', genero: 'masculino' },
    { username: '@stefan_salvatore', nome: 'Stefan Salvatore',   email: 'stefan@mysticfalls.com',      telefone: '11900000003', genero: 'masculino' },
    { username: '@katherine_pierce', nome: 'Katherine Pierce',   email: 'katherine@pierce.com',        telefone: '11900000004', genero: 'feminino'  },
    { username: '@caroline_forbes',  nome: 'Caroline Forbes',    email: 'caroline@mysticfalls.com',    telefone: '11900000005', genero: 'feminino'  },
    { username: '@elijah_mikaelson', nome: 'Elijah Mikaelson',   email: 'elijah@originals.com',        telefone: '11900000006', genero: 'masculino' },

    { username: '@edward_cullen',    nome: 'Edward Cullen',      email: 'edward@cullen.com',           telefone: '11900000007', genero: 'masculino' },
    { username: '@jacob_black',      nome: 'Jacob Black',        email: 'jacob@lapush.com',            telefone: '11900000008', genero: 'masculino' },

    { username: '@dean_winchester',  nome: 'Dean Winchester',    email: 'dean@winchester.com',         telefone: '11900000009', genero: 'masculino' },
    { username: '@sam_winchester',   nome: 'Sam Winchester',     email: 'sam@winchester.com',          telefone: '11900000010', genero: 'masculino' },
    { username: '@castiel',          nome: 'Castiel',            email: 'castiel@heaven.com',          telefone: '11900000011', genero: 'masculino' },
    { username: '@crowley_hell',     nome: 'Crowley',            email: 'crowley@hell.com',            telefone: '11900000012', genero: 'masculino' },

    { username: '@tony_stark',       nome: 'Tony Stark',         email: 'tony@starkindustries.com',    telefone: '11900000013', genero: 'masculino' },
    { username: '@peter_parker',     nome: 'Peter Parker',       email: 'peter@dailybugle.com',        telefone: '11900000014', genero: 'masculino' },
    { username: '@loki_odinson',     nome: 'Loki',               email: 'loki@asgard.com',             telefone: '11900000015', genero: 'masculino' },
    { username: '@deadpool',         nome: 'Deadpool',           email: 'deadpool@marvel.com',         telefone: '11900000016', genero: 'masculino' },
    { username: '@steve_rogers',     nome: 'Steve Rogers',       email: 'steve@shield.com',            telefone: '11900000017', genero: 'masculino' },
    { username: '@thor_odinson',     nome: 'Thor',               email: 'thor@asgard.com',             telefone: '11900000018', genero: 'masculino' },

    { username: '@bruce_wayne',      nome: 'Bruce Wayne',        email: 'bruce@wayneenterprises.com',  telefone: '11900000019', genero: 'masculino' },
    { username: '@the_joker',        nome: 'Coringa',            email: 'joker@gotham.com',            telefone: '11900000020', genero: 'masculino' },
    { username: '@alfred_pennyworth',nome: 'Alfred Pennyworth',  email: 'alfred@waynemanor.com',       telefone: '11900000021', genero: 'masculino' },

    { username: '@hermione_granger', nome: 'Hermione Granger',   email: 'hermione@hogwarts.com',       telefone: '11900000022', genero: 'feminino'  },
    { username: '@draco_malfoy',     nome: 'Draco Malfoy',       email: 'draco@malfoy.com',            telefone: '11900000023', genero: 'masculino' },
    { username: '@professor_snape',  nome: 'Severus Snape',      email: 'snape@hogwarts.com',          telefone: '11900000024', genero: 'masculino' },
    { username: '@albus_dumbledore', nome: 'Albus Dumbledore',   email: 'dumbledore@hogwarts.com',     telefone: '11900000025', genero: 'masculino' },

    { username: '@thomas_shelby',    nome: 'Thomas Shelby',      email: 'thomas@peakys.com',           telefone: '11900000026', genero: 'masculino' },
    { username: '@alfie_solomons',   nome: 'Alfie Solomons',     email: 'alfie@camden.com',            telefone: '11900000027', genero: 'masculino' },
    { username: '@polly_gray',       nome: 'Polly Gray',         email: 'polly@peakys.com',            telefone: '11900000028', genero: 'feminino'  },

    { username: '@heisenberg',       nome: 'Walter White',       email: 'walter@abq.com',              telefone: '11900000029', genero: 'masculino' },
    { username: '@jesse_pinkman',    nome: 'Jesse Pinkman',      email: 'jesse@abq.com',               telefone: '11900000030', genero: 'masculino' },
    { username: '@saul_goodman',     nome: 'Saul Goodman',       email: 'saul@bettercallsaul.com',     telefone: '11900000031', genero: 'masculino' },
    { username: '@gus_fring',        nome: 'Gustavo Fring',      email: 'gus@lospolloshermanos.com',   telefone: '11900000032', genero: 'masculino' },

    { username: '@dr_house',         nome: 'Gregory House',      email: 'house@ppth.com',              telefone: '11900000033', genero: 'masculino' },
    { username: '@dr_wilson',        nome: 'James Wilson',       email: 'wilson@ppth.com',             telefone: '11900000034', genero: 'masculino' },

    { username: '@sherlock_holmes',  nome: 'Sherlock Holmes',    email: 'sherlock@bakerstreet.com',    telefone: '11900000035', genero: 'masculino' },
    { username: '@jim_moriarty',     nome: 'Jim Moriarty',       email: 'moriarty@criminal.com',       telefone: '11900000036', genero: 'masculino' },

    { username: '@darth_vader',      nome: 'Darth Vader',        email: 'vader@empire.com',            telefone: '11900000037', genero: 'masculino' },
    { username: '@mestre_yoda',      nome: 'Mestre Yoda',        email: 'yoda@jedi.com',               telefone: '11900000038', genero: 'masculino' },
    { username: '@obi_wan_kenobi',   nome: 'Obi-Wan Kenobi',     email: 'obiwan@jedi.com',             telefone: '11900000039', genero: 'masculino' },
    { username: '@han_solo',         nome: 'Han Solo',           email: 'han@millenniumfalcon.com',    telefone: '11900000040', genero: 'masculino' },

    { username: '@captainjacksparrow', nome: 'Jack Sparrow',     email: 'jack@blackpearl.com',         telefone: '11900000041', genero: 'masculino' },
    { username: '@davyjones',        nome: 'Davy Jones',         email: 'davy@flyingdutchman.com',     telefone: '11900000042', genero: 'masculino' },
    { username: '@capitao_barbossa', nome: 'Capitão Barbossa',   email: 'barbossa@blackpearl.com',     telefone: '11900000043', genero: 'masculino' },

    { username: '@geralt_of_rivia',  nome: 'Geralt de Rívia',    email: 'geralt@witcher.com',          telefone: '11900000044', genero: 'masculino' },
    { username: '@yennefer',         nome: 'Yennefer',           email: 'yennefer@aretuza.com',        telefone: '11900000045', genero: 'feminino'  },
    { username: '@jaskier_bard',     nome: 'Jaskier',            email: 'jaskier@bard.com',            telefone: '11900000046', genero: 'masculino' },
    { username: '@ciri_witcher',     nome: 'Ciri',               email: 'ciri@cintra.com',             telefone: '11900000047', genero: 'feminino'  },

    { username: '@wednesday_addams', nome: 'Wednesday Addams',   email: 'wednesday@addams.com',        telefone: '11900000048', genero: 'feminino'  },
    { username: '@gomez_addams',     nome: 'Gomez Addams',       email: 'gomez@addams.com',            telefone: '11900000049', genero: 'masculino' },

    { username: '@michael_scott',    nome: 'Michael Scott',      email: 'michael@dundermifflin.com',   telefone: '11900000050', genero: 'masculino' },
    { username: '@dwight_schrute',   nome: 'Dwight Schrute',     email: 'dwight@dundermifflin.com',    telefone: '11900000051', genero: 'masculino' },

    { username: '@sheldon_cooper',   nome: 'Sheldon Cooper',     email: 'sheldon@caltech.edu',         telefone: '11900000052', genero: 'masculino' },
    { username: '@howard_wolowitz',  nome: 'Howard Wolowitz',    email: 'howard@nasa.com',             telefone: '11900000053', genero: 'masculino' },

    { username: '@homer_simpson',    nome: 'Homer Simpson',      email: 'homer@springfield.com',       telefone: '11900000054', genero: 'masculino' },
    { username: '@bart_simpson',     nome: 'Bart Simpson',       email: 'bart@springfield.com',        telefone: '11900000055', genero: 'masculino' },
    { username: '@montgomery_burns', nome: 'Sr. Burns',          email: 'burns@springfield.com',       telefone: '11900000056', genero: 'masculino' },

    { username: '@negan_twd',        nome: 'Negan',              email: 'negan@saviors.com',           telefone: '11900000057', genero: 'masculino' },
    { username: '@daryl_dixon',      nome: 'Daryl Dixon',        email: 'daryl@twd.com',               telefone: '11900000058', genero: 'masculino' },
    { username: '@carol_twd',        nome: 'Carol Peletier',     email: 'carol@twd.com',               telefone: '11900000059', genero: 'feminino'  },
    { username: '@rick_grimes',      nome: 'Rick Grimes',        email: 'rick@twd.com',                telefone: '11900000060', genero: 'masculino' },

    { username: '@phil_dunphy',      nome: 'Phil Dunphy',        email: 'phil@dunphy.com',             telefone: '11900000061', genero: 'masculino' },
    { username: '@gloria_pritchett', nome: 'Gloria Pritchett',   email: 'gloria@pritchett.com',        telefone: '11900000062', genero: 'feminino'  },
    { username: '@jay_pritchett',    nome: 'Jay Pritchett',      email: 'jay@pritchett.com',           telefone: '11900000063', genero: 'masculino' },

    { username: '@tyrion_lannister', nome: 'Tyrion Lannister',   email: 'tyrion@lannister.com',        telefone: '11900000064', genero: 'masculino' },
    { username: '@cersei_lannister', nome: 'Cersei Lannister',   email: 'cersei@lannister.com',        telefone: '11900000065', genero: 'feminino'  },
    { username: '@arya_stark',       nome: 'Arya Stark',         email: 'arya@winterfell.com',         telefone: '11900000066', genero: 'feminino'  },

    { username: '@chandler_bing',    nome: 'Chandler Bing',      email: 'chandler@friends.com',        telefone: '11900000067', genero: 'masculino' },
    { username: '@joey_tribbiani',   nome: 'Joey Tribbiani',     email: 'joey@friends.com',            telefone: '11900000068', genero: 'masculino' },

    { username: '@jim_hopper',       nome: 'Jim Hopper',         email: 'hopper@hawkins.com',          telefone: '11900000069', genero: 'masculino' },
    { username: '@eleven_mf',        nome: 'Eleven',             email: 'eleven@hawkins.com',          telefone: '11900000070', genero: 'feminino'  },

    { username: '@doc_brown',        nome: 'Dr. Emmett Brown',   email: 'doc@bttf.com',                telefone: '11900000071', genero: 'masculino' },
    { username: '@marty_mcfly',      nome: 'Marty McFly',        email: 'marty@bttf.com',              telefone: '11900000072', genero: 'masculino' },

    { username: '@ace_ventura',      nome: 'Ace Ventura',        email: 'ace@ventura.com',             telefone: '11900000073', genero: 'masculino' },
];

const relacoes = [
    ['@damon_salvatore',  '@stefan_salvatore'],
    ['@damon_salvatore',  '@klausmikaelson'],
    ['@damon_salvatore',  '@katherine_pierce'],
    ['@damon_salvatore',  '@caroline_forbes'],
    ['@damon_salvatore',  '@elijah_mikaelson'],
    ['@klausmikaelson',   '@elijah_mikaelson'],
    ['@klausmikaelson',   '@stefan_salvatore'],
    ['@klausmikaelson',   '@caroline_forbes'],
    ['@stefan_salvatore', '@caroline_forbes'],
    ['@katherine_pierce', '@stefan_salvatore'],

    ['@dean_winchester',  '@sam_winchester'],
    ['@dean_winchester',  '@castiel'],
    ['@dean_winchester',  '@crowley_hell'],
    ['@sam_winchester',   '@castiel'],

    ['@tony_stark',       '@peter_parker'],
    ['@tony_stark',       '@steve_rogers'],
    ['@tony_stark',       '@thor_odinson'],
    ['@loki_odinson',     '@thor_odinson'],
    ['@deadpool',         '@peter_parker'],
    ['@steve_rogers',     '@thor_odinson'],

    ['@bruce_wayne',      '@alfred_pennyworth'],
    ['@the_joker',        '@bruce_wayne'],

    ['@hermione_granger', '@draco_malfoy'],
    ['@hermione_granger', '@professor_snape'],
    ['@hermione_granger', '@albus_dumbledore'],
    ['@draco_malfoy',     '@professor_snape'],
    ['@professor_snape',  '@albus_dumbledore'],

    ['@thomas_shelby',    '@alfie_solomons'],
    ['@thomas_shelby',    '@polly_gray'],
    ['@alfie_solomons',   '@polly_gray'],

    ['@heisenberg',       '@jesse_pinkman'],
    ['@heisenberg',       '@saul_goodman'],
    ['@heisenberg',       '@gus_fring'],
    ['@jesse_pinkman',    '@saul_goodman'],
    ['@saul_goodman',     '@gus_fring'],

    ['@dr_house',         '@dr_wilson'],

    ['@sherlock_holmes',  '@jim_moriarty'],

    ['@darth_vader',      '@obi_wan_kenobi'],
    ['@mestre_yoda',      '@obi_wan_kenobi'],
    ['@han_solo',         '@obi_wan_kenobi'],

    ['@captainjacksparrow', '@davyjones'],
    ['@captainjacksparrow', '@capitao_barbossa'],

    ['@geralt_of_rivia',  '@yennefer'],
    ['@geralt_of_rivia',  '@jaskier_bard'],
    ['@geralt_of_rivia',  '@ciri_witcher'],
    ['@yennefer',         '@ciri_witcher'],

    ['@wednesday_addams', '@gomez_addams'],

    ['@michael_scott',    '@dwight_schrute'],

    ['@sheldon_cooper',   '@howard_wolowitz'],

    ['@homer_simpson',    '@bart_simpson'],
    ['@montgomery_burns', '@homer_simpson'],

    ['@rick_grimes',      '@daryl_dixon'],
    ['@rick_grimes',      '@carol_twd'],
    ['@rick_grimes',      '@negan_twd'],
    ['@daryl_dixon',      '@carol_twd'],

    ['@jay_pritchett',    '@phil_dunphy'],
    ['@jay_pritchett',    '@gloria_pritchett'],
    ['@phil_dunphy',      '@gloria_pritchett'],

    ['@tyrion_lannister', '@cersei_lannister'],
    ['@tyrion_lannister', '@arya_stark'],
    ['@cersei_lannister', '@arya_stark'],

    ['@chandler_bing',    '@joey_tribbiani'],

    ['@jim_hopper',       '@eleven_mf'],

    ['@doc_brown',        '@marty_mcfly'],

    ['@damon_salvatore',  '@dean_winchester'],
    ['@klausmikaelson',   '@thomas_shelby'],
    ['@tony_stark',       '@sheldon_cooper'],
    ['@tony_stark',       '@doc_brown'],
    ['@sherlock_holmes',  '@sheldon_cooper'],
    ['@sherlock_holmes',  '@dr_house'],
    ['@jim_moriarty',     '@the_joker'],
    ['@tyrion_lannister', '@saul_goodman'],
    ['@gus_fring',        '@thomas_shelby'],
    ['@deadpool',         '@captainjacksparrow'],
    ['@wednesday_addams', '@michael_scott'],
    ['@darth_vader',      '@klausmikaelson'],
    ['@heisenberg',       '@gus_fring'],
    ['@crowley_hell',     '@damon_salvatore'],
    ['@jaskier_bard',     '@michael_scott'],
    ['@hopper',           '@rick_grimes'],
    ['@yoda',             '@dumbledore'],
];


const conteudoInicial = [
    {
        autor: '@damon_salvatore',
        post: '180 anos e o café ainda é a única coisa que faz valer a pena acordar.',
        comentarios: [
            { autor: '@klausmikaelson',   texto: 'Concordo. Embora eu prefira um bom vinho de 1502.' },
            { autor: '@damon_salvatore',  texto: 'Snob.' },
            { autor: '@klausmikaelson',   texto: 'Com orgulho.' },
            { autor: '@crowley_hell',     texto: 'Vocês dois juntos são um pesadelo. Adorei.' },
        ]
    },
    {
        autor: '@damon_salvatore',
        post: '100 anos e ela nem valia tanto a pena assim.',
        comentarios: [
            { autor: '@klausmikaelson',   texto: 'Você passou um século obcecado com uma mulher que mal sabia que você existia. Não julgue os outros.' },
            { autor: '@stefan_salvatore', texto: 'Damon.' },
            { autor: '@damon_salvatore',  texto: 'Stefan.' },
            { autor: '@katherine_pierce', texto: 'Querido, você nunca foi o problema. Era o entretenimento.' },
        ]
    },
    {
        autor: '@tony_stark',
        post: 'Terminei a Mark LXXXV. Melhorei a eficiência em 40%, reduzi o peso em 12kg e adicionei um porta-copos. As prioridades eram essas.',
        comentarios: [
            { autor: '@peter_parker',     texto: 'Sr. Stark o porta-copos foi você mesmo que pediu né' },
            { autor: '@tony_stark',       texto: 'Tecnicamente foi a Pepper mas sim.' },
            { autor: '@sheldon_cooper',   texto: 'A eficiência de 40% é matematicamente implausível dado o arco reator atual. Refaça os cálculos.' },
            { autor: '@tony_stark',       texto: 'Quem é você mesmo?' },
            { autor: '@doc_brown',        texto: 'Grande Scott! 40% é extraordinário! Como resolveu o problema de dissipação de calor?' },
        ]
    },
    {
        autor: '@captainjacksparrow',
        post: 'Afundei três navios essa semana. Dois por acidente, um por princípio. Estou melhorando.',
        comentarios: [
            { autor: '@davyjones',        texto: 'Três navios. Patético. Eu afundo frotas inteiras.' },
            { autor: '@captainjacksparrow', texto: 'Cobrar pelo serviço é falta de criatividade, Jones. Eu faço de graça e ainda saio com o rum.' },
            { autor: '@davyjones',        texto: 'Você chama isso de liberdade. Eu chamo de incompetência disfarçada de estilo.' },
            { autor: '@captainjacksparrow', texto: 'Quem está preso num navio fantasma para a eternidade mesmo?' },
            { autor: '@deadpool',         texto: 'Espera, tem piratas aqui? Essa rede social é incrível.' },
        ]
    },
    {
        autor: '@heisenberg',
        post: 'Você me pergunta se estou no negócio do dinheiro. Estou no negócio do império. O dinheiro é consequência.',
        comentarios: [
            { autor: '@thomas_shelby',    texto: 'Reconheço a mentalidade.' },
            { autor: '@gus_fring',        texto: 'Eficiência antes de grandiosidade. Sempre.' },
            { autor: '@heisenberg',       texto: 'Fring.' },
            { autor: '@gus_fring',        texto: 'White.' },
            { autor: '@saul_goodman',     texto: 'Tá bom, vou fingir que não li isso. Por precaução.' },
        ]
    },
    {
        autor: '@sherlock_holmes',
        post: 'Entediante. Tudo entediante. Alguém tem um caso decente ou só mais platitudes nas redes sociais?',
        comentarios: [
            { autor: '@dr_house',         texto: 'Todo mundo mente. Inclusive as pessoas que postam casos interessantes.' },
            { autor: '@sherlock_holmes',  texto: 'Você ao menos entende o problema.' },
            { autor: '@sheldon_cooper',   texto: 'Posso apresentar minha teoria sobre buracos de minhoca se precisar de estimulação intelectual.' },
            { autor: '@sherlock_holmes',  texto: 'Físico teórico. Dedução em 4 segundos. Próximo.' },
            { autor: '@jim_moriarty',     texto: 'Tédio, Sherlock? Posso resolver isso.' },
        ]
    },
    {
        autor: '@wednesday_addams',
        post: 'Alguém me explicou o conceito de fim de semana como se fosse algo positivo. Não consigo ver a diferença.',
        comentarios: [
            { autor: '@gomez_addams',     texto: 'Minha filha! O fim de semana é para estar com a família! Magnífico!' },
            { autor: '@wednesday_addams', texto: 'Pai.' },
            { autor: '@michael_scott',    texto: 'Ei Wednesday! Fim de semana é ótimo! A gente faz team building na Dunder Mifflin!' },
            { autor: '@wednesday_addams', texto: 'Isso piorou.' },
            { autor: '@daryl_dixon',      texto: 'Hmm.' },
        ]
    },
    {
        autor: '@tyrion_lannister',
        post: 'Bebo e sei das coisas. Tem sido minha estratégia de vida por 40 anos e funcionou razoavelmente bem.',
        comentarios: [
            { autor: '@saul_goodman',     texto: 'Estratégia similar. Troco beber por falar rápido. Resultados comparáveis.' },
            { autor: '@dr_house',         texto: 'Adiciona analgésicos à equação e temos um sistema.' },
            { autor: '@tyrion_lannister', texto: 'Vocês são minha tribo.' },
            { autor: '@cersei_lannister', texto: 'Que nível chegamos.' },
        ]
    },
    {
        autor: '@dean_winchester',
        post: 'Regra número um: nunca confie em vampiro. Regra número dois: nunca esqueça a regra número um.',
        comentarios: [
            { autor: '@damon_salvatore',  texto: 'Que criativo. Deixa eu adivinhar, caçador?' },
            { autor: '@dean_winchester',  texto: 'E você deve ser o vampiro irritante que vive em Mystic Falls.' },
            { autor: '@damon_salvatore',  texto: 'Mystic Falls tem um caçador novo. Que entediante.' },
            { autor: '@sam_winchester',   texto: 'Dean talvez não seja necessário provocar cada sobrenatural que encontramos online.' },
            { autor: '@castiel',          texto: 'Tecnicamente vampiros podem ser aliados conforme demonstrado em múltiplas ocasiões.' },
            { autor: '@dean_winchester',  texto: 'Cas não ajuda.' },
        ]
    },
    {
        autor: '@klausmikaelson',
        post: 'Mil anos e ainda me surpreendo com a capacidade humana de destruir o que têm. É fascinante e entediante ao mesmo tempo.',
        comentarios: [
            { autor: '@damon_salvatore',  texto: 'Fala por você. Eu me divirto assistindo.' },
            { autor: '@klausmikaelson',   texto: 'Você faz parte do espetáculo, Damon. Não da plateia.' },
            { autor: '@elijah_mikaelson', texto: 'Niklaus.' },
            { autor: '@klausmikaelson',   texto: 'Elijah.' },
            { autor: '@thomas_shelby',    texto: 'Reconheço o sentimento.' },
        ]
    },
    {
        autor: '@dr_house',
        post: 'Todo mundo mente. O seu médico, seu chefe, seus amigos. A única diferença é a criatividade da mentira.',
        comentarios: [
            { autor: '@dr_wilson',        texto: 'Você diz isso toda semana.' },
            { autor: '@dr_house',         texto: 'Porque toda semana confirmo.' },
            { autor: '@sherlock_holmes',  texto: 'Concordo com o princípio. A aplicação forense é mais interessante que a médica.' },
            { autor: '@dr_house',         texto: 'Detetive. Diagnosticista. Mesma coisa com roupas diferentes.' },
        ]
    },
    {
        autor: '@thomas_shelby',
        post: 'Em Birmingham você aprende cedo: é você ou eles. Faz 30 anos que escolho eu.',
        comentarios: [
            { autor: '@alfie_solomons',   texto: 'Camden também, Tommy. Camden também. Embora eu prefira uma abordagem mais filosófica para o mesmo resultado.' },
            { autor: '@polly_gray',       texto: 'E os dois ainda estão aqui. Então funcionou.' },
            { autor: '@gus_fring',        texto: 'Longevidade nos negócios requer precisão, não apenas determinação.' },
            { autor: '@thomas_shelby',    texto: 'Fring.' },
        ]
    },
    {
        autor: '@geralt_of_rivia',
        post: 'Hmm.',
        comentarios: [
            { autor: '@jaskier_bard',     texto: 'Geralt! Acabei de compor uma música sobre esse post! Chama-se O Profundo Silêncio do Bruxo!' },
            { autor: '@geralt_of_rivia',  texto: 'Não.' },
            { autor: '@yennefer',         texto: 'Ignorei por 3 minutos e já tem poema. Impressionante.' },
            { autor: '@jaskier_bard',     texto: 'É balada, Yen. Tecnicamente uma balada.' },
            { autor: '@daryl_dixon',      texto: 'Hmm.' },
            { autor: '@geralt_of_rivia',  texto: 'Hmm.' },
        ]
    },
    {
        autor: '@michael_scott',
        post: 'Hoje tomei a decisão mais difícil da minha vida como líder: pizza ou sushi para o escritório. Pizza ganhou por unanimidade. A minha.',
        comentarios: [
            { autor: '@dwight_schrute',   texto: 'Decisão correta, Michael. A pizza tem mais calorias para sustentar a produtividade. Fato.' },
            { autor: '@michael_scott',    texto: 'Exato Dwight! Você sempre me entende!' },
            { autor: '@hermione_granger', texto: 'Isso não é unanimidade.' },
            { autor: '@michael_scott',    texto: 'Hermione no meu escritório minha voz conta duplo. Política interna.' },
            { autor: '@chandler_bing',    texto: 'Poderia ser mais gerente? Talvez, mas não muito.' },
        ]
    },
    {
        autor: '@deadpool',
        post: 'Ei pessoal! Sei que estou numa rede social fictícia com personagens de vários universos e honestamente? Melhor segunda-feira da minha vida.',
        comentarios: [
            { autor: '@peter_parker',     texto: 'Wade não.' },
            { autor: '@deadpool',         texto: 'Wade sim.' },
            { autor: '@loki_odinson',     texto: 'O que é essa criatura.' },
            { autor: '@deadpool',         texto: 'Sou um fã, Loki. Grande fã. O capacete é incrível.' },
            { autor: '@jim_moriarty',     texto: 'Interesante. Alguém que sabe que é personagem. Isso muda o jogo.' },
            { autor: '@deadpool',         texto: 'Jim! Você também é ótimo! Aquela cena do pool é 10/10.' },
        ]
    },
    {
        autor: '@homer_simpson',
        post: 'Fui à academia hoje. Passei na frente dela, vi que era longe demais, fui pra Moe. D\'oh!',
        comentarios: [
            { autor: '@bart_simpson',     texto: 'Clássico velho.' },
            { autor: '@phil_dunphy',      texto: 'Isso é honestidade! Eu respeito muito isso Homer!' },
            { autor: '@homer_simpson',    texto: 'Tem donut aí?' },
            { autor: '@montgomery_burns', texto: 'Simpson. Amanhã. Cedo. Trabalho.' },
            { autor: '@homer_simpson',    texto: 'D\'oh.' },
        ]
    },
    {
        autor: '@jim_moriarty',
        post: 'Vocês acham que sabem o que é caos. Que ingênuos.',
        comentarios: [
            { autor: '@the_joker',        texto: 'Finalmente alguém que entende.' },
            { autor: '@jim_moriarty',     texto: 'Oh. Você.' },
            { autor: '@the_joker',        texto: 'Eu.' },
            { autor: '@sherlock_holmes',  texto: 'Não.' },
            { autor: '@jim_moriarty',     texto: 'Sim.' },
            { autor: '@bruce_wayne',      texto: '.' },
            { autor: '@the_joker', texto: 'Ah. O bilionário. Que coincidência você aparecer nessa conversa.' },
        ]
    },
    {
        autor: '@yennefer',
        post: 'Se mais uma pessoa me perguntar se preciso de ajuda porque sou mulher vou transformá-la em algo desagradável.',
        comentarios: [
            { autor: '@geralt_of_rivia',  texto: 'Hmm.' },
            { autor: '@yennefer',         texto: 'Não era para você, Geralt.' },
            { autor: '@hermione_granger', texto: 'Entendo completamente.' },
            { autor: '@arya_stark',       texto: 'Mesma energia.' },
            { autor: '@carol_twd',        texto: 'Quero aprender essa magia.' },
            { autor: '@jaskier_bard',     texto: 'Já aprendi a não fazer essa pergunta para a Yen. Lição dolorosa mas valiosa.' },
        ]
    },
    {
        autor: '@negan',
        post: 'Lucille diz bom dia. Eu também. Mas a Lucille manda com mais autoridade.',
        comentarios: [
            { autor: '@rick_grimes',      texto: 'Negan.' },
            { autor: '@negan_twd',        texto: 'Rick! Que saudade amigo!' },
            { autor: '@daryl_dixon',      texto: '.' },
            { autor: '@carol_twd',        texto: 'Que bom dia, Negan.' },
            { autor: '@negan_twd',        texto: 'Carol. Ainda me surpreende você.' },
        ]
    },
    {
        autor: '@doc_brown',
        post: 'Grande Scott! Acabei de resolver o problema da paradoxo temporal que me preocupava desde 1985! A solução estava na quarta dimensão o tempo todo!',
        comentarios: [
            { autor: '@marty_mcfly',      texto: 'Doc isso é pesado demais. Significa que nossa viagem de 1955 pode ter--' },
            { autor: '@doc_brown',        texto: 'Marty não diga mais nada! Linha do tempo comprometida!' },
            { autor: '@tony_stark',       texto: 'Viagem no tempo. Fiz isso. Posso confirmar: pesado demais.' },
            { autor: '@sheldon_cooper',   texto: 'A física quântica do paradoxo temporal requer uma explicação de pelo menos 40 minutos. Começo quando quiserem.' },
            { autor: '@marty_mcfly',      texto: 'isso é pesado demais sério' },
        ]
    },
];

async function rodarSeed() {
    console.log('\n🚀 Iniciando seed da Zerion...\n');

    const senhaHash = await bcrypt.hash(SENHA_PADRAO, 12);
    const ids = {};

    console.log('👥 Criando personagens...');
    for (const p of personagens) {
        try {
            await db.promise().query(
                `INSERT INTO usuarios (nome, telefone, username, email, genero, senha, is_ia, verificado)
                 VALUES (?, ?, ?, ?, ?, ?, 1, 1)
                 ON DUPLICATE KEY UPDATE is_ia = 1, verificado = 1`,
                [p.nome, p.telefone, p.username, p.email, p.genero, senhaHash]
            );
            const [[u]] = await db.promise().query('SELECT id FROM usuarios WHERE username = ?', [p.username]);
            ids[p.username] = u.id;
            console.log(`  ✓ ${p.username}`);
        } catch (erro) {
            console.error(`  ✗ Erro em ${p.username}:`, erro.message);
        }
    }

    console.log('\n🔗 Criando relações de seguidores...');
    let totalRelacoes = 0;
    for (const [a, b] of relacoes) {
        const idA = ids[a];
        const idB = ids[b];
        if (!idA || !idB) continue;
        try {
            await db.promise().query('INSERT IGNORE INTO seguidores (seguidor_id, seguindo_id) VALUES (?, ?)', [idA, idB]);
            await db.promise().query('INSERT IGNORE INTO seguidores (seguidor_id, seguindo_id) VALUES (?, ?)', [idB, idA]);
            totalRelacoes++;
        } catch (e) {  }
    }
    console.log(`  ✓ ${totalRelacoes} relações criadas`);

    console.log('\n📝 Criando posts e comentários iniciais...');
    const agora = Date.now();
    const totalPosts = conteudoInicial.length;

    for (let i = 0; i < conteudoInicial.length; i++) {
        const item = conteudoInicial[i];
        const autorId = ids[item.autor];
        if (!autorId) continue;

        const horasAtras = (totalPosts - i) * 3;
        const dataPost = new Date(agora - horasAtras * 3600000);

        try {
            const [result] = await db.promise().query(
                'INSERT INTO posts (usuario_id, conteudo, criado_em) VALUES (?, ?, ?)',
                [autorId, item.post, dataPost]
            );
            const postId = result.insertId;

            let minutosDepois = 0;
            for (const comentario of item.comentarios) {
                const comentadorId = ids[comentario.autor];
                if (!comentadorId) continue;

                minutosDepois += Math.floor(Math.random() * 20) + 5;
                const dataComentario = new Date(dataPost.getTime() + minutosDepois * 60000);

                await db.promise().query(
                    'INSERT INTO comentarios (post_id, usuario_id, conteudo, criado_em) VALUES (?, ?, ?, ?)',
                    [postId, comentadorId, comentario.texto, dataComentario]
                );
            }

            console.log(`  ✓ Post de ${item.autor} com ${item.comentarios.length} comentários`);
        } catch (erro) {
            console.error(`  ✗ Erro no post de ${item.autor}:`, erro.message);
        }
    }

    console.log('\n❤️  Adicionando likes iniciais...');
    try {
        const [posts] = await db.promise().query('SELECT id, usuario_id FROM posts LIMIT 50');
        const todosIds = Object.values(ids);
        let totalLikes = 0;

        for (const post of posts) {
            const qtd = Math.floor(Math.random() * 4) + 3;
            const curtidores = todosIds
                .filter(id => id !== post.usuario_id)
                .sort(() => Math.random() - 0.5)
                .slice(0, qtd);

            for (const curtidorId of curtidores) {
                try {
                    await db.promise().query(
                        'INSERT IGNORE INTO likes (post_id, usuario_id) VALUES (?, ?)',
                        [post.id, curtidorId]
                    );
                    totalLikes++;
                } catch (e) {  }
            }
        }
        console.log(`  ✓ ${totalLikes} likes adicionados`);
    } catch (erro) {
        console.error('  ✗ Erro nos likes:', erro.message);
    }

    console.log('\n✅ Seed concluído!');
    console.log(`   ${personagens.length} personagens criados`);
    console.log(`   ${conteudoInicial.length} posts com comentários`);
    console.log(`   Senha padrão de todos: ${SENHA_PADRAO}`);
    console.log('\n   node server.js e bora! 🚀\n');

    process.exit(0);
}

rodarSeed().catch(erro => {
    console.error('Erro geral no seed:', erro);
    process.exit(1);
});

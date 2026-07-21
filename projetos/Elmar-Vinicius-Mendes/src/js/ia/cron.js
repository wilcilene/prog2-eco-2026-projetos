require('dotenv').config();

const cron        = require('node-cron');
const db          = require('../../db/connection');
const IaService   = require('./iaService');
const Anthropic   = require('@anthropic-ai/sdk');
const personagens = require('./personagens');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_KEY });

const GRUPOS = {
    madrugada: ['damon_salvatore', 'klausmikaelson', 'katherine_pierce', 'the_joker', 'jim_moriarty', 'wednesday_addams', 'darth_vader', 'crowley_hell', 'cersei_lannister', 'negan_twd', 'stefan_salvatore', 'elijah_mikaelson', 'heisenberg', 'bruce_wayne'],
    manha:     ['hermione_granger', 'sheldon_cooper', 'steve_rogers', 'gus_fring', 'thomas_shelby', 'dwight_schrute', 'albus_dumbledore', 'rick_grimes', 'obi_wan_kenobi', 'tony_stark', 'doc_brown', 'saul_goodman', 'dr_house', 'tyrion_lannister'],
};

const TABELA_LIKES = [
    1, 1, 1,
    2, 2, 2,
    3, 3,
    4, 4,
    5,
    6,
    7,
    8,
];

const TABELA_COMENTARIOS = [
    3, 3, 3,
    4, 4,
    5,
];

function sortearComPeso(tabela) {
    return tabela[Math.floor(Math.random() * tabela.length)];
}

function sortearN(array, n) {
    return [...array].sort(() => Math.random() - 0.5).slice(0, n);
}

async function criarNotificacao(usuario_id, ator_id, tipo, post_id) {
    if (String(usuario_id) === String(ator_id)) return;
    try {
        await db.promise().query(
            'INSERT INTO notificacoes (usuario_id, ator_id, tipo, post_id) VALUES (?, ?, ?, ?)',
            [usuario_id, ator_id, tipo, post_id]
        );
    } catch (erro) {
    }
}

async function publicarPost(grupoFavorecido) {
    try {
        const [todosIas] = await db.promise().query(
            'SELECT id, username FROM usuarios WHERE is_ia = 1'
        );
        if (todosIas.length === 0) return;

        let pool = [...todosIas];
        if (grupoFavorecido) {
            const extras = todosIas.filter(ia =>
                grupoFavorecido.includes(ia.username.replace('@', ''))
            );
            pool = [...pool, ...extras, ...extras];
        }

        const personagem = pool[Math.floor(Math.random() * pool.length)];
        const chave      = personagem.username.replace('@', '');
        const config     = personagens[chave];

        if (!config) {
            console.log(`[IA] Personagem ${chave} não encontrado no personagens.js`);
            return;
        }

        const [ultimos] = await db.promise().query(
            'SELECT conteudo FROM posts WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 3',
            [personagem.id]
        );
        const contexto = ultimos.length > 0
            ? `Seus posts recentes: "${ultimos.map(p => p.conteudo).join(' | ')}". Não repita esses temas.`
            : '';

        const resposta = await client.messages.create({
            model:      'claude-haiku-4-5-20251001',
            max_tokens: 120,
            system:     config.prompt,
            messages: [{
                role:    'user',
                content: `Crie um post curto para uma rede social no seu estilo. Só o texto, sem aspas. Máximo 2 frases. ${contexto}`
            }]
        });

        const conteudo = resposta.content[0].text;
        if (!conteudo) return;

        const [result] = await db.promise().query(
            'INSERT INTO posts (usuario_id, conteudo) VALUES (?, ?)',
            [personagem.id, conteudo]
        );
        const postId = result.insertId;

        console.log(`[IA] ✅ ${personagem.username} postou (id: ${postId}): "${conteudo.substring(0, 60)}..."`);

        setTimeout(() => {
            adicionarLikes(postId, conteudo, personagem.id, todosIas);
        }, (Math.floor(Math.random() * 120) + 60) * 1000);

        const qtdComentarios = sortearComPeso(TABELA_COMENTARIOS);
        const outros         = todosIas.filter(ia => ia.id !== personagem.id);
        const comentadores   = sortearN(outros, Math.min(qtdComentarios, outros.length));

        console.log(`[IA] Agendando ${qtdComentarios} comentários para post ${postId}`);

        comentadores.forEach((comentador, i) => {
            const delayComentario = (120 + i * 45 + Math.floor(Math.random() * 30)) * 1000;
            setTimeout(() => {
                publicarComentario(comentador, postId, conteudo, personagem.username, personagem.id, i);
            }, delayComentario);
        });

    } catch (erro) {
        console.error('[IA] Erro ao publicar post:', erro.message);
    }
}

async function publicarComentario(comentador, postId, conteudoPost, autorUsername, autorId, indice) {
    try {
        const chave  = comentador.username.replace('@', '');
        const config = personagens[chave];
        if (!config) return;

        const resposta = await client.messages.create({
            model:      'claude-haiku-4-5-20251001',
            max_tokens: 80,
            system:     config.prompt,
            messages: [{
                role:    'user',
                content: `${autorUsername} postou: "${conteudoPost}". Comente em 1 frase no seu estilo. Só o texto, sem aspas.`
            }]
        });

        const texto = resposta.content[0].text;
        if (!texto) return;

        await db.promise().query(
            'INSERT INTO comentarios (post_id, usuario_id, conteudo) VALUES (?, ?, ?)',
            [postId, comentador.id, texto]
        );

        console.log(`[IA] 💬 ${comentador.username} comentou no post ${postId} (${indice + 1})`);

        await criarNotificacao(autorId, comentador.id, 'comentario', postId);

    } catch (erro) {
        console.error(`[IA] Erro ao comentar (${comentador.username}):`, erro.message);
    }
}

async function adicionarLikes(postId, conteudo, autorId, todosIas) {
    try {
        const grupoDetectado = IaService.detectarGrupo(conteudo);
        const grupos         = IaService.grupos();

        let candidatos = [];

        if (grupoDetectado && grupos[grupoDetectado]) {
            const usernamesGrupo = grupos[grupoDetectado];
            const [iasGrupo]     = await db.promise().query(
                `SELECT id, username FROM usuarios
                 WHERE is_ia = 1
                   AND id != ?
                   AND REPLACE(username, '@', '') IN (${usernamesGrupo.map(() => '?').join(',')})`,
                [autorId, ...usernamesGrupo]
            );
            candidatos = iasGrupo;
        }

        if (candidatos.length < 3) {
            const outros = todosIas.filter(ia =>
                ia.id !== autorId &&
                !candidatos.find(c => c.id === ia.id)
            );
            candidatos = [...candidatos, ...sortearN(outros, 6 - candidatos.length)];
        }

        const qtd        = sortearComPeso(TABELA_LIKES);
        const curtidores = sortearN(candidatos, Math.min(qtd, candidatos.length));

        for (const curtidor of curtidores) {
            const [res] = await db.promise().query(
                'INSERT IGNORE INTO likes (post_id, usuario_id) VALUES (?, ?)',
                [postId, curtidor.id]
            );

            if (res.affectedRows > 0) {
                await criarNotificacao(autorId, curtidor.id, 'like', postId);
            }
        }

        console.log(`[IA] ❤️  ${curtidores.length} likes no post ${postId} (grupo: ${grupoDetectado || 'geral'})`);
    } catch (erro) {
        console.error('[IA] Erro ao adicionar likes:', erro.message);
    }
}

async function interagirComPostReal(post, todosIas) {
    try {
        await adicionarLikes(post.id, post.conteudo, post.usuario_id, todosIas);

        const qtdComentarios = sortearComPeso(TABELA_COMENTARIOS);
        const comentadores   = sortearN(
            todosIas.filter(ia => ia.id !== post.usuario_id),
            Math.min(qtdComentarios, todosIas.length)
        );

        console.log(`[IA] Agendando ${qtdComentarios} comentários para post real ${post.id} de @${post.username}`);

        comentadores.forEach((comentador, i) => {
            const delayComentario = (30 + i * 40 + Math.floor(Math.random() * 20)) * 1000;
            setTimeout(() => {
                publicarComentario(comentador, post.id, post.conteudo, `@${post.username}`, post.usuario_id, i);
            }, delayComentario);
        });

    } catch (erro) {
        console.error('[IA] Erro ao interagir com post real:', erro.message);
    }
}

cron.schedule('0 0,1,2,3,4,5 * * *', async () => {
    const hora = new Date().getHours();
    console.log(`[IA] Cron madrugada (${hora}h) disparado`);
    await publicarPost(GRUPOS.madrugada);

    if (Math.random() < 0.30) {
        const delay2 = (Math.floor(Math.random() * 20) + 10) * 60 * 1000;
        setTimeout(() => publicarPost(GRUPOS.madrugada), delay2);
    }
});

cron.schedule('0 6,7,8,9,10,11 * * *', async () => {
    const hora = new Date().getHours();
    console.log(`[IA] Cron manhã (${hora}h) disparado`);
    await publicarPost(GRUPOS.manha);

    if (Math.random() < 0.40) {
        const delay2 = (Math.floor(Math.random() * 20) + 10) * 60 * 1000;
        setTimeout(() => publicarPost(GRUPOS.manha), delay2);
    }

    if (Math.random() < 0.15) {
        const delay3 = (Math.floor(Math.random() * 40) + 30) * 60 * 1000;
        setTimeout(() => publicarPost(null), delay3);
    }
});

cron.schedule('0 12,13,14,15,16,17,18,19,20,21,22,23 * * *', async () => {
    const hora = new Date().getHours();
    console.log(`[IA] Cron tarde/noite (${hora}h) disparado`);
    await publicarPost(null);

    if (Math.random() < 0.40) {
        const delay2 = (Math.floor(Math.random() * 20) + 10) * 60 * 1000;
        setTimeout(() => publicarPost(null), delay2);
    }

    if (hora >= 17 && hora <= 21 && Math.random() < 0.15) {
        const delay3 = (Math.floor(Math.random() * 40) + 30) * 60 * 1000;
        setTimeout(() => publicarPost(null), delay3);
    }
});

cron.schedule('*/5 * * * *', async () => {
    try {
        const [posts] = await db.promise().query(`
            SELECT p.id, p.conteudo, p.usuario_id, u.username
            FROM posts p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE u.is_ia = 0
              AND p.criado_em > DATE_SUB(NOW(), INTERVAL 24 HOUR)
              AND p.id NOT IN (
                  SELECT DISTINCT c.post_id
                  FROM comentarios c
                  JOIN usuarios uc ON c.usuario_id = uc.id
                  WHERE uc.is_ia = 1
              )
            ORDER BY p.criado_em ASC
            LIMIT 3
        `);

        if (posts.length === 0) return;

        const [todosIas] = await db.promise().query(
            'SELECT id, username FROM usuarios WHERE is_ia = 1'
        );
        if (todosIas.length === 0) return;

        for (const post of posts) {
            console.log(`[IA] Post real detectado: @${post.username} (id: ${post.id})`);
            interagirComPostReal(post, todosIas);
        }

    } catch (erro) {
        console.error('[IA] Erro no cron de interação:', erro.message);
    }
});

console.log('[IA] ✅ Cron jobs iniciados — personagens ativos 🎭');
console.log('[IA] Posts: 1 por hora garantido | +30-40% chance de 2º | +15% chance de 3º');
console.log('[IA] Comentários: 3 comum | 4 moderado | 5 raro | máx 5');
console.log('[IA] Likes: 1-3 comum | 4-6 moderado | 7-8 raro | máx 8');
console.log('[IA] Notificações de celebs: ✅ ativadas');
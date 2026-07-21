function toggleLike(btn) {
    const card = btn.closest('.post-card');
    const likeCount = card.querySelector('.like-count');
    const icon = btn.querySelector('i');
    let likes = parseInt(likeCount.innerText);

    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        icon.className = 'fa-regular fa-star';
        likeCount.innerText = likes - 1;
    } else {
        btn.classList.add('liked');
        icon.className = 'fa-solid fa-star';
        likeCount.innerText = likes + 1;
    }
}

function toggleComments(btn) {
    const card = btn.closest('.post-card');
    const section = card.querySelector('.comments-section');

    if (section.style.display === 'block') {
        section.style.display = 'none';
        btn.classList.remove('comment-active');
    } else {
        section.style.display = 'block';
        btn.classList.add('comment-active');
        section.querySelector('input').focus();
    }
}

function adicionarComentario(btn) {
    const input = btn.previousElementSibling;
    const texto = input.value.trim();
    if (texto === '') return;

    const card = btn.closest('.post-card');
    const lista = card.querySelector('.comments-list');
    const contador = card.querySelector('.comment-count');

    const novoComentario = document.createElement('div');
    novoComentario.className = 'comment-item';
    novoComentario.innerHTML = `
        <div class="comment-user">Você</div>
        ${texto}
    `;

    lista.appendChild(novoComentario);
    contador.innerText = parseInt(contador.innerText) + 1;
    input.value = '';
}

function transmitirDados() {
    const txtArea = document.getElementById('post-input');
    const texto = txtArea.value.trim();

    if (texto === '') {
        txtArea.style.borderColor = 'var(--neon-magenta)';
        setTimeout(() => txtArea.style.borderColor = '', 1500);
        return;
    }

    const feed = document.getElementById('feed-container');
    const novoPost = document.createElement('article');
    novoPost.className = 'post-card';

    novoPost.innerHTML = `
        <div class="post-user-info">
            <div class="avatar">U</div>
            <div class="user-details">
                <div class="username">Você</div>
                <div class="post-time"><i class="fa-solid fa-clock"></i> Agora</div>
            </div>
        </div>
        <div class="post-content">${texto.replace(/\n/g, '<br>')}</div>
        <div class="post-stats">
            <span><i class="fa-solid fa-meteor"></i> <span class="like-count">0</span> impulsos</span>
            <span><span class="comment-count">0</span> logs de resposta</span>
        </div>
        <div class="post-interactions">
            <button class="action-btn" onclick="toggleLike(this)">
                <i class="fa-regular fa-star"></i> Impulsionar
            </button>
            <button class="action-btn" onclick="toggleComments(this)">
                <i class="fa-regular fa-comment-dots"></i> Responder
            </button>
            <button class="action-btn">
                <i class="fa-solid fa-satellite-dish"></i> Rebrotar
            </button>
        </div>
        <div class="comments-section">
            <div class="comment-input-box">
                <input type="text" placeholder="Escreva uma resposta estelar...">
                <button class="btn-comment" onclick="adicionarComentario(this)">Enviar</button>
            </div>
            <div class="comments-list"></div>
        </div>
    `;

    feed.insertBefore(novoPost, feed.firstChild);
    txtArea.value = '';
}

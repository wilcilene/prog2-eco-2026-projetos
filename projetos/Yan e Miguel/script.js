const API = 'http://localhost:3000';

async function carregarPilotos(){
  const res = await fetch(`${API}/pilotos`);
  const pilotos = await res.json();
  const lista = document.getElementById('listaPilotos');
  lista.innerHTML = '';
  pilotos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.nome;
    lista.appendChild(li);
  });
}

async function cadastrarPiloto(){
  const nome = document.getElementById('nomePiloto').value;
  await fetch(`${API}/pilotos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  });
  document.getElementById('nomePiloto').value = '';
  carregarPilotos();
}

carregarPilotos();
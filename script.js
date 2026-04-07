const API = "http://localhost:3000";
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) window.location.href = "login.html";

document.getElementById("infoUser").innerText =
  `Logado como: ${usuario.nome} (${usuario.role})`;

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function fecharModal() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

// 🎲 MESA
async function abrirCadastroMesa() {
  document.getElementById("modalMesa").style.display = "block";

  const users = await fetch(API + "/usuarios").then(r => r.json());

  const div = document.getElementById("listaUsuarios");
  div.innerHTML = "";

  users.forEach(u => {
    div.innerHTML += `
      <label>
        <input type="checkbox" value="${u.id}">
        ${u.nome} (${u.role})
      </label><br>
    `;
  });
}

async function criarMesa() {
  const nome = document.getElementById("mesaNome").value;
  const sistema = document.getElementById("mesaSistema").value;

  if (!nome || !sistema) return alert("Preenche tudo 😑");

  const jogadoresIds = Array.from(
    document.querySelectorAll("#listaUsuarios input:checked")
  ).map(c => Number(c.value));

  await fetch(API + "/mesas", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      nome,
      sistema,
      jogadoresIds,
      mestreId: usuario.id
    })
  });

  alert("Mesa criada!");
  fecharModal();
}

// 📅 CALENDÁRIO
async function carregarEventos() {
  const sessoes = await fetch(API + "/sessoes").then(r => r.json());
  const mesas = await fetch(API + "/mesas").then(r => r.json());

  return sessoes.map(s => {
    const mesa = mesas.find(m => m.id === s.mesaId);
    return {
      title: mesa ? mesa.nome : "Sessão",
      start: s.data + "T" + s.hora
    };
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      events: await carregarEventos(),

      dateClick: async (info) => {
        if (usuario.role !== "mestre") return;

        window.dataSelecionada = info.dateStr;

        const mesas = await fetch(API + "/mesas").then(r => r.json());
        const minhas = mesas.filter(m => m.mestreId === usuario.id);

        if (minhas.length === 0) {
          alert("Cria uma mesa primeiro 😑");
          return;
        }

        const select = document.getElementById("selectMesa");
        select.innerHTML = "";

        minhas.forEach(m => {
          select.innerHTML += `<option value="${m.id}">${m.nome}</option>`;
        });

        document.getElementById("modalSolicitacao").style.display = "block";
      }
    }
  );

  calendar.render();
});

// 📅 CONFIRMAR
async function confirmarSolicitacao() {
  const mesaId = document.getElementById("selectMesa").value;
  const hora = document.getElementById("horaSessao").value;

  if (!hora) return alert("Coloca a hora 😑");

  await fetch(API + "/solicitacoes", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      mestreId: usuario.id,
      mesaId: Number(mesaId),
      data: window.dataSelecionada,
      hora
    })
  });

  alert("Solicitação criada!");
  fecharModal();
}

// 🗳️ VOTAÇÃO
async function abrirVotacao() {
  const dados = await fetch(API + "/solicitacoes").then(r => r.json());

  let html = `<button onclick="location.reload()">⬅ Voltar</button><h2>Votação</h2>`;

  dados.forEach(s => {
    html += `
      <div>
        ${s.data} ${s.hora}
        <button onclick="votar(${s.id}, true)">✔</button>
        <button onclick="votar(${s.id}, false)">❌</button>
      </div>
    `;
  });

  document.body.innerHTML = html;
}

async function votar(id, voto) {
  await fetch(API + "/votar", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      solicitacaoId: id,
      mestreId: usuario.id,
      voto
    })
  });

  alert("Votado!");
}
const API = "https://calendario-de-sessoes.onrender.com";

async function cadastrar() {
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const roleInput = document.getElementById("role");

  const nome = nomeInput.value;
  const email = emailInput.value;
  const senha = senhaInput.value;
  const role = roleInput.value;

  console.log({ nome, email, senha, role }); // 👈 debug
  document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado");
  });
  const res = await fetch(`${API}/cadastro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha, role })
  });

  if (!res.ok) {
    alert("Erro ao cadastrar");
    return;
  }

  alert("Cadastrado!");
  window.location.href = "login.html";
}

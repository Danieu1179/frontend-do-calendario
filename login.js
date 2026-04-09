async function login() {
  const API = "https://calendario-de-sessoes.onrender.com";

  const res = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      senha: senha.value
    })
  });

  if (!res.ok) {
    alert("Erro no login");
    return;
  }

  const user = await res.json();

  localStorage.setItem("usuario", JSON.stringify(user));

  window.location.href = "index.html";
}

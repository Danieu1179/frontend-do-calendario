async function login() {
  const res = await fetch("https://calendario-de-sessoes.onrender.com/login", {
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

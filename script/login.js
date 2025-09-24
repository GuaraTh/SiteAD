document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // pega os valores do formulário
  const formData = new FormData(e.target);
  const email = formData.get('email').trim();
  const senha = formData.get('senha');

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  try {
    // envia para a API de login
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const result = await res.json();

    if (res.ok) {
      // salva os dados do usuário no navegador
      localStorage.setItem('token', result.token);
      localStorage.setItem('email', email);

      alert('Login realizado com sucesso!');
      // redireciona para usuario.html
      window.location.href = 'usuario.html';
    } else {
      alert(result.error || 'Erro no login');
    }
  } catch (err) {
    console.error(err);
    alert('Erro de conexão com o servidor');
  }
});

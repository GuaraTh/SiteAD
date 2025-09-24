document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const telefone = form.telefone.value.trim();
  const cpf = form.cpf.value.trim();
  const senha = form.senha.value;
  const confirmacao = form.confirmacao.value;

  if (senha !== confirmacao) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
   const response = await fetch('/api/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome, email, telefone, cpf, senha })
});

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      form.reset();
    } else {
      alert(data.error || 'Erro ao cadastrar');
    }
  } catch (error) {
    alert('Erro na conexão com o servidor');
    console.error(error);
  }
});

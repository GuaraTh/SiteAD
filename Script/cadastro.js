document.getElementById("cadastroForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        senha: document.getElementById("senha").value
    };

    localStorage.setItem("cliente", JSON.stringify(cliente));
    alert("Cadastro realizado com sucesso!");
    window.location.href = "perfil.html"; // redireciona após cadastro
});

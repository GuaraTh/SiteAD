document.addEventListener("DOMContentLoaded", () => {
    const cliente = JSON.parse(localStorage.getItem("cliente"));
    if (cliente) {
        document.getElementById("perfilNome").textContent = cliente.nome;
        document.getElementById("perfilEmail").textContent = cliente.email;
        document.getElementById("perfilTelefone").textContent = cliente.telefone;
    }

    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const lista = document.getElementById("listaAgendamentos");

    agendamentos
        .filter(a => a.email === cliente.email) // só mostra do cliente logado
        .forEach(a => {
            const li = document.createElement("li");
            li.textContent = `${a.servico} - ${a.data} às ${a.hora}`;
            lista.appendChild(li);
        });
});

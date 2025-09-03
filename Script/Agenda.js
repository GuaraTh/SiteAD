document.getElementById("agendaForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const agendamento = {
        email: document.getElementById("emailCliente").value,
        servico: document.getElementById("servico").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value
    };

    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    agendamentos.push(agendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    alert("Agendamento salvo com sucesso!");
    document.getElementById("agendaForm").reset();
});

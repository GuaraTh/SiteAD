document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // if (!token) {
  //   alert("Você precisa estar logado!");
  //   window.location.href = "login.html";
  //   return;
  // }

  //try {
    // 1. Buscar dados do perfil
    //const resPerfil = await fetch("http://localhost:3006/api/profile", {
      //headers: { Authorization: `Bearer ${token}` }
    });

    // const perfil = await resPerfil.json();

    // if (!resPerfil.ok) {
    //   alert(perfil.error || "Erro ao carregar perfil");
    //   window.location.href = "login.html";
    //   return;
    // }

    // Preencher cabeçalho
    document.getElementById("user-name").textContent = perfil.nome;
    document.getElementById("user-email").textContent = perfil.email;

    // Preencher seção de perfil
    document.getElementById("perfil-nome").textContent = perfil.nome;
    document.getElementById("perfil-email").textContent = perfil.email;
    document.getElementById("perfil-telefone").textContent =
      perfil.telefone || "Não informado";
    document.getElementById("perfil-tipo").textContent = perfil.tipo;

    // 2. Buscar agendamentos
    const resAg = await fetch("http://localhost:3006/api/agendamentos", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const agendamentos = await resAg.json();
    const tbody = document.getElementById("tbody-agendamentos");
    tbody.innerHTML = "";

    if (resAg.ok && Array.isArray(agendamentos) && agendamentos.length > 0) {
      agendamentos.forEach((ag) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${ag.servico}</td>
          <td>${ag.data}</td>
          <td>${ag.hora}</td>
          <td>${ag.status || "Pendente"}</td>
        `;
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement("tr");
      tr.innerHTML =
        '<td colspan="4" style="text-align:center;">Nenhum agendamento encontrado</td>';
      tbody.appendChild(tr);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao carregar informações do usuário");
    window.location.href = "login.html";
  }

  // 3. Logout
  const logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.href = "login.html";
    });
  }
});



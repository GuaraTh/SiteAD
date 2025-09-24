
        document.addEventListener('DOMContentLoaded', function() {
            // Logout button functionality
            document.querySelector('.btn-logout').addEventListener('click', function() {
                if (confirm('Tem certeza que deseja sair?')) {
                    alert('Logout realizado com sucesso!');
                    // Redirecionar para a página de login
                }
            });
            
            // Form submission
            document.querySelector('.appointment-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const service = document.getElementById('service').value;
                const date = document.getElementById('date').value;
                const time = document.getElementById('time').value;
                
                if (!service || !date || !time) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }
                
                alert('Consulta agendada com sucesso!');
                this.reset();
            });
            
            // Search functionality
            document.querySelector('.search-form button').addEventListener('click', function() {
                const email = document.querySelector('.search-form input').value;
                if (!email) {
                    alert('Por favor, digite um email para buscar.');
                    return;
                }
                
            });
        });
        const adminEmailHeader = 'admin@advogado.com'; // Para autenticação simples

// Função para carregar perfil do administrador
async function carregarPerfilAdmin() {
  try {
    const res = await fetch('/api/admin/profile', {
      headers: { 'x-admin-email': adminEmailHeader }
    });
    if (!res.ok) throw new Error('Erro ao carregar perfil');
    const perfil = await res.json();
    document.getElementById('admin-name').textContent = perfil.nome;
    document.getElementById('admin-email').textContent = perfil.email;
  } catch (err) {
    console.error(err);
  }
}

// Função para buscar cliente real pelo email
async function buscarCliente(email) {
  try {
    const res = await fetch(`/api/cliente?email=${encodeURIComponent(email)}`, {
      headers: { 'x-admin-email': adminEmailHeader }
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Cliente não encontrado');
      return null;
    }
    return await res.json();
  } catch {
    alert('Erro ao buscar cliente');
    return null;
  }
}

// Função para carregar agendamentos reais
async function carregarAgendamentos() {
  try {
    const res = await fetch('/api/agendamentos', {
      headers: { 'x-admin-email': adminEmailHeader }
    });
    if (!res.ok) throw new Error('Erro ao carregar agendamentos');
    const agendamentos = await res.json();

    const tbody = document.querySelector('.appointments-table tbody');
    tbody.innerHTML = '';

    agendamentos.forEach(a => {
      const tr = document.createElement('tr');

      // Formatar data para dd/mm/yyyy
      const dataFormatada = new Date(a.data).toLocaleDateString('pt-BR');

      tr.innerHTML = `
        <td>${a.cliente}</td>
        <td>${a.servico.charAt(0).toUpperCase() + a.servico.slice(1)}</td>
        <td>${dataFormatada}</td>
        <td>${a.hora.slice(0,5)}</td>
        <td><span class="status-badge status-confirmed">Confirmado</span></td>
        <td>
          <button class="action-btn btn-edit" data-id="${a.id}"><i class="fas fa-edit"></i></button>
          <button class="action-btn btn-delete" data-id="${a.id}"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  carregarPerfilAdmin();
  carregarAgendamentos();

  // Logout
  document.querySelector('.btn-logout').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja sair?')) {
      alert('Logout realizado com sucesso!');
      // Aqui você pode redirecionar para a página de login
    }
  });

  // Buscar cliente pelo email
  document.querySelector('.search-form button').addEventListener('click', async function() {
    const emailInput = document.querySelector('.search-form input');
    const email = emailInput.value.trim();
    if (!email) {
      alert('Por favor, digite um email para buscar.');
      return;
    }

    const cliente = await buscarCliente(email);
    if (!cliente) return;

    // Preencher formulário com dados reais
    document.getElementById('client-name').value = cliente.nome;
    document.getElementById('client-email').value = cliente.email;
    document.getElementById('client-name').dataset.id = cliente.id; // guardar id para agendamento
  });

  // Agendar consulta
  document.querySelector('.appointment-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usuarioId = document.getElementById('client-name').dataset.id;
    if (!usuarioId) {
      alert('Busque um cliente válido antes de agendar.');
      return;
    }

    const servico = document.getElementById('service').value;
    const data = document.getElementById('date').value;
    const hora = document.getElementById('time').value;

    if (!servico || !data || !hora) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmailHeader
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          servico,
          data,
          hora
        })
      });

      const dataRes = await res.json();
      if (!res.ok) {
        alert(dataRes.error || 'Erro ao agendar consulta');
        return;
      }

      alert(dataRes.message);
      this.reset();
      carregarAgendamentos();
    } catch {
      alert('Erro na comunicação com o servidor.');
    }
  });
});
  const token = localStorage.getItem('token');

const res = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const logoutBtn = document.querySelector(".btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.href = "login.html";
    });
  };

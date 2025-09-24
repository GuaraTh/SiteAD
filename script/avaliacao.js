// URL da planilha
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1cObhw1dILbRHbnxGiIuQcu8DgJbexL9JbbFwmo5u0jI/gviz/tq?tqx=out:json";

let avaliacoes = [];
let avaliacaoAtiva = 0;

const avaliacoesGrid = document.getElementById("avaliacoesGrid");
const navigationControls = document.getElementById("navigationControls");
const errorMessage = document.getElementById("errorMessage");

// Buscar dados do Sheets
async function fetchAvaliacoesFromSheets() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    return rows.slice(1).map((row, index) => ({
      id: `avaliacao-${index}`,
      timestamp: row.c[0]?.v || "",
      nomeCliente: row.c[1]?.v || "Cliente Anônimo",
      email: row.c[2]?.v || "",
      telefone: row.c[3]?.v || "",
      nota: row.c[4]?.v || "5",
      avaliacao: row.c[5]?.v || "",
      caso: row.c[6]?.v || "",
      permiteDivulgar: row.c[7]?.v || "Sim",
    }));
  } catch (error) {
    throw new Error("Falha ao conectar com Google Sheets");
  }
}

// Buscar e renderizar
async function fetchAvaliacoes() {
  try {
    const avaliacoesData = await fetchAvaliacoesFromSheets();

    const avaliacoesPublicas = avaliacoesData.filter(
      (av) =>
        av.permiteDivulgar.toLowerCase() === "sim" &&
        av.avaliacao.trim() !== ""
    );

    avaliacoes = avaliacoesPublicas;
    avaliacaoAtiva = 0;
    renderAvaliacoes();
    errorMessage.style.display = "none";
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
    errorMessage.style.display = "block";
  }
}

// Renderizar avaliações
function renderAvaliacoes() {
  if (avaliacoes.length === 0) {
    avaliacoesGrid.innerHTML = `
      <div class="no-avaliacoes">
        <i class="fas fa-comments" style="font-size: 48px; color: #9ca3af; margin-bottom: 16px;"></i>
        <h3>Nenhuma avaliação encontrada</h3>
        <p>Configure o formulário do Google Forms para começar a receber avaliações.</p>
      </div>
    `;
    navigationControls.innerHTML = "";
    return;
  }

  avaliacoesGrid.innerHTML = avaliacoes
    .map(
      (av) => `
      <div class="avaliacao-card">
        <h4>${av.nomeCliente}</h4>
        <p><strong>Nota:</strong> ${av.nota} ⭐</p>
        <p>${av.avaliacao}</p>
        <small>${av.caso} - ${av.timestamp}</small>
      </div>
    `
    )
    .join("");
}

// Executar ao carregar página
document.addEventListener("DOMContentLoaded", fetchAvaliacoes);

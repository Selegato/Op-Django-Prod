document.addEventListener("DOMContentLoaded", function () {
  const cpfInput = document.getElementById("id_cpf");
  const cpfForm = document.getElementById("cpfForm");
  const customerInfo = document.getElementById("customerInfo");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const customerName = document.getElementById("customerName");
  const customerEmail = document.getElementById("customerEmail");
  const customerPhone = document.getElementById("customerPhone");
  const beneficiosContainer = document.getElementById("beneficiosContainer");
  const btnBaixa = document.getElementById("btnBaixa");
  const divBeneficios = document.getElementById("divBeneficios");
  const bandeiraSeletor = document.getElementById("bandeiraSeletor");

  // Máscara para o CPF
  cpfInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length <= 3) {
      this.value = value;
    } else if (value.length <= 6) {
      this.value = value.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    } else if (value.length <= 9) {
      this.value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else {
      this.value = value.replace(
        /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
        "$1.$2.$3-$4"
      );
    }
  });

  // Envio CPF retorna beneficios do cliente
  cpfForm.addEventListener("submit", function (e) {
    e.preventDefault();
    consultarBeneficios();
  });

  bandeiraSeletor.addEventListener("change", function () {
    const bandeiraSelecionada = this.value;
    if (bandeiraSelecionada == "") {
      hideElements([btnBaixa]);
    } else {
      showElements([btnBaixa]);
    }
  });

  btnBaixa.addEventListener("click", function () {
    enviarBeneficiosSelecionados();
  });

  function consultarBeneficios() {
    const formData = new FormData(cpfForm);

    fetch("consulta_beneficios/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("customerName").textContent = data.nome;
        document.getElementById("customerEmail").textContent = data.email;
        document.getElementById("customerPhone").textContent = data.fone;
        displayBeneficios(data.beneficios);
        showElements([customerInfo, beneficiosContainer]);
        hideElements([btnBaixa]);
      })
      .catch((error) => {
        console.error("Erro:", error);
        if (error.message === "400") {
          alert("CPF Inválido");
          hideElements([customerInfo, divBeneficios]);
        } else if (error.message === "404") {
          alert("Cliente não encontrado");
        } else {
          alert("Erro ao buscar informações do cliente");
        }
      });
  }

  function enviarBeneficiosSelecionados() {
    const checkboxes = document.querySelectorAll(".beneficio-checkbox:checked");
    const selectedIds = Array.from(checkboxes).map((checkbox) =>
      checkbox.getAttribute("data-id")
    );

    if (selectedIds.length === 0) {
      alert("Nenhum benefício selecionado.");
      return;
    }

    const bandeira = bandeiraSeletor.value;

    if (!bandeira) {
      alert("Por favor, selecione uma bandeira.");
      return;
    }

    const csrftoken = getCookie("csrftoken");
    loadingIndicator.style.display = "block";

    fetch("baixar_beneficios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ beneficios: selectedIds, bandeira: bandeira }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Status === 200) {
          alert("Benefícios enviados com sucesso.");
          consultarBeneficios();
        } else {
          alert("Erro ao enviar benefícios.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao enviar benefícios.");
      })
      .finally(() => {
        loadingIndicator.style.display = "none";
      });
  }

  function displayBeneficios(beneficios) {
    const beneficiosContainer = document.getElementById("beneficiosContainer");
    beneficiosContainer.innerHTML = ""; // Limpa o conteúdo anterior

    const table = document.createElement("table");
    table.className = "table table-striped";

    const thead = document.createElement("thead");
    thead.innerHTML = `
          <tr>
            <th>Selecionar</th>
            <th>Título</th>
            <th>Nível</th>
            <th>Status</th>
            <th>Data de Ativação</th>
            <th>Data de Resgate</th>
            <th>Quantidade Disponível</th>
          </tr>
        `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    beneficios.forEach((beneficio) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${
              beneficio.Status !== "resgatado"
                ? '<input type="checkbox" class="beneficio-checkbox" data-id="' +
                  beneficio.IdBeneficioUser +
                  '" />'
                : ""
            }</td>
            <td>${beneficio.Titulo}</td>
            <td>${beneficio.Nível}</td>
            <td>${beneficio.Status}</td>
            <td>${beneficio.DtAtivacao}</td>
            <td>${beneficio.DtResgate}</td>
            <td>${beneficio.QtdDisponivel}</td>
          `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    beneficiosContainer.appendChild(table);

    document.getElementById("divBeneficios").style.display = "block";

    const checkboxes = document.querySelectorAll(".beneficio-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", toggleBandeiraSelect);
    });

    // Inicializa o estado do seletor de bandeiras
    toggleBandeiraSelect();
  }

  // Funções auxiliares
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function hideElements(elements) {
    elements.forEach((el) => (el.style.display = "none"));
  }

  function showElements(elements) {
    elements.forEach((el) => (el.style.display = "block"));
  }

  function toggleBandeiraSelect() {
    const checkboxes = document.querySelectorAll(".beneficio-checkbox:checked");
    if (checkboxes.length > 0) {
      bandeiraSeletor.style.display = "block";
    } else {
      bandeiraSeletor.style.display = "none";
    }
  }
});

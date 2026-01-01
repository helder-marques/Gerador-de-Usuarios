const formulario = document.querySelector("#formPaciente");
const lista = document.querySelector("#listaPacientes");
const selecaoPaciente = document.querySelector("#selectPaciente");
const formularioAvaliacao = document.querySelector("#formAvaliacao");
const listaAvaliacoes = document.querySelector("#listaAvaliacoes");
let pacienteEmEdicao = null;
let avaliacaoEmEdicao = null;

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  console.log("Formulario enviado");
  const paciente = {
    nome: document.querySelector("#nome").value,
    sexo: document.querySelector("#sexo").value,
    dataNascimento: document.querySelector("#dataNascimento").value,
    altura: Number(document.querySelector("#altura").value),
  };
  if (pacienteEmEdicao) {
    atualizarPaciente(pacienteEmEdicao, dados);
    pacienteEmEdicao = null;
  } else {
    adicionarPaciente(paciente);
  }
  formulario.reset();
  carregarPacientes();
  carregarSelecaoDePacientes();

  console.log("Paciente salvo", paciente);
});

window.addEventListener("DOMContentLoaded", () => {
  carregarPacientes();
  carregarSelecaoDePacientes();
});

formularioAvaliacao.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const avaliacao = {
    pacienteId: selecaoPaciente.value,
    peso: Number(document.querySelector("#peso").value),
    cintura: Number(document.querySelector("#cintura").value),
    data: document.querySelector("#dataAvaliacao").value,
  };
  adicionarAvaliacao(avaliacao);
  carregarAvaliacoes();
  console.log("Avaliação salva:", avaliacao);

  formularioAvaliacao.reset();
});

selecaoPaciente.addEventListener("change", carregarAvaliacoes);

function carregarPacientes() {
  const pacientes = buscarPacientes();
  lista.innerHTML = "";

  pacientes.forEach((paciente) => {
    const li = document.createElement("li");
    const texto = document.createElement("span");
    li.textContent = `${paciente.nome} (${paciente.sexo})`;
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.style.marginLeft = "10px";
    btnExcluir.addEventListener("click", () => {
      const confirmar = confirm(`Deseja excluir ${paciente.nome}`);
      if (!confirmar) return;
      deletarPaciente(paciente.id);
      selecaoPaciente.value = "";
      carregarPacientes();
      carregarSelecaoDePacientes();
      listaAvaliacoes.innerHTML = "";
    });
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.style.marginLeft = "5px";

    btnEditar.addEventListener("click", () => {
      pacienteEmEdicao = paciente.id;

      document.querySelector("#nome").value = paciente.come;
      document.querySelector("#sexo").value = paciente.sexo;
      document.querySelector("#dataNascimento").value = paciente.dataNascimento;
      document.querySelector("#altura").value = paciente.altura;
    });
    lista.append(texto);
    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    lista.appendChild(li);
  });
}

function carregarSelecaoDePacientes() {
  const pacientes = buscarPacientes();
  selecaoPaciente.innerHTML = '<option value="">Selecione um paciente</option>';

  pacientes.forEach((p) => {
    const opcao = document.createElement("option");
    opcao.value = p.id;
    opcao.textContent = p.nome;
    selecaoPaciente.appendChild(opcao);
  });
}

function carregarAvaliacoes() {
  const pacienteId = selecaoPaciente.value;
  listaAvaliacoes.innerHTML = "";
  if (!pacienteId) return;
  const avaliacoes = buscarAvaliacoesPorPaciente(pacienteId);

  avaliacoes.forEach((a) => {
    const li = document.createElement("li");
    li.textContent = `
        Data:${a.data}|
        Peso:${a.peso}kg|
        IMC:${a.imc}`;
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.stylemarginLeft = "10px";
    btnEditar.addEventListener("click", () => {
      avaliacaoEmEdicao = a.id;
      document.querySelector("#peso").value = a.peso;
      document.querySelector("#cintura").value = a.cintura;
      document.querySelector("dataAvaliacao").value = a.data;
    });

    listaAvaliacoes.appendChild(li);
    listaAvaliacoes.appendChild(btnEditar);
  });
}

function iniciarBancoDeDados() {
  if (!localStorage.getItem("pacientes")) {
    localStorage.setItem("pacientes", JSON.stringify([]));
  }
  if (!localStorage.getItem("avaliacoes")) {
    localStorage.setItem("avaliacoes", JSON.stringify([]));
  }
}

iniciarBancoDeDados();

function buscarPacientes() {
  return JSON.parse(localStorage.getItem("pacientes"));
}

function buscarAvaliacoes() {
  return JSON.parse(localStorage.getItem("avaliacoes"));
}

function adicionarPaciente({ nome, sexo, dataNascimento, altura }) {
  const pacientes = buscarPacientes();
  const novoPaciente = {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    nome: nome,
    sexo: sexo,
    dataNascimento: dataNascimento,
    altura: altura,
  };
  pacientes.push(novoPaciente);
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  return novoPaciente;
}

function calcularIMC(peso, altura) {
  return Number((peso / (altura * altura)).toFixed(2));
}

function adicionarAvaliacao({ pacienteId, peso, cintura, data }) {
  const paciente = buscarPacientes().find((p) => p.id === pacienteId);
  const avaliacoes = buscarAvaliacoes();
  if (!paciente) throw new Error("Paciente não encontrado");
  const novaAvaliacao = {
    pacienteId: pacienteId,
    peso: peso,
    cintura: cintura,
    data: data,
    imc: calcularIMC(peso, paciente.altura),
  };
  avaliacoes.push(novaAvaliacao);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  return novaAvaliacao;
}

function buscarAvaliacoesPorPaciente(pacienteId) {
  return buscarAvaliacoes().filter((a) => a.pacienteId === pacienteId);
}

function deletarPaciente(pacienteId) {
  const pacientesAtualizados = buscarPacientes().filter(
    (p) => p.id !== pacienteId
  );

  localStorage.setItem("pacientes", JSON.stringify(pacientesAtualizados));

  const avaliacoesAtualizadas = buscarAvaliacoes().filter(
    (a) => a.pacienteId !== pacienteId
  );

  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoesAtualizadas));
}

function atualizarPaciente(pacienteId, dadosAtualizados) {
  const pacientes = buscarPacientes();
  const pacientesAtualizados = pacientes.map((p) => {
    if (p.id === pacienteId) {
      return { ...p, ...dadosAtualizados };
    }
    return p;
  });

  localStorage.setItem("pacientes", JSON.stringify(pacientesAtualizados));
}

function atualizarAvaliacao(avaliacaoId, dadosAtualizados) {
  const avaliacoes = buscarAvaliacoes();
  const pacientes = buscarPacientes();
  const avaliacoesAtualizadas = avaliacoes.map((a) => {
    if (a.id === avaliacaoId) {
      const paciente = pacientes.find((p) => p.id === a.pacienteId);
      const peso = dadosAtualizados.peso ?? a.peso;
      return {
        ...a,
        ...dadosAtualizados,
        imc: calcularIMC(peso, paciente.altura),
      };
    }
    return a;
  });
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoesAtualizadas));
}

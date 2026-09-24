async function listarClientes() {

    const lista = document.getElementById("listaClientes");

    lista.innerHTML = "Carregando clientes...";

    try {

        const resposta = await fetch("/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        const clientes = await resposta.json();

        clientes.sort((a, b) =>
         a.nome.localeCompare(b.nome, "pt-BR", {
        sensitivity: "base"
    })
    );
        
        if (clientes.length === 0) {
            lista.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
            return;
        }

        lista.innerHTML = "";

        clientes.forEach(cliente => {

            const div = document.createElement("div");

            div.classList.add("cliente");

            div.innerHTML = `
                <div>
                    <strong>${cliente.nome}</strong><br>
                    CPF: ${cliente.cpf}<br>
                    Telefone: ${cliente.telefone}<br>
                    E-mail: ${cliente.email}
                </div>

                <div>
                    <button onclick="editarCliente(${cliente.id})">
                        Editar
                    </button>

                    <button onclick="excluirCliente(${cliente.id})">
                        Excluir
                    </button>
                </div>
            `;

            lista.appendChild(div);

        });

    } catch (erro) {

        lista.innerHTML = `
            <p>Não foi possível carregar os clientes.</p>
            <p>${erro.message}</p>
        `;

    }

}


function mostrarInicio() {

    document.getElementById("telaInicio").style.display = "block";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "none";

}


function mostrarClientes() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "block";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "none";

    listarClientes();

}

function mostrarOficina() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "none";
    document.getElementById("telaOficina").style.display = "block";
    carregarOficina();
}

async function carregarOficina() {

    try {

        const resposta = await fetch("/oficina");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados da oficina.");
        }

        const oficinas = await resposta.json();

        if (oficinas.length === 0) {
            return;
        }

        const oficina = oficinas[0];

        if (oficina.id && oficina.logo) {
    const previewLogo = document.getElementById("previewLogoOficina");

    previewLogo.src = `/oficina/${oficina.id}/logo`;
    previewLogo.style.display = "block";
}
        document.getElementById("nomeEmpresa").value = oficina.nomeEmpresa || "";
        document.getElementById("nomeFantasia").value = oficina.nomeFantasia || "";
        document.getElementById("cnpj").value = oficina.cnpj || "";
        document.getElementById("telefoneOficina").value = oficina.telefone || "";
        document.getElementById("emailOficina").value = oficina.email || "";
        document.getElementById("enderecoOficina").value = oficina.endereco || "";
        document.getElementById("cidadeOficina").value = oficina.cidade || "";
        document.getElementById("estadoOficina").value = oficina.estado || "";

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível carregar os dados da oficina.");

    }
}

async function salvarOficina(event) {
    event.preventDefault();

    const oficina = {
        nomeEmpresa: document.getElementById("nomeEmpresa").value,
        nomeFantasia: document.getElementById("nomeFantasia").value,
        cnpj: document.getElementById("cnpj").value,
        telefone: document.getElementById("telefoneOficina").value,
        email: document.getElementById("emailOficina").value,
        endereco: document.getElementById("enderecoOficina").value,
        cidade: document.getElementById("cidadeOficina").value,
        estado: document.getElementById("estadoOficina").value
    };

    const arquivoLogo = document.getElementById("logoOficina").files[0];

    const dados = new FormData();

    dados.append(
        "oficina",
        new Blob(
            [JSON.stringify(oficina)],
            { type: "application/json" }
        )
    );

    if (arquivoLogo) {
        dados.append("logo", arquivoLogo);
    }

    try {
        const respostaOficinas = await fetch("/oficina");

        if (!respostaOficinas.ok) {
            throw new Error("Erro ao buscar a oficina existente.");
        }

        const oficinas = await respostaOficinas.json();

        let resposta;

        if (oficinas.length > 0) {

            const oficinaExistente = oficinas[0];

            resposta = await fetch(`/oficina/${oficinaExistente.id}`, {
                method: "PUT",
                body: dados
            });

        } else {

            resposta = await fetch("/oficina", {
                method: "POST",
                body: dados
            });
        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar oficina.");
        }

        const oficinaSalva = await resposta.json();

        alert("Dados da oficina salvos com sucesso!");

        console.log("Oficina salva:", oficinaSalva);

        await carregarOficina();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível salvar os dados da oficina.");
    }
}

function mostrarFormularioCliente() {

    const formulario = document.getElementById("formularioCliente");

    // Garante que estamos criando um novo cliente
    delete formulario.dataset.id;

    document.getElementById("tituloFormularioCliente").textContent = "Novo Cliente";

    document.querySelector("#formularioCliente form").reset();

    formulario.style.display = "block";

}


function fecharFormularioCliente() {

    const formulario = document.getElementById("formularioCliente");

    formulario.style.display = "none";

    document.getElementById("tituloFormularioCliente").textContent = "Novo Cliente";

    delete formulario.dataset.id;

}


async function salvarCliente(event) {

    event.preventDefault();

    const formulario = document.getElementById("formularioCliente");

    const id = formulario.dataset.id;

    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value
    };

    try {

        let resposta;

        if (id) {

            resposta = await fetch(`/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

        } else {

            resposta = await fetch("/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar cliente.");
        }

        if (id) {
            alert("Cliente atualizado com sucesso!");
        } else {
            alert("Cliente cadastrado com sucesso!");
        }

        document.querySelector("#formularioCliente form").reset();

        delete formulario.dataset.id;

        fecharFormularioCliente();

        listarClientes();

    } catch (erro) {

        alert("Não foi possível salvar o cliente.");
        console.error(erro);

    }

}


async function excluirCliente(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`/clientes/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir cliente.");
        }

        alert("Cliente excluído com sucesso!");

        listarClientes();

    } catch (erro) {

        alert("Não foi possível excluir o cliente.");
        console.error(erro);

    }

}


async function editarCliente(id) {

    try {

        const resposta = await fetch(`/clientes/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar cliente.");
        }

        const cliente = await resposta.json();

        const formulario = document.getElementById("formularioCliente");

        formulario.dataset.id = cliente.id;

        document.getElementById("tituloFormularioCliente").textContent = "Editar Cliente";

        document.getElementById("nome").value = cliente.nome;
        document.getElementById("cpf").value = cliente.cpf;
        document.getElementById("telefone").value = cliente.telefone;
        document.getElementById("email").value = cliente.email;

        formulario.style.display = "block";

    } catch (erro) {

        alert("Não foi possível carregar o cliente.");
        console.error(erro);

    }

}
function mostrarVeiculos() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "block";
    document.getElementById("telaOrdensServico").style.display = "none";

    listarVeiculos();

}
function mostrarOrdensServico() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "block";

}
async function listarVeiculos() {

    const lista = document.getElementById("listaVeiculos");

    lista.innerHTML = "Carregando veículos...";

    try {

        const resposta = await fetch("/veiculos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar veículos.");
        }

        const veiculos = await resposta.json();

        if (veiculos.length === 0) {
            lista.innerHTML = "<p>Nenhum veículo cadastrado.</p>";
            return;
        }

        lista.innerHTML = "";

        veiculos.forEach(veiculo => {

            const div = document.createElement("div");

            div.classList.add("veiculo");

            div.innerHTML = `
    <div>
        <strong>${veiculo.marca} ${veiculo.modelo}</strong><br>
        Ano: ${veiculo.ano}<br>
        Placa: ${veiculo.placa}<br>
        Quilometragem: ${veiculo.quilometragem} km<br>
        Cliente: ${veiculo.cliente ? veiculo.cliente.nome : "Não informado"}
    </div>

    <div>
        <button onclick="editarVeiculo(${veiculo.id})">
            Editar
        </button>

        <button onclick="excluirVeiculo(${veiculo.id})">
            Excluir
        </button>
    </div>
`;

            lista.appendChild(div);

        });

    } catch (erro) {

        lista.innerHTML = `
            <p>Não foi possível carregar os veículos.</p>
            <p>${erro.message}</p>
        `;

    }

}
async function mostrarFormularioVeiculo() {

    const formulario = document.getElementById("formularioVeiculo");

    delete formulario.dataset.id;

    formulario.querySelector("h3").textContent = "Novo Veículo";

    document.querySelector("#formularioVeiculo form").reset();

    formulario.style.display = "block";

    await carregarClientesParaVeiculo();

}
async function carregarClientesParaVeiculo() {

    const select = document.getElementById("clienteVeiculo");

    try {

        const resposta = await fetch("/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        const clientes = await resposta.json();

        select.innerHTML = `
            <option value="">Selecione o cliente</option>
        `;

        clientes.forEach(cliente => {

            const option = document.createElement("option");

            option.value = cliente.id;
            option.textContent = cliente.nome;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error(erro);

        select.innerHTML = `
            <option value="">Erro ao carregar clientes</option>
        `;

    }

}
async function salvarVeiculo(event) {

    event.preventDefault();

    const formulario = document.getElementById("formularioVeiculo");
    const id = formulario.dataset.id;

    const veiculo = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        ano: Number(document.getElementById("ano").value),
        placa: document.getElementById("placa").value,
        quilometragem: Number(document.getElementById("quilometragem").value),
        cliente: {
            id: Number(document.getElementById("clienteVeiculo").value)
        }
    };

    try {

        let resposta;

        if (id) {

            // Atualizar veículo existente
            resposta = await fetch(`/veiculos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(veiculo)
            });

        } else {

            // Cadastrar novo veículo
            resposta = await fetch("/veiculos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(veiculo)
            });

        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar veículo.");
        }

        alert(id
            ? "Veículo atualizado com sucesso!"
            : "Veículo cadastrado com sucesso!"
        );

        document.querySelector("#formularioVeiculo form").reset();

        delete formulario.dataset.id;

        fecharFormularioVeiculo();

        listarVeiculos();

    } catch (erro) {

        alert("Não foi possível salvar o veículo.");

        console.error(erro);

    }
}
function fecharFormularioVeiculo() {

    const formulario = document.getElementById("formularioVeiculo");

    formulario.style.display = "none";

    formulario.querySelector("h3").textContent = "Novo Veículo";

    delete formulario.dataset.id;

}
async function excluirVeiculo(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este veículo?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`/veiculos/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir veículo.");
        }

        alert("Veículo excluído com sucesso!");

        listarVeiculos();

    } catch (erro) {

        alert("Não foi possível excluir o veículo.");
        console.error(erro);

    }

}
async function editarVeiculo(id) {

    try {

        const resposta = await fetch(`/veiculos/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar veículo.");
        }

        const veiculo = await resposta.json();

        const formulario = document.getElementById("formularioVeiculo");

        formulario.dataset.id = veiculo.id;

        // Muda o título
        formulario.querySelector("h3").textContent = "Editar Veículo";

        // Preenche os campos
        document.getElementById("marca").value = veiculo.marca;
        document.getElementById("modelo").value = veiculo.modelo;
        document.getElementById("ano").value = veiculo.ano;
        document.getElementById("placa").value = veiculo.placa;
        document.getElementById("quilometragem").value = veiculo.quilometragem;

        // Carrega os clientes no select
        await carregarClientesParaVeiculo();

        // Seleciona o cliente atual
        if (veiculo.cliente) {
            document.getElementById("clienteVeiculo").value = veiculo.cliente.id;
        }

        formulario.style.display = "block";

    } catch (erro) {

        alert("Não foi possível carregar o veículo.");
        console.error(erro);

    }

}
function mostrarOrdensServico() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "block";

}
async function mostrarFormularioOrdemServico() {

    const formulario = document.getElementById("formularioOrdemServico");

    formulario.style.display = "block";

    await carregarClientesParaOrdemServico();

}

async function carregarClientesParaOrdemServico() {

    const select = document.getElementById("clienteOrdemServico");

    try {

        const resposta = await fetch("/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        const clientes = await resposta.json();

        clientes.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR", {
                sensitivity: "base"
            })
        );

        select.innerHTML = `
            <option value="">
                Selecione o cliente
            </option>
        `;

        clientes.forEach(cliente => {

            const option = document.createElement("option");

            option.value = cliente.id;
            option.textContent = cliente.nome;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error(erro);

        select.innerHTML = `
            <option value="">
                Erro ao carregar clientes
            </option>
        `;

    }

}

async function carregarVeiculosParaOrdemServico(clienteId) {

    const select = document.getElementById("veiculoOrdemServico");

    select.innerHTML = `
        <option value="">
            Carregando veículos...
        </option>
    `;

    try {

        const resposta = await fetch(`/veiculos/cliente/${clienteId}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar veículos.");
        }

        const veiculos = await resposta.json();

        select.innerHTML = `
            <option value="">
                Selecione o veículo
            </option>
        `;

        if (veiculos.length === 0) {

            select.innerHTML = `
                <option value="">
                    Nenhum veículo cadastrado para este cliente
                </option>
            `;

            return;
        }

        veiculos.forEach(veiculo => {

            const option = document.createElement("option");

            option.value = veiculo.id;

            option.textContent =
                `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error(erro);

        select.innerHTML = `
            <option value="">
                Erro ao carregar veículos
            </option>
        `;

    }

}
document.getElementById("clienteOrdemServico")
    .addEventListener("change", function () {

        const clienteId = this.value;

        const selectVeiculo =
            document.getElementById("veiculoOrdemServico");

        if (!clienteId) {

            selectVeiculo.innerHTML = `
                <option value="">
                    Selecione primeiro o cliente
                </option>
            `;

            return;
        }

        carregarVeiculosParaOrdemServico(clienteId);

    });
function mostrarCadastroVeiculoNaOS() {
    document.getElementById("cadastroVeiculoNaOS").style.display = "block";
}

function fecharCadastroVeiculoNaOS() {
    document.getElementById("cadastroVeiculoNaOS").style.display = "none";
}
async function salvarVeiculoNaOS() {

    const clienteId = Number(
        document.getElementById("clienteOrdemServico").value
    );

    if (!clienteId) {
        alert("Selecione um cliente antes de cadastrar o veículo.");
        return;
    }

    const veiculo = {
        marca: document.getElementById("marcaVeiculoOS").value,
        modelo: document.getElementById("modeloVeiculoOS").value,
        ano: Number(document.getElementById("anoVeiculoOS").value),
        placa: document.getElementById("placaVeiculoOS").value,
        quilometragem: Number(
            document.getElementById("quilometragemVeiculoOS").value
        ),
        cliente: {
            id: clienteId
        }
    };

    try {

        const resposta = await fetch("/veiculos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(veiculo)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar veículo.");
        }

        const novoVeiculo = await resposta.json();

        alert("Veículo cadastrado com sucesso!");

        await carregarVeiculosParaOrdemServico(clienteId);

        document.getElementById("veiculoOrdemServico").value =
            novoVeiculo.id;

        fecharCadastroVeiculoNaOS();

        document.getElementById("marcaVeiculoOS").value = "";
        document.getElementById("modeloVeiculoOS").value = "";
        document.getElementById("anoVeiculoOS").value = "";
        document.getElementById("placaVeiculoOS").value = "";
        document.getElementById("quilometragemVeiculoOS").value = "";

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível cadastrar o veículo.");
    }
}
async function salvarOrdemServico(event) {

    event.preventDefault();

    const clienteId = Number(
        document.getElementById("clienteOrdemServico").value
    );

    const veiculoId = Number(
        document.getElementById("veiculoOrdemServico").value
    );

    if (!clienteId) {
        alert("Selecione um cliente.");
        return;
    }

    if (!veiculoId) {
        alert("Selecione um veículo.");
        return;
    }

    const ordemServico = {

        dataEntrada: new Date().toISOString().slice(0, 19),

        problemaRelatado:
            document.getElementById("problemaRelatado").value,

        diagnostico:
            document.getElementById("diagnostico").value,

        observacoes:
            document.getElementById("observacoes").value,

        status:
            document.getElementById("statusOrdemServico").value,

        cliente: {
            id: clienteId
        },

        veiculo: {
            id: veiculoId
        },

        oficina: {
            id: 1
        }
    };

    try {

        const resposta = await fetch("/ordens-servico", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(ordemServico)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar ordem de serviço.");
        }

        const novaOrdem = await resposta.json();

        alert(
            "Ordem de serviço #" +
            novaOrdem.id +
            " criada com sucesso!"
        );

        fecharFormularioOrdemServico();

        listarOrdensServico();

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível salvar a ordem de serviço.");
    }
}
function fecharFormularioOrdemServico() {

    document.getElementById("formularioOrdemServico").style.display = "none";

    document.getElementById("formularioOrdemServico")
        .querySelector("form")
        .reset();

    document.getElementById("cadastroVeiculoNaOS").style.display = "none";

    document.getElementById("veiculoOrdemServico").innerHTML = `
        <option value="">
            Selecione o veículo
        </option>
    `;
}
async function listarOrdensServico() {

    const lista = document.getElementById("listaOrdensServico");

    lista.innerHTML = "Carregando ordens de serviço...";

    try {

        const resposta = await fetch("/ordens-servico");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ordens de serviço.");
        }

        const ordens = await resposta.json();

        ordens.reverse();

        if (ordens.length === 0) {
            lista.innerHTML = "Nenhuma ordem de serviço cadastrada.";
            return;
        }

        lista.innerHTML = "";

        ordens.forEach(ordem => {

            const item = document.createElement("div");

            item.className = "resultado";

            item.innerHTML = `
    <h3>Ordem de Serviço #${ordem.id}</h3>

    <p>
        <strong>Cliente:</strong>
        ${ordem.cliente ? ordem.cliente.nome : "Não informado"}
    </p>

    <p>
        <strong>Veículo:</strong>
        ${ordem.veiculo
                    ? ordem.veiculo.marca + " " +
                    ordem.veiculo.modelo + " - " +
                    ordem.veiculo.placa
                    : "Não informado"
                }
    </p>

    <p>
        <strong>Problema:</strong>
        ${ordem.problemaRelatado || "Não informado"}
    </p>

    <p>
        <strong>Diagnóstico:</strong>
        ${ordem.diagnostico || "Não informado"}
    </p>

    <p>
        <strong>Status:</strong>
        ${ordem.status || "Não informado"}
    </p>

    <p>
        <strong>Observações:</strong>
        ${ordem.observacoes || "Nenhuma"}
    </p>

    <button onclick="mostrarFormularioItem(${ordem.id})">
        + Adicionar item
    </button>
   
    <button onclick="editarOrdemServico(${ordem.id})">
         Editar OS
    </button>

    <div id="editarOrdem-${ordem.id}" style="display: none;"></div>

    <div id="formularioItem-${ordem.id}" style="display: none;">

        <h4>Adicionar item</h4>

        <label for="tipoItem-${ordem.id}">
            Tipo
        </label>

        <select id="tipoItem-${ordem.id}">
            <option value="SERVICO">Serviço</option>
            <option value="PECA">Peça</option>
        </select>

        <label for="descricaoItem-${ordem.id}">
            Descrição
        </label>

        <input
            type="text"
            id="descricaoItem-${ordem.id}"
            placeholder="Ex.: Troca de óleo"
        >

        <label for="quantidadeItem-${ordem.id}">
            Quantidade
        </label>

        <input
            type="number"
            id="quantidadeItem-${ordem.id}"
            value="1"
            min="1"
        >

        <label for="valorItem-${ordem.id}">
            Valor unitário
        </label>

        <input
            type="number"
            id="valorItem-${ordem.id}"
            step="0.01"
            min="0"
            placeholder="0,00"
        >

        <button
            onclick="salvarItemOrdemServico(${ordem.id})"
        >
            Salvar item
        </button>

        <button
            onclick="fecharFormularioItem(${ordem.id})"
        >
            Cancelar
        </button>

    </div>

        <div id="itensOrdem-${ordem.id}">
        Carregando itens...
        </div>

    <hr>
`;

            lista.appendChild(item);
            carregarItensOrdemServico(ordem.id);

        });

    } catch (erro) {

        console.error(erro);

        lista.innerHTML =
            "Erro ao carregar as ordens de serviço.";
    }
}


async function editarOrdemServico(ordemId) {
    try {
        const resposta = await fetch(`/ordens-servico/${ordemId}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar ordem de serviço.");
        }

        const ordem = await resposta.json();

        const formulario = document.getElementById(`editarOrdem-${ordemId}`);

        formulario.innerHTML = `
            <div>
                <label>Problema relatado:</label>
                <input 
                    type="text"
                    id="problemaEditar-${ordemId}"
                    value="${ordem.problemaRelatado || ""}"
                >

                <label>Diagnóstico:</label>
                <input 
                    type="text"
                    id="diagnosticoEditar-${ordemId}"
                    value="${ordem.diagnostico || ""}"
                >

                <label>Observações:</label>
                <textarea id="observacoesEditar-${ordemId}">${ordem.observacoes || ""}</textarea>

                <label>Status:</label>
                <select id="statusEditar-${ordemId}">
                    <option value="ABERTA" ${ordem.status === "ABERTA" ? "selected" : ""}>Aberta</option>
                    <option value="EM_ANDAMENTO" ${ordem.status === "EM_ANDAMENTO" ? "selected" : ""}>Em andamento</option>
                    <option value="AGUARDANDO_PECAS" ${ordem.status === "AGUARDANDO_PECAS" ? "selected" : ""}>Aguardando peças</option>
                    <option value="CONCLUIDA" ${ordem.status === "CONCLUIDA" ? "selected" : ""}>Concluída</option>
                    <option value="CANCELADA" ${ordem.status === "CANCELADA" ? "selected" : ""}>Cancelada</option>
                </select>

                <button onclick="salvarEdicaoOrdemServico(${ordemId})">
                    Salvar alteração
                </button>

                <button onclick="cancelarEdicaoOrdemServico(${ordemId})">
                    Cancelar
                </button>
            </div>
        `;

        formulario.style.display = "block";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar a ordem de serviço para edição.");
    }
}

async function salvarEdicaoOrdemServico(ordemId) {
    const problemaRelatado = document.getElementById(`problemaEditar-${ordemId}`).value;
    const diagnostico = document.getElementById(`diagnosticoEditar-${ordemId}`).value;
    const observacoes = document.getElementById(`observacoesEditar-${ordemId}`).value;
    const status = document.getElementById(`statusEditar-${ordemId}`).value;

    const ordemAtualizada = {
        problemaRelatado: problemaRelatado,
        diagnostico: diagnostico,
        observacoes: observacoes,
        status: status
    };

    try {
        const resposta = await fetch(`/ordens-servico/${ordemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ordemAtualizada)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar ordem de serviço.");
        }

        alert("Ordem de serviço atualizada com sucesso!");

        await listarOrdensServico();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível atualizar a ordem de serviço.");
    }
}

function cancelarEdicaoOrdemServico(ordemId) {
    const formulario = document.getElementById(`editarOrdem-${ordemId}`);

    formulario.innerHTML = "";
    formulario.style.display = "none";
}

async function salvarItemOrdemServico(ordemId) {

    const tipo = document.getElementById(
        `tipoItem-${ordemId}`
    ).value;

    const descricao = document.getElementById(
        `descricaoItem-${ordemId}`
    ).value;

    const quantidade = Number(
        document.getElementById(
            `quantidadeItem-${ordemId}`
        ).value
    );

    const valorUnitario = Number(
        document.getElementById(
            `valorItem-${ordemId}`
        ).value
    );

    if (!descricao) {
        alert("Informe a descrição do item.");
        return;
    }

    if (!quantidade || quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }

    if (valorUnitario < 0 || isNaN(valorUnitario)) {
        alert("Informe um valor válido.");
        return;
    }

    const item = {

        tipo: tipo,

        descricao: descricao,

        quantidade: quantidade,

        valorUnitario: valorUnitario,

        ordemServico: {
            id: ordemId
        }
    };

    try {

        const resposta = await fetch(
            `/itens-ordem-servico`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(item)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao salvar item.");
        }

        alert("Item adicionado com sucesso!");

        fecharFormularioItem(ordemId);

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível adicionar o item.");
    }
}
function fecharFormularioItem(ordemId) {

    document.getElementById(
        `formularioItem-${ordemId}`
    ).style.display = "none";
}
function mostrarFormularioItem(ordemId) {

    document.getElementById(
        `formularioItem-${ordemId}`
    ).style.display = "block";
}
async function carregarItensOrdemServico(ordemId) {

    const listaItens = document.getElementById(
        `itensOrdem-${ordemId}`
    );

    try {

        const resposta = await fetch(
            `/itens-ordem-servico/ordem/${ordemId}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar itens.");
        }

        const itens = await resposta.json();

        if (itens.length === 0) {
            listaItens.innerHTML =
                "<p>Nenhum item adicionado.</p>";
            return;
        }

        listaItens.innerHTML = `
            <h4>Itens da Ordem de Serviço</h4>
        `;

        itens.forEach(item => {

            const subtotal =
                item.quantidade * item.valorUnitario;

            listaItens.innerHTML += `
    <div>
        <p>
            <strong>${item.tipo}:</strong>
            ${item.descricao}
            | Qtd: ${item.quantidade}
            | R$ ${subtotal.toFixed(2)}
        </p>

        <button onclick="editarItemOrdemServico(${item.id}, ${ordemId})">
            Editar
        </button>

        <button onclick="excluirItemOrdemServico(${item.id}, ${ordemId})">
            Excluir
        </button>

        <div id="editarItem-${item.id}" style="display: none;"></div>
    </div>
`;
        });

        const respostaTotal =
            await fetch(`/ordens-servico/${ordemId}/total`);

        if (!respostaTotal.ok) {
            throw new Error("Erro ao buscar total da ordem.");
        }

        const total = await respostaTotal.json();

        listaItens.innerHTML += `
            <hr>
            <p>
                <strong>TOTAL DA ORDEM:</strong>
                R$ ${Number(total).toFixed(2)}
            </p>
        `;

    } catch (erro) {

        console.error(erro);

        listaItens.innerHTML =
            "<p>Erro ao carregar os itens.</p>";
    }
}


async function excluirItemOrdemServico(itemId, ordemId) {

    const confirmar =
        confirm("Deseja realmente excluir este item?");

    if (!confirmar) {
        return;
    }

    try {

        const resposta =
            await fetch(`/itens-ordem-servico/${itemId}`, {
                method: "DELETE"
            });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir item.");
        }

        alert("Item excluído com sucesso!");

        await carregarItensOrdemServico(ordemId);

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível excluir o item.");
    }
}

async function editarItemOrdemServico(itemId, ordemId) {
    try {
        const resposta = await fetch(`/itens-ordem-servico/${itemId}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar item.");
        }

        const item = await resposta.json();

        const formulario = document.getElementById(`editarItem-${itemId}`);

        formulario.innerHTML = `
            <div>
                <label>Tipo:</label>
                <select id="tipoEditar-${itemId}">
                    <option value="PECA" ${item.tipo === "PECA" ? "selected" : ""}>Peça</option>
                    <option value="SERVICO" ${item.tipo === "SERVICO" ? "selected" : ""}>Serviço</option>
                </select>

                <label>Descrição:</label>
                <input 
                    type="text" 
                    id="descricaoEditar-${itemId}" 
                    value="${item.descricao}"
                >

                <label>Quantidade:</label>
                <input 
                    type="number" 
                    id="quantidadeEditar-${itemId}" 
                    value="${item.quantidade}"
                    min="1"
                >

                <label>Valor unitário:</label>
                <input 
                    type="number" 
                    id="valorEditar-${itemId}" 
                    value="${item.valorUnitario}"
                    min="0"
                    step="0.01"
                >

                <button onclick="salvarEdicaoItem(${itemId}, ${ordemId})">
                    Salvar alteração
                </button>

                <button onclick="cancelarEdicaoItem(${itemId})">
                    Cancelar
                </button>
            </div>
        `;

        formulario.style.display = "block";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar o item para edição.");
    }
}


async function salvarEdicaoItem(itemId, ordemId) {
    const tipo = document.getElementById(`tipoEditar-${itemId}`).value;
    const descricao = document.getElementById(`descricaoEditar-${itemId}`).value;
    const quantidade = Number(
        document.getElementById(`quantidadeEditar-${itemId}`).value
    );
    const valorUnitario = Number(
        document.getElementById(`valorEditar-${itemId}`).value
    );

    if (!descricao) {
        alert("Informe a descrição do item.");
        return;
    }

    if (!quantidade || quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }

    if (isNaN(valorUnitario) || valorUnitario < 0) {
        alert("Informe um valor válido.");
        return;
    }

    const itemAtualizado = {
        tipo: tipo,
        descricao: descricao,
        quantidade: quantidade,
        valorUnitario: valorUnitario,
        ordemServico: {
            id: ordemId
        }
    };

    try {
        const resposta = await fetch(
            `/itens-ordem-servico/${itemId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemAtualizado)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao atualizar item.");
        }

        alert("Item atualizado com sucesso!");

        await carregarItensOrdemServico(ordemId);

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível atualizar o item.");
    }
}
function cancelarEdicaoItem(itemId) {
    const formulario = document.getElementById(`editarItem-${itemId}`);

    formulario.innerHTML = "";
    formulario.style.display = "none";
}

document.getElementById("logoOficina").addEventListener("change", function () {

    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    const previewLogo = document.getElementById("previewLogoOficina");

    previewLogo.src = URL.createObjectURL(arquivo);
    previewLogo.style.display = "block";
});
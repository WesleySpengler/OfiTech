/* ===== Auxiliares de visual (OfiTech) ===== */
function esc(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

const ROTULOS_STATUS = {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em andamento",
    AGUARDANDO_PECAS: "Aguardando peças",
    FINALIZADA: "Finalizada",
    CONCLUIDA: "Concluída",
    ENTREGUE: "Entregue",
    CANCELADA: "Cancelada"
};

function rotuloStatus(status) {
    if (!status) return "Não informado";
    return ROTULOS_STATUS[status] || status;
}

function classeStatus(status) {
    return status ? String(status).toLowerCase().replace(/[\s_]+/g, "-") : "";
}

function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function placaHtml(placa) {
    return placa ? `<span class="placa" aria-label="Placa ${esc(placa)}">${esc(placa)}</span>` : "";
}

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
                    <div class="linha-topo">
                        <strong class="linha-titulo">${esc(cliente.nome)}</strong>
                    </div>
                    <div class="linha-meta">
                        <span><span class="rot">CPF</span>${esc(cliente.cpf) || "-"}</span>
                        <span><span class="rot">Telefone</span>${esc(cliente.telefone) || "-"}</span>
                        <span><span class="rot">E-mail</span>${esc(cliente.email) || "-"}</span>
                    </div>
                </div>

                <div class="linha-acoes">
                    <button onclick="editarCliente(${cliente.id})">Editar</button>
                    <button onclick="excluirCliente(${cliente.id})">Excluir</button>
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
    document.getElementById("telaOficina").style.display = "none";

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

        const oficina = await resposta.json();

        if (!oficina || !oficina.id) {
            return;
        }

      const previewLogo =
    document.getElementById("previewLogoOficina");

previewLogo.onerror = function () {
    this.style.display = "none";
};

previewLogo.onload = function () {
    this.style.display = "block";
};

previewLogo.src = `/oficina/${oficina.id}/logo`;



        document.getElementById("nomeEmpresa").value =
            oficina.nomeEmpresa || "";

        document.getElementById("nomeFantasia").value =
            oficina.nomeFantasia || "";

        document.getElementById("cnpj").value =
            oficina.cnpj || "";

        document.getElementById("telefoneOficina").value =
            oficina.telefone || "";

        document.getElementById("emailOficina").value =
            oficina.email || "";

        document.getElementById("enderecoOficina").value =
            oficina.endereco || "";

        document.getElementById("cidadeOficina").value =
            oficina.cidade || "";

        document.getElementById("estadoOficina").value =
            oficina.estado || "";

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível carregar os dados da oficina.");
    }
}


async function salvarOficina(event) {

    event.preventDefault();

    const oficina = {

        nomeEmpresa:
            document.getElementById("nomeEmpresa").value,

        nomeFantasia:
            document.getElementById("nomeFantasia").value,

        cnpj:
            document.getElementById("cnpj").value,

        telefone:
            document.getElementById("telefoneOficina").value,

        email:
            document.getElementById("emailOficina").value,

        endereco:
            document.getElementById("enderecoOficina").value,

        cidade:
            document.getElementById("cidadeOficina").value,

        estado:
            document.getElementById("estadoOficina").value
    };

    const arquivoLogo =
        document.getElementById("logoOficina").files[0];

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

        const respostaOficina =
            await fetch("/oficina");

        if (!respostaOficina.ok) {
            throw new Error("Erro ao buscar a oficina.");
        }

        const oficinaExistente =
            await respostaOficina.json();

        let resposta;

        if (oficinaExistente && oficinaExistente.id) {

            resposta = await fetch(
                `/oficina/${oficinaExistente.id}`,
                {
                    method: "PUT",
                    body: dados
                }
            );

        } else {

            resposta = await fetch(
                "/oficina",
                {
                    method: "POST",
                    body: dados
                }
            );
        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar oficina.");
        }

        const oficinaSalva =
            await resposta.json();

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
    document.getElementById("telaOficina").style.display = "none";

    listarVeiculos();
}
function mostrarOrdensServico() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "none";
    document.getElementById("telaVeiculos").style.display = "none";
    document.getElementById("telaOrdensServico").style.display = "block";
    document.getElementById("telaOficina").style.display = "none";

    setTimeout(() => {
        listarOrdensServico();
    }, 300);
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
        <div class="linha-topo">
            <strong class="linha-titulo">${esc(veiculo.marca)} ${esc(veiculo.modelo)}</strong>
            ${placaHtml(veiculo.placa)}
        </div>
        <div class="linha-meta">
            <span><span class="rot">Ano</span>${esc(veiculo.ano)}</span>
            <span><span class="rot">Quilometragem</span>${esc(veiculo.quilometragem)} km</span>
            <span><span class="rot">Cliente</span>${veiculo.cliente ? esc(veiculo.cliente.nome) : "Não informado"}</span>
        </div>
    </div>

    <div class="linha-acoes">
        <button onclick="editarVeiculo(${veiculo.id})">Editar</button>
        <button onclick="excluirVeiculo(${veiculo.id})">Excluir</button>
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

    setTimeout(() => {
        listarOrdensServico();
    }, 300);
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
            novaOrdem.numero +
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

            item.className = "ordem-card " + classeStatus(ordem.status);

            item.innerHTML = `
    <div class="os-topo">
        <h3>Ordem de Serviço #${esc(ordem.numero)}</h3>
        <span class="status-os ${classeStatus(ordem.status)}">${esc(rotuloStatus(ordem.status))}</span>
        ${ordem.veiculo ? placaHtml(ordem.veiculo.placa) : ""}
    </div>

    <dl class="os-dados">
        <div>
            <dt>Cliente</dt>
            <dd>${ordem.cliente ? esc(ordem.cliente.nome) : "Não informado"}</dd>
        </div>
        <div>
            <dt>Veículo</dt>
            <dd>${ordem.veiculo ? esc(ordem.veiculo.marca) + " " + esc(ordem.veiculo.modelo) : "Não informado"}</dd>
        </div>
        <div class="largo">
            <dt>Problema relatado</dt>
            <dd>${esc(ordem.problemaRelatado) || "Não informado"}</dd>
        </div>
        <div>
            <dt>Diagnóstico</dt>
            <dd>${esc(ordem.diagnostico) || "Não informado"}</dd>
        </div>
        <div>
            <dt>Observações</dt>
            <dd>${esc(ordem.observacoes) || "Nenhuma"}</dd>
        </div>
    </dl>

    <div class="os-acoes">
        <button onclick="mostrarFormularioItem(${ordem.id})">+ Adicionar item</button>
        <button onclick="editarOrdemServico(${ordem.id})">Editar OS</button>
        <button onclick="exportarOrdemServicoPDF(${ordem.id})">Exportar PDF</button>
    </div>

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
    const tipo = document.getElementById(`tipoItem-${ordemId}`).value;
    const descricao = document.getElementById(`descricaoItem-${ordemId}`).value;
    const quantidade = Number(document.getElementById(`quantidadeItem-${ordemId}`).value);
    const valorUnitario = Number(document.getElementById(`valorItem-${ordemId}`).value);

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
        ordemServico: { id: ordemId }
    };

    try {
        const resposta = await fetch(`/itens-ordem-servico`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar item.");
        }

        fecharFormularioItem(ordemId);
        await carregarItensOrdemServico(ordemId);

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
        listaItens.ondragover = function(event) {
         event.preventDefault();
        };
        listaItens.ondrop = function(event) {

    event.preventDefault();

    const itemId = event.dataTransfer.getData("text/plain");

    const itemArrastado = document.querySelector(
        `.item-ordem[data-item-id="${itemId}"]`
    );

    const itemDestino = event.target.closest(".item-ordem");

    if (!itemArrastado || !itemDestino) {
        return;
    }

    if (itemArrastado === itemDestino) {
        return;
    }

    const rect = itemDestino.getBoundingClientRect();

if (event.clientY < rect.top + rect.height / 2) {
    itemDestino.before(itemArrastado);
} else {
    itemDestino.after(itemArrastado);
}

    const itensReordenados =
    listaItens.querySelectorAll(".item-ordem");

itensReordenados.forEach((item, index) => {

    const numero = item.querySelector("p strong");

    numero.textContent = `${index + 1}.`;
});
itensReordenados.forEach(async (item, index) => {

    const itemId = item.dataset.itemId;
    const novaOrdem = index + 1;

    try {

        const resposta = await fetch(
            `/itens-ordem-servico/${itemId}/ordem?ordem=${novaOrdem}`,
            {
                method: "PUT"
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao salvar a ordem do item.");
        }

    } catch (erro) {

        console.error(erro);
    }
});
};


        itens.forEach(item => {

            const subtotal =
                item.quantidade * item.valorUnitario;

            listaItens.innerHTML += `
    <div
    class="item-ordem"
    draggable="true"
    data-item-id="${item.id}"
    ondragstart="iniciarArraste(event)"
    ondragend="finalizarArraste(event)"
>
    <p>
        <strong class="item-num">${item.ordem}.</strong>
        <span class="item-tipo ${item.tipo === "PECA" ? "peca" : "servico"}">${item.tipo === "PECA" ? "Peça" : "Serviço"}</span>
        <span class="item-desc">${esc(item.descricao)}</span>
        <span class="item-qtd">Qtd ${esc(item.quantidade)}</span>
        <span class="item-valor">${moeda(subtotal)}</span>
    </p>

    <button onclick="editarItemOrdemServico(${item.id}, ${ordemId})">Editar</button>
    <button onclick="excluirItemOrdemServico(${item.id}, ${ordemId})">Excluir</button>

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
            <p class="total-os">
                <span>Total da ordem</span>
                <strong>${moeda(total)}</strong>
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

async function exportarOrdemServicoPDF(ordemId) {
    try {
        const resposta = await fetch(`/ordens-servico/${ordemId}`);

        if (!resposta.ok) {
            alert("Não foi possível carregar a ordem de serviço.");
            return;
        }

        const ordem = await resposta.json();

        const respostaItens = await fetch(`/itens-ordem-servico/ordem/${ordemId}`);

        if (!respostaItens.ok) {
            alert("Não foi possível carregar os itens da ordem.");
            return;
        }

        const itens = (await respostaItens.json())
            .slice()
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

        const respostaTotal = await fetch(`/ordens-servico/${ordemId}/total`);

        if (!respostaTotal.ok) {
            alert("Não foi possível carregar o total da ordem.");
            return;
        }

        const total = await respostaTotal.json();

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: "mm", format: "a4" });

        // =========================
        // CORES E MEDIDAS
        // =========================

        const ACO = [23, 33, 43];
        const AZUL = [11, 92, 173];
        const SINAL = [245, 183, 0];
        const LINHA = [211, 217, 223];
        const SUAVE = [245, 247, 249];
        const TEXTO = [29, 38, 48];
        const CINZA = [86, 99, 113];

        const MARGEM = 15;
        const LARGURA = 180;
        const LIMITE_Y = 272;

        const CORES_STATUS = {
            "aberta": { fundo: [219, 234, 250], texto: [10, 76, 143] },
            "em-andamento": { fundo: [251, 233, 183], texto: [112, 68, 0] },
            "aguardando-pecas": { fundo: [234, 220, 247], texto: [90, 42, 134] },
            "finalizada": { fundo: [214, 239, 221], texto: [20, 96, 43] },
            "concluida": { fundo: [214, 239, 221], texto: [20, 96, 43] },
            "entregue": { fundo: [210, 236, 239], texto: [13, 88, 97] },
            "cancelada": { fundo: [251, 223, 219], texto: [155, 31, 20] }
        };

        const dinheiro = (valor) => moeda(valor).replace(/\u00a0/g, " ");

        const numeroOrdem = ordem.numero ?? ordem.id;

        const nomeOficina =
            ordem.oficina?.nomeFantasia ||
            ordem.oficina?.nomeEmpresa ||
            "Oficina Mecânica";

        const cor = (tipo, rgb) => {
            if (tipo === "fill") doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            if (tipo === "text") doc.setTextColor(rgb[0], rgb[1], rgb[2]);
            if (tipo === "draw") doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
        };

        const fonte = (estilo, tamanho) => {
            doc.setFont("helvetica", estilo);
            doc.setFontSize(tamanho);
        };

        // =========================
        // DATA
        // =========================

        let dataFormatada = "Não informada";

        if (ordem.dataEntrada) {
            const data = new Date(ordem.dataEntrada);

            if (!isNaN(data.getTime())) {
                dataFormatada = data.toLocaleDateString("pt-BR");
            }
        }

        // =========================
        // LOGO (qualquer formato vira PNG, mantendo a proporção)
        // =========================

        let logo = null;

        try {
            if (ordem.oficina?.id) {
                const respostaLogo = await fetch(`/oficina/${ordem.oficina.id}/logo`);

                if (respostaLogo.ok) {
                    const blobLogo = await respostaLogo.blob();

                    const dataUrl = await new Promise((resolve, reject) => {
                        const leitor = new FileReader();
                        leitor.onloadend = () => resolve(leitor.result);
                        leitor.onerror = reject;
                        leitor.readAsDataURL(blobLogo);
                    });

                    const imagem = await new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = dataUrl;
                    });

                    const canvas = document.createElement("canvas");
                    canvas.width = imagem.naturalWidth;
                    canvas.height = imagem.naturalHeight;
                    canvas.getContext("2d").drawImage(imagem, 0, 0);

                    logo = {
                        dados: canvas.toDataURL("image/png"),
                        largura: imagem.naturalWidth,
                        altura: imagem.naturalHeight
                    };
                }
            }
        } catch (erroLogo) {
            console.warn("Não foi possível carregar a logo:", erroLogo);
        }

        // =========================
        // CABEÇALHO DA PRIMEIRA PÁGINA
        // =========================

        cor("fill", ACO);
        doc.rect(0, 0, 210, 44, "F");
        cor("fill", SINAL);
        doc.rect(0, 44, 210, 2, "F");

        let textoX = MARGEM;

        if (logo) {
            cor("fill", [255, 255, 255]);
            doc.roundedRect(MARGEM - 1, 6, 36, 32, 2, 2, "F");

            const caixaL = 32;
            const caixaA = 28;
            const escala = Math.min(caixaL / logo.largura, caixaA / logo.altura);
            const w = logo.largura * escala;
            const h = logo.altura * escala;

            doc.addImage(
                logo.dados,
                "PNG",
                MARGEM + 1 + (caixaL - w) / 2,
                8 + (caixaA - h) / 2,
                w,
                h
            );

            textoX = MARGEM + 42;
        }

        cor("text", [255, 255, 255]);
        fonte("bold", 14);
        doc.text(doc.splitTextToSize(nomeOficina, 95)[0], textoX, 15);

        fonte("normal", 8.5);
        cor("text", [190, 201, 212]);

        const linhasOficina = [];

        const docTel = [];
        if (ordem.oficina?.cnpj) docTel.push(`CNPJ: ${ordem.oficina.cnpj}`);
        if (ordem.oficina?.telefone) docTel.push(`Telefone: ${ordem.oficina.telefone}`);
        if (docTel.length) linhasOficina.push(docTel.join("    "));

        const local = [ordem.oficina?.endereco, ordem.oficina?.cidade]
            .filter(Boolean)
            .join(" - ");
        const localCompleto = ordem.oficina?.estado
            ? (local ? `${local}/${ordem.oficina.estado}` : ordem.oficina.estado)
            : local;
        if (localCompleto) linhasOficina.push(localCompleto);

        if (ordem.oficina?.email) linhasOficina.push(ordem.oficina.email);

        linhasOficina.slice(0, 3).forEach((linha, i) => {
            doc.text(doc.splitTextToSize(linha, 95)[0], textoX, 22 + i * 6);
        });

        // Número, data e status (lado direito)
        cor("text", [190, 201, 212]);
        fonte("bold", 8);
        doc.text("ORDEM DE SERVIÇO", 195, 13, { align: "right" });

        cor("text", [255, 255, 255]);
        fonte("bold", 24);
        doc.text(`Nº ${numeroOrdem}`, 195, 25, { align: "right" });

        cor("text", [190, 201, 212]);
        fonte("normal", 9);
        doc.text(`Entrada: ${dataFormatada}`, 195, 32, { align: "right" });

        const chaveStatus = classeStatus(ordem.status);
        const coresStatus = CORES_STATUS[chaveStatus] || { fundo: [227, 231, 235], texto: [58, 70, 81] };
        const textoStatus = rotuloStatus(ordem.status);

        fonte("bold", 8);
        const larguraStatus = doc.getTextWidth(textoStatus) + 8;
        cor("fill", coresStatus.fundo);
        doc.roundedRect(195 - larguraStatus, 35, larguraStatus, 6, 1.5, 1.5, "F");
        cor("text", coresStatus.texto);
        doc.text(textoStatus, 195 - larguraStatus / 2, 39.2, { align: "center" });

        // =========================
        // CONTROLE DE PÁGINAS
        // =========================

        let y = 56;

        const desenharCabecalhoContinuacao = () => {
            cor("fill", ACO);
            doc.rect(0, 0, 210, 14, "F");
            cor("fill", SINAL);
            doc.rect(0, 14, 210, 1.5, "F");

            cor("text", [255, 255, 255]);
            fonte("bold", 9);
            doc.text(doc.splitTextToSize(nomeOficina, 100)[0], MARGEM, 9);
            doc.text(`Ordem de Serviço Nº ${numeroOrdem} (continuação)`, 195, 9, { align: "right" });
        };

        const novaPagina = () => {
            doc.addPage();
            desenharCabecalhoContinuacao();
            y = 26;
        };

        const garantirEspaco = (altura) => {
            if (y + altura > LIMITE_Y) {
                novaPagina();
                return true;
            }
            return false;
        };

        const tituloSecao = (texto) => {
            garantirEspaco(16);
            cor("text", ACO);
            fonte("bold", 11);
            doc.text(texto, MARGEM, y);
            cor("draw", LINHA);
            doc.setLineWidth(0.3);
            doc.line(MARGEM, y + 2, MARGEM + LARGURA, y + 2);
            y += 8;
        };

        // =========================
        // CLIENTE E VEÍCULO (dois cartões lado a lado)
        // =========================

        const km = ordem.veiculo?.quilometragem;

        const linhasCliente = [
            ["Nome", ordem.cliente?.nome || "Não informado"],
            ["CPF", ordem.cliente?.cpf || "Não informado"],
            ["Telefone", ordem.cliente?.telefone || "Não informado"]
        ];

        const linhasVeiculo = [
            ["Veículo", ordem.veiculo ? `${ordem.veiculo.marca} ${ordem.veiculo.modelo}` : "Não informado"],
            ["Ano", ordem.veiculo?.ano ? String(ordem.veiculo.ano) : "Não informado"],
            ["Quilometragem", km || km === 0 ? `${Number(km).toLocaleString("pt-BR")} km` : "Não informado"]
        ];

        const larguraCartao = 87;

        const medirCartao = (linhas) => {
            fonte("normal", 10);
            let altura = 12;
            const quebradas = linhas.map(([rotulo, valor]) => {
                const partes = doc.splitTextToSize(String(valor), larguraCartao - 10);
                altura += 4.5 + partes.length * 4.6 + 2.5;
                return { rotulo, partes };
            });
            return { altura: altura + 1, quebradas };
        };

        const cartaoCliente = medirCartao(linhasCliente);
        const cartaoVeiculo = medirCartao(linhasVeiculo);
        const alturaCartoes = Math.max(cartaoCliente.altura, cartaoVeiculo.altura);

        garantirEspaco(alturaCartoes + 4);

        const desenharCartao = (x, titulo, cartao) => {
            cor("fill", SUAVE);
            doc.roundedRect(x, y, larguraCartao, alturaCartoes, 2, 2, "F");

            cor("fill", AZUL);
            doc.rect(x, y + 3, 1.2, 7, "F");

            cor("text", ACO);
            fonte("bold", 11);
            doc.text(titulo, x + 5, y + 8.5);

            let yl = y + 15;

            cartao.quebradas.forEach(({ rotulo, partes }) => {
                cor("text", CINZA);
                fonte("bold", 7.5);
                doc.text(rotulo, x + 5, yl);
                yl += 4.5;

                cor("text", TEXTO);
                fonte("normal", 10);
                doc.text(partes, x + 5, yl);
                yl += partes.length * 4.6 + 2.5;
            });
        };

        desenharCartao(MARGEM, "Cliente", cartaoCliente);
        desenharCartao(MARGEM + 93, "Veículo", cartaoVeiculo);

        // Placa Mercosul no cartão do veículo
        if (ordem.veiculo?.placa) {
            const px = MARGEM + 93 + larguraCartao - 36;
            const py = y + 3.5;

            cor("fill", [255, 255, 255]);
            cor("draw", [20, 24, 29]);
            doc.setLineWidth(0.5);
            doc.roundedRect(px, py, 32, 11, 1.5, 1.5, "FD");

            cor("fill", [31, 79, 163]);
            doc.roundedRect(px + 0.25, py + 0.25, 31.5, 3, 1.2, 1.2, "F");
            doc.rect(px + 0.25, py + 1.5, 31.5, 1.75, "F");

            cor("text", [255, 255, 255]);
            fonte("bold", 4);
            doc.text("BRASIL", px + 16, py + 2.5, { align: "center" });

            cor("text", [20, 24, 29]);
            fonte("bold", 12);
            doc.text(String(ordem.veiculo.placa).toUpperCase(), px + 16, py + 9.3, { align: "center" });
        }

        y += alturaCartoes + 10;

        // =========================
        // SERVIÇO E OBSERVAÇÕES (texto corrido com quebra automática)
        // =========================

        tituloSecao("Serviço");

        const blocosTexto = [
            ["Problema relatado", ordem.problemaRelatado || "Não informado"],
            ["Diagnóstico", ordem.diagnostico || "Não informado"]
        ];

        if (ordem.observacoes) {
            blocosTexto.push(["Observações", ordem.observacoes]);
        }

        blocosTexto.forEach(([rotulo, texto]) => {
            garantirEspaco(14);

            cor("text", CINZA);
            fonte("bold", 7.5);
            doc.text(rotulo, MARGEM, y);
            y += 4.5;

            cor("text", TEXTO);
            fonte("normal", 10);

            doc.splitTextToSize(String(texto), LARGURA).forEach((linha) => {
                garantirEspaco(6);
                doc.text(linha, MARGEM, y);
                y += 4.8;
            });

            y += 3.5;
        });

        y += 3;

        // =========================
        // PEÇAS E SERVIÇOS (tabela)
        // =========================

        tituloSecao("Peças e serviços");

        const COL = { num: 18, tipo: 27, desc: 47, qtd: 130, unit: 160, sub: 192 };
        const LARGURA_DESC = 76;

        const cabecalhoTabela = () => {
            cor("fill", ACO);
            doc.rect(MARGEM, y, LARGURA, 8, "F");

            cor("text", [255, 255, 255]);
            fonte("bold", 8.5);
            doc.text("#", COL.num, y + 5.4);
            doc.text("Tipo", COL.tipo, y + 5.4);
            doc.text("Descrição", COL.desc, y + 5.4);
            doc.text("Qtd.", COL.qtd, y + 5.4, { align: "right" });
            doc.text("Valor unit.", COL.unit, y + 5.4, { align: "right" });
            doc.text("Subtotal", COL.sub, y + 5.4, { align: "right" });

            y += 8;
        };

        garantirEspaco(8 + 12);
        cabecalhoTabela();

        let somaServicos = 0;
        let somaPecas = 0;

        if (itens.length === 0) {
            cor("text", CINZA);
            fonte("normal", 10);
            doc.text("Nenhum item cadastrado.", MARGEM + 5, y + 8);
            y += 14;
        } else {
            itens.forEach((item, index) => {
                const quantidade = Number(item.quantidade) || 0;
                const unitario = Number(item.valorUnitario) || 0;
                const subtotal = quantidade * unitario;
                const ehPeca = item.tipo === "PECA";

                if (ehPeca) somaPecas += subtotal;
                else somaServicos += subtotal;

                fonte("normal", 9);
                const linhasDesc = doc.splitTextToSize(String(item.descricao || ""), LARGURA_DESC);
                const alturaLinha = Math.max(9, linhasDesc.length * 4.2 + 4.8);

                if (y + alturaLinha > LIMITE_Y) {
                    novaPagina();
                    cabecalhoTabela();
                }

                if (index % 2 === 1) {
                    cor("fill", SUAVE);
                    doc.rect(MARGEM, y, LARGURA, alturaLinha, "F");
                }

                const base = y + 6;

                cor("text", CINZA);
                fonte("bold", 9);
                doc.text(`${index + 1}`, COL.num, base);

                const rotuloTipo = ehPeca ? "Peça" : "Serviço";
                cor("fill", ehPeca ? [251, 233, 183] : [219, 234, 250]);
                doc.roundedRect(COL.tipo - 1.5, y + (alturaLinha - 5) / 2, 17, 5, 1, 1, "F");
                cor("text", ehPeca ? [112, 68, 0] : [10, 76, 143]);
                fonte("bold", 7);
                doc.text(rotuloTipo, COL.tipo + 7, y + (alturaLinha - 5) / 2 + 3.5, { align: "center" });

                cor("text", TEXTO);
                fonte("normal", 9);
                doc.text(linhasDesc, COL.desc, base);

                doc.text(String(quantidade), COL.qtd, base, { align: "right" });
                doc.text(dinheiro(unitario), COL.unit, base, { align: "right" });

                fonte("bold", 9);
                doc.text(dinheiro(subtotal), COL.sub, base, { align: "right" });

                y += alturaLinha;
            });
        }

        cor("draw", LINHA);
        doc.setLineWidth(0.3);
        doc.line(MARGEM, y, MARGEM + LARGURA, y);

        // =========================
        // TOTAIS
        // =========================

        y += 8;
        garantirEspaco(36);

        const totaisX = 120;
        const totaisL = 75;

        const linhaTotal = (rotulo, valor) => {
            cor("text", CINZA);
            fonte("normal", 9.5);
            doc.text(rotulo, totaisX, y);
            cor("text", TEXTO);
            fonte("bold", 9.5);
            doc.text(dinheiro(valor), totaisX + totaisL, y, { align: "right" });
            y += 6.5;
        };

        linhaTotal("Serviços", somaServicos);
        linhaTotal("Peças", somaPecas);

        y += 1.5;

        cor("fill", ACO);
        doc.roundedRect(totaisX, y, totaisL, 15, 2, 2, "F");
        cor("fill", SINAL);
        doc.rect(totaisX, y + 2, 1.8, 11, "F");

        cor("text", [190, 201, 212]);
        fonte("bold", 9);
        doc.text("TOTAL", totaisX + 7, y + 9.3);

        cor("text", [255, 255, 255]);
        fonte("bold", 15);
        doc.text(dinheiro(total), totaisX + totaisL - 5, y + 10, { align: "right" });

        y += 15;

        // =========================
        // ASSINATURAS
        // =========================

        y += 26;
        garantirEspaco(18);

        cor("draw", CINZA);
        doc.setLineWidth(0.3);
        doc.line(MARGEM, y, MARGEM + 80, y);
        doc.line(MARGEM + 100, y, MARGEM + 180, y);

        cor("text", CINZA);
        fonte("normal", 8);
        doc.text("Assinatura do cliente", MARGEM + 40, y + 5, { align: "center" });
        doc.text("Assinatura da oficina", MARGEM + 140, y + 5, { align: "center" });

        // =========================
        // RODAPÉ EM TODAS AS PÁGINAS
        // =========================

        const quantidadePaginas = doc.internal.getNumberOfPages();

        for (let pagina = 1; pagina <= quantidadePaginas; pagina++) {
            doc.setPage(pagina);

            const alturaPagina = doc.internal.pageSize.height;

            cor("draw", LINHA);
            doc.setLineWidth(0.3);
            doc.line(MARGEM, alturaPagina - 16, MARGEM + LARGURA, alturaPagina - 16);

            cor("text", CINZA);
            fonte("normal", 8);
            doc.text(
                `${nomeOficina} - Ordem de Serviço Nº ${numeroOrdem}`,
                MARGEM,
                alturaPagina - 9
            );
            doc.text(
                `Página ${pagina} de ${quantidadePaginas}`,
                MARGEM + LARGURA,
                alturaPagina - 9,
                { align: "right" }
            );
        }

        // =========================
        // SALVAR PDF
        // =========================

        doc.save(`Ordem-de-Servico-${numeroOrdem}.pdf`);

    } catch (erro) {
        console.error("Erro ao gerar PDF:", erro);
        alert("Erro ao gerar o PDF.");
    }
}

function iniciarArraste(event) {
    event.dataTransfer.setData(
        "text/plain",
        event.currentTarget.dataset.itemId
    );

    event.currentTarget.classList.add("arrastando");
}

function permitirSoltar(event) {
    event.preventDefault();
}

function finalizarArraste(event) {
    event.currentTarget.classList.remove("arrastando");
}

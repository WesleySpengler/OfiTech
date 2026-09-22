async function listarClientes() {

    const lista = document.getElementById("listaClientes");

    lista.innerHTML = "Carregando clientes...";

    try {

        const resposta = await fetch("/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        const clientes = await resposta.json();

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

}


function mostrarClientes() {

    document.getElementById("telaInicio").style.display = "none";
    document.getElementById("telaClientes").style.display = "block";

    listarClientes();

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
   
    listarVeiculos();

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
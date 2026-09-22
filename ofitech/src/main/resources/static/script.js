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
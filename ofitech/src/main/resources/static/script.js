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
                <strong>${cliente.nome}</strong><br>
                CPF: ${cliente.cpf}<br>
                Telefone: ${cliente.telefone}<br>
                E-mail: ${cliente.email}
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
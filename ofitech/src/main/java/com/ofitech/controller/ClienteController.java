package com.ofitech.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PutMapping; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.Cliente;
import com.ofitech.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @PutMapping("/{id}")
public Cliente atualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
    Cliente clienteExistente = clienteService.buscarPorId(id);

    if (clienteExistente == null) {
        return null;
    }

    clienteExistente.setNome(cliente.getNome());
    clienteExistente.setCpf(cliente.getCpf());
    clienteExistente.setTelefone(cliente.getTelefone());
    clienteExistente.setEmail(cliente.getEmail());

    return clienteService.salvar(clienteExistente);
}

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> listarTodos() {
        return clienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    @PostMapping
    public Cliente salvar(@RequestBody Cliente cliente) {
        return clienteService.salvar(cliente);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {
        clienteService.excluir(id);
        return "Cliente excluído com sucesso!";
    }
}
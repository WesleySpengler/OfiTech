package com.ofitech.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.Cliente;
import com.ofitech.model.Usuario;
import com.ofitech.service.ClienteService;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public ClienteController(
            ClienteService clienteService,
            UsuarioService usuarioService) {

        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Cliente> listarTodos(Authentication authentication) {

        Usuario usuario = usuarioService.buscarPorEmail(authentication.getName());

        return clienteService.listarTodos(usuario.getOficina().getId());
    }

    @GetMapping("/{id}")
    public Cliente buscarPorId(@PathVariable Long id) {
        return clienteService.buscarPorId(id);
    }

    @PostMapping
    public Cliente salvar(
            @RequestBody Cliente cliente,
            Authentication authentication) {

        Usuario usuario = usuarioService.buscarPorEmail(authentication.getName());

        cliente.setOficina(usuario.getOficina());

        return clienteService.salvar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente atualizar(
            @PathVariable Long id,
            @RequestBody Cliente cliente) {

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

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {

        clienteService.excluir(id);

        return "Cliente excluído com sucesso!";
    }
}
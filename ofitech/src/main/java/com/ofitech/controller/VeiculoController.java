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
import com.ofitech.model.Veiculo;
import com.ofitech.service.ClienteService;
import com.ofitech.service.UsuarioService;
import com.ofitech.service.VeiculoService;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;
    private final UsuarioService usuarioService;
    private final ClienteService clienteService;

    public VeiculoController(
            VeiculoService veiculoService,
            UsuarioService usuarioService,
            ClienteService clienteService) {

        this.veiculoService = veiculoService;
        this.usuarioService = usuarioService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Veiculo> listarTodos(Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        return veiculoService.listarTodos(
                usuario.getOficina().getId()
        );
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Veiculo> listarPorCliente(
            @PathVariable Long clienteId,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Cliente cliente =
                clienteService.buscarPorId(clienteId);

        if (cliente == null
                || cliente.getOficina() == null
                || !cliente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return List.of();
        }

        return veiculoService.listarPorCliente(clienteId)
                .stream()
                .filter(veiculo ->
                        veiculo.getOficina() != null
                        && veiculo.getOficina().getId()
                                .equals(usuario.getOficina().getId()))
                .toList();
    }

    @GetMapping("/{id}")
    public Veiculo buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Veiculo veiculo =
                veiculoService.buscarPorId(id);

        if (veiculo == null) {
            return null;
        }

        if (veiculo.getOficina() == null
                || !veiculo.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        return veiculo;
    }

    @PostMapping
    public Veiculo salvar(
            @RequestBody Veiculo veiculo,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (veiculo.getCliente() == null
                || veiculo.getCliente().getId() == null) {
            return null;
        }

        Cliente cliente =
                clienteService.buscarPorId(
                        veiculo.getCliente().getId()
                );

        if (cliente == null
                || cliente.getOficina() == null
                || !cliente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        veiculo.setCliente(cliente);
        veiculo.setOficina(usuario.getOficina());

        return veiculoService.salvar(veiculo);
    }

    @PutMapping("/{id}")
    public Veiculo atualizar(
            @PathVariable Long id,
            @RequestBody Veiculo veiculo,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Veiculo veiculoExistente =
                veiculoService.buscarPorId(id);

        if (veiculoExistente == null) {
            return null;
        }

        if (veiculoExistente.getOficina() == null
                || !veiculoExistente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        if (veiculo.getCliente() == null
                || veiculo.getCliente().getId() == null) {
            return null;
        }

        Cliente cliente =
                clienteService.buscarPorId(
                        veiculo.getCliente().getId()
                );

        if (cliente == null
                || cliente.getOficina() == null
                || !cliente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        veiculoExistente.setMarca(veiculo.getMarca());
        veiculoExistente.setModelo(veiculo.getModelo());
        veiculoExistente.setAno(veiculo.getAno());
        veiculoExistente.setPlaca(veiculo.getPlaca());
        veiculoExistente.setQuilometragem(veiculo.getQuilometragem());
        veiculoExistente.setCliente(cliente);

        return veiculoService.salvar(veiculoExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Veiculo veiculo =
                veiculoService.buscarPorId(id);

        if (veiculo == null) {
            return "Veículo não encontrado.";
        }

        if (veiculo.getOficina() == null
                || !veiculo.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return "Acesso não permitido.";
        }

        veiculoService.excluir(id);

        return "Veículo excluído com sucesso!";
    }
}
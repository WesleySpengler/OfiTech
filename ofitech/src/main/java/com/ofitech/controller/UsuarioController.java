package com.ofitech.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.Usuario;
import com.ofitech.model.UsuarioResponse;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodos(
            Authentication authentication) {

        Usuario usuarioLogado =
                usuarioService.buscarPorEmail(authentication.getName());

        Long oficinaId =
                usuarioLogado.getOficina().getId();

        return usuarioService.listarTodos()
                .stream()
                .filter(usuario ->
                        usuario.getOficina() != null
                        && usuario.getOficina().getId().equals(oficinaId))
                .map(usuario ->
                        new UsuarioResponse(
                                usuario.getId(),
                                usuario.getNome(),
                                usuario.getEmail()
                        ))
                .toList();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuarioLogado =
                usuarioService.buscarPorEmail(authentication.getName());

        Usuario usuario =
                usuarioService.buscarPorId(id);

        if (usuario == null) {
            return null;
        }

        if (usuario.getOficina() == null) {
            return null;
        }

        if (!usuario.getOficina().getId()
                .equals(usuarioLogado.getOficina().getId())) {
            return null;
        }

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
        );
    }

    @PostMapping
    public UsuarioResponse salvar(
            @RequestBody Usuario usuario,
            Authentication authentication) {

        Usuario usuarioLogado =
                usuarioService.buscarPorEmail(authentication.getName());

        usuario.setOficina(usuarioLogado.getOficina());

        Usuario usuarioSalvo =
                usuarioService.salvar(usuario);

        return new UsuarioResponse(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail()
        );
    }

    @DeleteMapping("/{id}")
    public String excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuarioLogado =
                usuarioService.buscarPorEmail(authentication.getName());

        Usuario usuario =
                usuarioService.buscarPorId(id);

        if (usuario == null) {
            return "Usuário não encontrado.";
        }

        if (usuario.getOficina() == null
                || !usuario.getOficina().getId()
                        .equals(usuarioLogado.getOficina().getId())) {
            return "Acesso não permitido.";
        }

        usuarioService.excluir(id);

        return "Usuário excluído com sucesso!";
    }
}
package com.ofitech.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.Oficina;
import com.ofitech.model.Usuario;
import com.ofitech.repository.OficinaRepository;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/cadastro")
public class CadastroController {

    private final OficinaRepository oficinaRepository;
    private final UsuarioService usuarioService;

    public CadastroController(
            OficinaRepository oficinaRepository,
            UsuarioService usuarioService) {

        this.oficinaRepository = oficinaRepository;
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario cadastrar(@RequestBody CadastroRequest request) {

        Oficina oficina = new Oficina();

        oficina.setNomeFantasia(request.nomeOficina);
        oficina.setCnpj(request.cnpj);
        oficina.setTelefone(request.telefone);

        oficina = oficinaRepository.save(oficina);

        Usuario usuario = new Usuario();

        usuario.setNome(request.nome);
        usuario.setEmail(request.email);
        usuario.setSenha(request.senha);
        usuario.setOficina(oficina);

        return usuarioService.salvar(usuario);
    }

    public static class CadastroRequest {

        public String nome;
        public String email;
        public String senha;
        public String nomeOficina;
        public String cnpj;
        public String telefone;
    }
}


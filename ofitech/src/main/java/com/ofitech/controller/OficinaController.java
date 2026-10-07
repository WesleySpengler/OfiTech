package com.ofitech.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ofitech.model.Oficina;
import com.ofitech.model.Usuario;
import com.ofitech.service.OficinaService;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/oficina")
public class OficinaController {

    private final OficinaService oficinaService;
    private final UsuarioService usuarioService;

    public OficinaController(
            OficinaService oficinaService,
            UsuarioService usuarioService) {

        this.oficinaService = oficinaService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public Oficina buscarMinhaOficina(Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        return usuario.getOficina();
    }

    @GetMapping("/{id}")
    public Oficina buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (!usuario.getOficina().getId().equals(id)) {
            return null;
        }

        return oficinaService.buscarPorId(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Oficina salvar(
            @RequestPart("oficina") Oficina oficina,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            Authentication authentication)
            throws IOException {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        oficina.setId(usuario.getOficina().getId());

        if (logo != null && !logo.isEmpty()) {
            oficina.setLogo(logo.getBytes());
        }

        return oficinaService.salvar(oficina);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Oficina atualizar(
            @PathVariable Long id,
            @RequestPart("oficina") Oficina oficina,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            Authentication authentication)
            throws IOException {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (!usuario.getOficina().getId().equals(id)) {
            return null;
        }

        Oficina oficinaExistente =
                oficinaService.buscarPorId(id);

        if (oficinaExistente == null) {
            return null;
        }

        oficinaExistente.setNomeEmpresa(oficina.getNomeEmpresa());
        oficinaExistente.setNomeFantasia(oficina.getNomeFantasia());
        oficinaExistente.setCnpj(oficina.getCnpj());
        oficinaExistente.setTelefone(oficina.getTelefone());
        oficinaExistente.setEmail(oficina.getEmail());
        oficinaExistente.setEndereco(oficina.getEndereco());
        oficinaExistente.setCidade(oficina.getCidade());
        oficinaExistente.setEstado(oficina.getEstado());

        if (logo != null && !logo.isEmpty()) {
            oficinaExistente.setLogo(logo.getBytes());
        }

        return oficinaService.salvar(oficinaExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (!usuario.getOficina().getId().equals(id)) {
            return "Acesso não permitido.";
        }

        oficinaService.excluir(id);

        return "Oficina excluída com sucesso!";
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<byte[]> buscarLogo(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (!usuario.getOficina().getId().equals(id)) {
            return ResponseEntity.notFound().build();
        }

        Oficina oficina =
                oficinaService.buscarPorId(id);

        if (oficina == null || oficina.getLogo() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(oficina.getLogo());
    }
}
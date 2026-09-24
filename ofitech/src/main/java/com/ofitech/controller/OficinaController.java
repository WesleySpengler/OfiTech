package com.ofitech.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.Oficina;
import com.ofitech.service.OficinaService;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/oficina")
public class OficinaController {

    private final OficinaService oficinaService;

    public OficinaController(OficinaService oficinaService) {
        this.oficinaService = oficinaService;
    }

    @GetMapping
    public List<Oficina> listarTodas() {
        return oficinaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Oficina buscarPorId(@PathVariable Long id) {
        return oficinaService.buscarPorId(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public Oficina salvar(
        @RequestPart("oficina") Oficina oficina,
        @RequestPart(value = "logo", required = false) MultipartFile logo) throws IOException {

    if (logo != null && !logo.isEmpty()) {
        oficina.setLogo(logo.getBytes());
    }

    return oficinaService.salvar(oficina);
}

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public Oficina atualizar(
        @PathVariable Long id,
        @RequestPart("oficina") Oficina oficina,
        @RequestPart(value = "logo", required = false) MultipartFile logo) throws IOException {

    Oficina oficinaExistente = oficinaService.buscarPorId(id);

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
    public String excluir(@PathVariable Long id) {
        oficinaService.excluir(id);
        return "Oficina excluída com sucesso!";
    }

    @GetMapping("/{id}/logo")
public ResponseEntity<byte[]> buscarLogo(@PathVariable Long id) {

    Oficina oficina = oficinaService.buscarPorId(id);

    if (oficina == null || oficina.getLogo() == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity
            .ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(oficina.getLogo());
}
}
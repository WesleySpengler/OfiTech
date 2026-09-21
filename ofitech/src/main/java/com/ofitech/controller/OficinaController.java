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

    @PostMapping
    public Oficina salvar(@RequestBody Oficina oficina) {
        return oficinaService.salvar(oficina);
    }

    @PutMapping("/{id}")
    public Oficina atualizar(@PathVariable Long id, @RequestBody Oficina oficina) {

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

        return oficinaService.salvar(oficinaExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {
        oficinaService.excluir(id);
        return "Oficina excluída com sucesso!";
    }
}
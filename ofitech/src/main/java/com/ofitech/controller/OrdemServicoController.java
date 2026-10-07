package com.ofitech.controller;

import java.math.BigDecimal;
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

import com.ofitech.model.OrdemServico;
import com.ofitech.model.Usuario;
import com.ofitech.service.OrdemServicoService;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;
    private final UsuarioService usuarioService;

    public OrdemServicoController(
            OrdemServicoService ordemServicoService,
            UsuarioService usuarioService) {

        this.ordemServicoService = ordemServicoService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<OrdemServico> listarTodas(Authentication authentication) {

        Usuario usuario = usuarioService.buscarPorEmail(authentication.getName());

        return ordemServicoService.listarTodas(
                usuario.getOficina().getId()
        );
    }

    @GetMapping("/{id}")
    public OrdemServico buscarPorId(@PathVariable Long id) {
        return ordemServicoService.buscarPorId(id);
    }

    @PostMapping
    public OrdemServico salvar(
            @RequestBody OrdemServico ordemServico,
            Authentication authentication) {

        Usuario usuario = usuarioService.buscarPorEmail(authentication.getName());

        ordemServico.setOficina(usuario.getOficina());

        return ordemServicoService.salvar(ordemServico);
    }

    @PutMapping("/{id}")
    public OrdemServico atualizar(
            @PathVariable Long id,
            @RequestBody OrdemServico ordemServico) {

        OrdemServico ordemExistente = ordemServicoService.buscarPorId(id);

        if (ordemExistente == null) {
            return null;
        }

        ordemExistente.setDataEntrada(ordemServico.getDataEntrada());
        ordemExistente.setProblemaRelatado(ordemServico.getProblemaRelatado());
        ordemExistente.setDiagnostico(ordemServico.getDiagnostico());
        ordemExistente.setObservacoes(ordemServico.getObservacoes());
        ordemExistente.setStatus(ordemServico.getStatus());
        ordemExistente.setCliente(ordemServico.getCliente());
        ordemExistente.setVeiculo(ordemServico.getVeiculo());

        return ordemServicoService.salvar(ordemExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {
        ordemServicoService.excluir(id);
        return "Ordem de serviço excluída com sucesso!";
    }

    @GetMapping("/{id}/total")
    public BigDecimal calcularTotal(@PathVariable Long id) {
        return ordemServicoService.calcularTotal(id);
    }
}
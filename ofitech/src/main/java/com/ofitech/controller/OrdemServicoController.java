package com.ofitech.controller;

import java.math.BigDecimal;
import java.util.List;


import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.OrdemServico;
import com.ofitech.service.OrdemServicoService;

@RestController
@RequestMapping("/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;

    public OrdemServicoController(OrdemServicoService ordemServicoService) {
        this.ordemServicoService = ordemServicoService;
    }

    @GetMapping
    public List<OrdemServico> listarTodas() {
        return ordemServicoService.listarTodas();
    }

    @GetMapping("/{id}")
    public OrdemServico buscarPorId(@PathVariable Long id) {
        return ordemServicoService.buscarPorId(id);
    }

    @PostMapping
    public OrdemServico salvar(@RequestBody OrdemServico ordemServico) {
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
        ordemExistente.setOficina(ordemServico.getOficina());

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
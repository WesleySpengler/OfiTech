package com.ofitech.service;

import java.util.List;
import java.math.BigDecimal;

import com.ofitech.repository.ItemOrdemServicoRepository;
import org.springframework.stereotype.Service;

import com.ofitech.model.OrdemServico;
import com.ofitech.repository.OrdemServicoRepository;

@Service
public class OrdemServicoService {

    private final OrdemServicoRepository ordemServicoRepository;
    private final ItemOrdemServicoRepository itemOrdemServicoRepository;
   
   public OrdemServicoService(
        OrdemServicoRepository ordemServicoRepository,
        ItemOrdemServicoRepository itemOrdemServicoRepository) {

    this.ordemServicoRepository = ordemServicoRepository;
    this.itemOrdemServicoRepository = itemOrdemServicoRepository;
}

    public List<OrdemServico> listarTodas() {
        return ordemServicoRepository.findAll();
    }

    public OrdemServico buscarPorId(Long id) {
        return ordemServicoRepository.findById(id).orElse(null);
    }

    public OrdemServico salvar(OrdemServico ordemServico) {
        return ordemServicoRepository.save(ordemServico);
    }

    public void excluir(Long id) {
        ordemServicoRepository.deleteById(id);
    }
    public BigDecimal calcularTotal(Long ordemServicoId) {

    return itemOrdemServicoRepository
            .findByOrdemServicoId(ordemServicoId)
            .stream()
            .map(item -> item.getSubtotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}
}
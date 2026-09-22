package com.ofitech.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ofitech.model.ItemOrdemServico;
import com.ofitech.repository.ItemOrdemServicoRepository;

@Service
public class ItemOrdemServicoService {

    private final ItemOrdemServicoRepository itemRepository;

    public ItemOrdemServicoService(ItemOrdemServicoRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<ItemOrdemServico> listarTodos() {
        return itemRepository.findAll();
    }

    public List<ItemOrdemServico> listarPorOrdemServico(Long ordemServicoId) {
    return itemRepository.findByOrdemServicoId(ordemServicoId);
    }
    
    public ItemOrdemServico buscarPorId(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    
    public ItemOrdemServico salvar(ItemOrdemServico item) {
        return itemRepository.save(item);
    }

    public void excluir(Long id) {
        itemRepository.deleteById(id);
    }
}
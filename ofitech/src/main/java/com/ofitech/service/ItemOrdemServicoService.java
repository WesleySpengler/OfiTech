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

    List<ItemOrdemServico> itens =
            itemRepository.findByOrdemServicoId(ordemServicoId);

    int ordem = 1;

    for (ItemOrdemServico item : itens) {

        if (item.getOrdem() == null) {
            item.setOrdem(ordem);
            itemRepository.save(item);
        }

        ordem++;
    }

    return itemRepository.findByOrdemServicoIdOrderByOrdemAsc(ordemServicoId);
    }
    
    public ItemOrdemServico buscarPorId(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    
   public ItemOrdemServico salvar(ItemOrdemServico item) {

    if (item.getOrdem() == null && item.getOrdemServico() != null) {

        List<ItemOrdemServico> itens =
                itemRepository.findByOrdemServicoId(
                        item.getOrdemServico().getId()
                );

        int proximaOrdem = itens.size() + 1;

        item.setOrdem(proximaOrdem);
    }

    return itemRepository.save(item);
    }

    public ItemOrdemServico atualizarOrdem(Long id, Integer ordem) {

    ItemOrdemServico item = itemRepository.findById(id).orElse(null);

    if (item == null) {
        return null;
    }

    item.setOrdem(ordem);

    return itemRepository.save(item);
    }

    public void excluir(Long id) {
        itemRepository.deleteById(id);
    }
}
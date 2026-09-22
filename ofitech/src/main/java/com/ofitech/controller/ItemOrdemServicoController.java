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

import com.ofitech.model.ItemOrdemServico;
import com.ofitech.service.ItemOrdemServicoService;

@RestController
@RequestMapping("/itens-ordem-servico")
public class ItemOrdemServicoController {

    private final ItemOrdemServicoService itemService;

    public ItemOrdemServicoController(ItemOrdemServicoService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<ItemOrdemServico> listarTodos() {
        return itemService.listarTodos();
    }

    @GetMapping("/ordem/{ordemServicoId}")
    public List<ItemOrdemServico> listarPorOrdemServico(@PathVariable Long ordemServicoId) {
    return itemService.listarPorOrdemServico(ordemServicoId);
    }

    @GetMapping("/{id}")
    public ItemOrdemServico buscarPorId(@PathVariable Long id) {
        return itemService.buscarPorId(id);
    }

    @PostMapping
    public ItemOrdemServico salvar(@RequestBody ItemOrdemServico item) {
        return itemService.salvar(item);
    }

    @PutMapping("/{id}")
    public ItemOrdemServico atualizar(
            @PathVariable Long id,
            @RequestBody ItemOrdemServico item) {

        ItemOrdemServico itemExistente = itemService.buscarPorId(id);

        if (itemExistente == null) {
            return null;
        }

        itemExistente.setTipo(item.getTipo());
        itemExistente.setDescricao(item.getDescricao());
        itemExistente.setQuantidade(item.getQuantidade());
        itemExistente.setValorUnitario(item.getValorUnitario());
        itemExistente.setOrdemServico(item.getOrdemServico());

        return itemService.salvar(itemExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {
        itemService.excluir(id);
        return "Item excluído com sucesso!";
    }
}
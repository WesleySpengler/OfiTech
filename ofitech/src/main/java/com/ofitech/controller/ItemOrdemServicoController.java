package com.ofitech.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ofitech.model.ItemOrdemServico;
import com.ofitech.model.OrdemServico;
import com.ofitech.model.Usuario;
import com.ofitech.service.ItemOrdemServicoService;
import com.ofitech.service.OrdemServicoService;
import com.ofitech.service.UsuarioService;

@RestController
@RequestMapping("/itens-ordem-servico")
public class ItemOrdemServicoController {

    private final ItemOrdemServicoService itemService;
    private final UsuarioService usuarioService;
    private final OrdemServicoService ordemServicoService;

    public ItemOrdemServicoController(
            ItemOrdemServicoService itemService,
            UsuarioService usuarioService,
            OrdemServicoService ordemServicoService) {

        this.itemService = itemService;
        this.usuarioService = usuarioService;
        this.ordemServicoService = ordemServicoService;
    }

    @GetMapping
    public List<ItemOrdemServico> listarTodos(
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Long oficinaId =
                usuario.getOficina().getId();

        return itemService.listarTodos()
                .stream()
                .filter(item ->
                        item.getOrdemServico() != null
                        && item.getOrdemServico().getOficina() != null
                        && item.getOrdemServico().getOficina().getId()
                                .equals(oficinaId))
                .toList();
    }

    @GetMapping("/ordem/{ordemServicoId}")
    public List<ItemOrdemServico> listarPorOrdemServico(
            @PathVariable Long ordemServicoId,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Long oficinaId =
                usuario.getOficina().getId();

        return itemService.listarPorOrdemServico(ordemServicoId)
                .stream()
                .filter(item ->
                        item.getOrdemServico() != null
                        && item.getOrdemServico().getOficina() != null
                        && item.getOrdemServico().getOficina().getId()
                                .equals(oficinaId))
                .toList();
    }

    @GetMapping("/{id}")
    public ItemOrdemServico buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        ItemOrdemServico item =
                itemService.buscarPorId(id);

        if (item == null) {
            return null;
        }

        if (item.getOrdemServico() == null
                || item.getOrdemServico().getOficina() == null) {
            return null;
        }

        if (!item.getOrdemServico().getOficina().getId()
                .equals(usuario.getOficina().getId())) {
            return null;
        }

        return item;
    }

    @PostMapping
    public ItemOrdemServico salvar(
            @RequestBody ItemOrdemServico item,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        if (item.getOrdemServico() == null
                || item.getOrdemServico().getId() == null) {
            return null;
        }

        OrdemServico ordem =
                ordemServicoService.buscarPorId(
                        item.getOrdemServico().getId()
                );

        if (ordem == null) {
            return null;
        }

        if (ordem.getOficina() == null
                || !ordem.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        item.setOrdemServico(ordem);

        return itemService.salvar(item);
    }

    @PutMapping("/{id}/ordem")
    public ItemOrdemServico atualizarOrdem(
            @PathVariable Long id,
            @RequestParam Integer ordem,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        ItemOrdemServico item =
                itemService.buscarPorId(id);

        if (item == null) {
            return null;
        }

        if (item.getOrdemServico() == null
                || item.getOrdemServico().getOficina() == null) {
            return null;
        }

        if (!item.getOrdemServico().getOficina().getId()
                .equals(usuario.getOficina().getId())) {
            return null;
        }

        return itemService.atualizarOrdem(id, ordem);
    }

    @PutMapping("/{id}")
    public ItemOrdemServico atualizar(
            @PathVariable Long id,
            @RequestBody ItemOrdemServico item,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        ItemOrdemServico itemExistente =
                itemService.buscarPorId(id);

        if (itemExistente == null) {
            return null;
        }

        if (itemExistente.getOrdemServico() == null
                || itemExistente.getOrdemServico().getOficina() == null) {
            return null;
        }

        if (!itemExistente.getOrdemServico().getOficina().getId()
                .equals(usuario.getOficina().getId())) {
            return null;
        }

        itemExistente.setTipo(item.getTipo());
        itemExistente.setDescricao(item.getDescricao());
        itemExistente.setQuantidade(item.getQuantidade());
        itemExistente.setValorUnitario(item.getValorUnitario());

        return itemService.salvar(itemExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        ItemOrdemServico item =
                itemService.buscarPorId(id);

        if (item == null) {
            return "Item não encontrado.";
        }

        if (item.getOrdemServico() == null
                || item.getOrdemServico().getOficina() == null) {
            return "Acesso não permitido.";
        }

        if (!item.getOrdemServico().getOficina().getId()
                .equals(usuario.getOficina().getId())) {
            return "Acesso não permitido.";
        }

        itemService.excluir(id);

        return "Item excluído com sucesso!";
    }
}
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

import com.ofitech.model.Cliente;
import com.ofitech.model.OrdemServico;
import com.ofitech.model.Usuario;
import com.ofitech.model.Veiculo;
import com.ofitech.service.ClienteService;
import com.ofitech.service.OrdemServicoService;
import com.ofitech.service.UsuarioService;
import com.ofitech.service.VeiculoService;

@RestController
@RequestMapping("/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;
    private final UsuarioService usuarioService;
    private final ClienteService clienteService;
    private final VeiculoService veiculoService;

    public OrdemServicoController(
            OrdemServicoService ordemServicoService,
            UsuarioService usuarioService,
            ClienteService clienteService,
            VeiculoService veiculoService) {

        this.ordemServicoService = ordemServicoService;
        this.usuarioService = usuarioService;
        this.clienteService = clienteService;
        this.veiculoService = veiculoService;
    }

    @GetMapping
    public List<OrdemServico> listarTodas(
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        return ordemServicoService.listarTodas(
                usuario.getOficina().getId()
        );
    }

    @GetMapping("/{id}")
    public OrdemServico buscarPorId(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        OrdemServico ordem =
                ordemServicoService.buscarPorId(id);

        if (ordem == null) {
            return null;
        }

        if (ordem.getOficina() == null
                || !ordem.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {

            return null;
        }

        return ordem;
    }

    @PostMapping
    public OrdemServico salvar(
            @RequestBody OrdemServico ordemServico,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        Long oficinaId =
                usuario.getOficina().getId();

        if (ordemServico.getCliente() == null
                || ordemServico.getCliente().getId() == null) {
            return null;
        }

        Cliente cliente =
                clienteService.buscarPorId(
                        ordemServico.getCliente().getId()
                );

        if (cliente == null
                || cliente.getOficina() == null
                || !cliente.getOficina().getId()
                        .equals(oficinaId)) {
            return null;
        }

        if (ordemServico.getVeiculo() == null
                || ordemServico.getVeiculo().getId() == null) {
            return null;
        }

        Veiculo veiculo =
                veiculoService.buscarPorId(
                        ordemServico.getVeiculo().getId()
                );

        if (veiculo == null
                || veiculo.getOficina() == null
                || !veiculo.getOficina().getId()
                        .equals(oficinaId)) {
            return null;
        }

        if (veiculo.getCliente() == null
                || !veiculo.getCliente().getId()
                        .equals(cliente.getId())) {
            return null;
        }

        ordemServico.setCliente(cliente);
        ordemServico.setVeiculo(veiculo);
        ordemServico.setOficina(usuario.getOficina());

        return ordemServicoService.salvar(ordemServico);
    }

    @PutMapping("/{id}")
    public OrdemServico atualizar(
            @PathVariable Long id,
            @RequestBody OrdemServico ordemServico,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        OrdemServico ordemExistente =
                ordemServicoService.buscarPorId(id);

        if (ordemExistente == null) {
            return null;
        }

        if (ordemExistente.getOficina() == null
                || !ordemExistente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        if (ordemServico.getCliente() == null
                || ordemServico.getCliente().getId() == null) {
            return null;
        }

        Cliente cliente =
                clienteService.buscarPorId(
                        ordemServico.getCliente().getId()
                );

        if (cliente == null
                || cliente.getOficina() == null
                || !cliente.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        if (ordemServico.getVeiculo() == null
                || ordemServico.getVeiculo().getId() == null) {
            return null;
        }

        Veiculo veiculo =
                veiculoService.buscarPorId(
                        ordemServico.getVeiculo().getId()
                );

        if (veiculo == null
                || veiculo.getOficina() == null
                || !veiculo.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {
            return null;
        }

        if (veiculo.getCliente() == null
                || !veiculo.getCliente().getId()
                        .equals(cliente.getId())) {
            return null;
        }

        ordemExistente.setDataEntrada(
                ordemServico.getDataEntrada()
        );

        ordemExistente.setProblemaRelatado(
                ordemServico.getProblemaRelatado()
        );

        ordemExistente.setDiagnostico(
                ordemServico.getDiagnostico()
        );

        ordemExistente.setObservacoes(
                ordemServico.getObservacoes()
        );

        ordemExistente.setStatus(
                ordemServico.getStatus()
        );

        ordemExistente.setCliente(cliente);
        ordemExistente.setVeiculo(veiculo);

        return ordemServicoService.salvar(ordemExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        OrdemServico ordem =
                ordemServicoService.buscarPorId(id);

        if (ordem == null) {
            return "Ordem de serviço não encontrada.";
        }

        if (ordem.getOficina() == null
                || !ordem.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {

            return "Acesso não permitido.";
        }

        ordemServicoService.excluir(id);

        return "Ordem de serviço excluída com sucesso!";
    }

    @GetMapping("/{id}/total")
    public BigDecimal calcularTotal(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario =
                usuarioService.buscarPorEmail(authentication.getName());

        OrdemServico ordem =
                ordemServicoService.buscarPorId(id);

        if (ordem == null) {
            return BigDecimal.ZERO;
        }

        if (ordem.getOficina() == null
                || !ordem.getOficina().getId()
                        .equals(usuario.getOficina().getId())) {

            return BigDecimal.ZERO;
        }

        return ordemServicoService.calcularTotal(id);
    }
}
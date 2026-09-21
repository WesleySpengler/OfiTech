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

import com.ofitech.model.Veiculo;
import com.ofitech.service.VeiculoService;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }

    @GetMapping
    public List<Veiculo> listarTodos() {
        return veiculoService.listarTodos();
    }
     
    @GetMapping("/cliente/{clienteId}")
public List<Veiculo> listarPorCliente(@PathVariable Long clienteId) {
    return veiculoService.listarPorCliente(clienteId);
}

    @GetMapping("/{id}")
    public Veiculo buscarPorId(@PathVariable Long id) {
        return veiculoService.buscarPorId(id);
    }

    @PostMapping
    public Veiculo salvar(@RequestBody Veiculo veiculo) {
        return veiculoService.salvar(veiculo);
    }

    @PutMapping("/{id}")
    public Veiculo atualizar(@PathVariable Long id, @RequestBody Veiculo veiculo) {

        Veiculo veiculoExistente = veiculoService.buscarPorId(id);

        if (veiculoExistente == null) {
            return null;
        }

        veiculoExistente.setMarca(veiculo.getMarca());
        veiculoExistente.setModelo(veiculo.getModelo());
        veiculoExistente.setAno(veiculo.getAno());
        veiculoExistente.setPlaca(veiculo.getPlaca());
        veiculoExistente.setQuilometragem(veiculo.getQuilometragem());
        veiculoExistente.setCliente(veiculo.getCliente());

        return veiculoService.salvar(veiculoExistente);
    }

    @DeleteMapping("/{id}")
    public String excluir(@PathVariable Long id) {
        veiculoService.excluir(id);
        return "Veículo excluído com sucesso!";
    }
}
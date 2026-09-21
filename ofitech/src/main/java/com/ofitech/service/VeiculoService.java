package com.ofitech.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ofitech.model.Veiculo;
import com.ofitech.repository.VeiculoRepository;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }
    public List<Veiculo> listarPorCliente(Long clienteId) {
    return veiculoRepository.findByClienteId(clienteId);
}

    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id).orElse(null);
    }

    public Veiculo salvar(Veiculo veiculo) {
        return veiculoRepository.save(veiculo);
    }

    public void excluir(Long id) {
        veiculoRepository.deleteById(id);
    }
}
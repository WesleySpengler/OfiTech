package com.ofitech.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ofitech.model.Oficina;
import com.ofitech.repository.OficinaRepository;

@Service
public class OficinaService {

    private final OficinaRepository oficinaRepository;

    public OficinaService(OficinaRepository oficinaRepository) {
        this.oficinaRepository = oficinaRepository;
    }

    public List<Oficina> listarTodas() {
        return oficinaRepository.findAll();
    }

    public Oficina buscarPorId(Long id) {
        return oficinaRepository.findById(id).orElse(null);
    }

    public Oficina salvar(Oficina oficina) {
        return oficinaRepository.save(oficina);
    }

    public void excluir(Long id) {
        oficinaRepository.deleteById(id);
    }
}
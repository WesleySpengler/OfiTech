package com.ofitech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ofitech.model.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    List<Veiculo> findByClienteId(Long clienteId);
}
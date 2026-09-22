package com.ofitech.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ofitech.model.OrdemServico;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {
}
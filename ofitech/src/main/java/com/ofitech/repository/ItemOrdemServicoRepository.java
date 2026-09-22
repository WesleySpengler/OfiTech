package com.ofitech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ofitech.model.ItemOrdemServico;

public interface ItemOrdemServicoRepository extends JpaRepository<ItemOrdemServico, Long> {

    List<ItemOrdemServico> findByOrdemServicoId(Long ordemServicoId);
}
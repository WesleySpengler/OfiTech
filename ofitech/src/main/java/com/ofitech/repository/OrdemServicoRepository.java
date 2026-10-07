package com.ofitech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ofitech.model.OrdemServico;

public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

    List<OrdemServico> findByOficinaId(Long oficinaId);

    @Query("SELECT COALESCE(MAX(o.numero), 0) FROM OrdemServico o WHERE o.oficina.id = :oficinaId")
    Long buscarUltimoNumeroPorOficina(@Param("oficinaId") Long oficinaId);

}
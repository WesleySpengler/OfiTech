package com.ofitech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ofitech.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByOficinaId(Long oficinaId);

}
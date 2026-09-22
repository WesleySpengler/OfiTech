package com.ofitech.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ItemOrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;

    private String descricao;

    private Integer quantidade;

    private BigDecimal valorUnitario;

    @ManyToOne
    @JoinColumn(name = "ordem_servico_id")
    private OrdemServico ordemServico;

    public ItemOrdemServico() {
    }
    public BigDecimal getSubtotal() {
    if (quantidade == null || valorUnitario == null) {
        return BigDecimal.ZERO;
    }

    return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
}

    public Long getId() {
        return id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public OrdemServico getOrdemServico() {
        return ordemServico;
    }

    public void setOrdemServico(OrdemServico ordemServico) {
        this.ordemServico = ordemServico;
    }
}
package com.acadly.gestao_tarefas.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    private String descricao;

    private LocalDate dataEntrega;

    private Double notaMaxima;

    private String linkPdf;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "turma_id")
    private Turma turma;

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDate getDataEntrega() { return dataEntrega; }
    public void setDataEntrega(LocalDate dataEntrega) { this.dataEntrega = dataEntrega; }

    public Double getNotaMaxima() { return notaMaxima; }
    public void setNotaMaxima(Double notaMaxima) { this.notaMaxima = notaMaxima; }

    public String getLinkPdf() { return linkPdf; }
    public void setLinkPdf(String linkPdf) { this.linkPdf = linkPdf; }

    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }
}

package com.acadly.gestao_tarefas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EntregaTarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id")
    private Usuario aluno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tarefa_id")
    private Tarefa tarefa;

    private String linkEntrega;

    private Double notaRecebida;

    private boolean entregue = false;

    private LocalDateTime dataEnvio;

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getAluno() { return aluno; }
    public void setAluno(Usuario aluno) { this.aluno = aluno; }

    public Tarefa getTarefa() { return tarefa; }
    public void setTarefa(Tarefa tarefa) { this.tarefa = tarefa; }

    public String getLinkEntrega() { return linkEntrega; }
    public void setLinkEntrega(String linkEntrega) { this.linkEntrega = linkEntrega; }

    public Double getNotaRecebida() { return notaRecebida; }
    public void setNotaRecebida(Double notaRecebida) { this.notaRecebida = notaRecebida; }

    public boolean isEntregue() { return entregue; }
    public void setEntregue(boolean entregue) { this.entregue = entregue; }

    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
}

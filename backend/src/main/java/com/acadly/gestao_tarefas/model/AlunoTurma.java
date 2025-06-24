package com.acadly.gestao_tarefas.model;

import jakarta.persistence.*;

@Entity
public class AlunoTurma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario aluno;

    @ManyToOne
    private Turma turma;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getAluno() { return aluno; }
    public void setAluno(Usuario aluno) { this.aluno = aluno; }

    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }
}

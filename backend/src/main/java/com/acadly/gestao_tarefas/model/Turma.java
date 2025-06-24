package com.acadly.gestao_tarefas.model;

import jakarta.persistence.*;

@Entity
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeMateria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "professor_id")
    private Usuario professor;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeMateria() { return nomeMateria; }
    public void setNomeMateria(String nomeMateria) { this.nomeMateria = nomeMateria; }

    public Usuario getProfessor() { return professor; }
    public void setProfessor(Usuario professor) { this.professor = professor; }
}

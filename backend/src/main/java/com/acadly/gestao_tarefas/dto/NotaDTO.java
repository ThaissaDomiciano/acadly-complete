package com.acadly.gestao_tarefas.dto;

public class NotaDTO {
    private String materia;
    private Double nota;

    public NotaDTO(String materia, Double nota) {
        this.materia = materia;
        this.nota = nota;
    }

    public String getMateria() {
        return materia;
    }

    public Double getNota() {
        return nota;
    }
}

package com.acadly.gestao_tarefas.dto;

public class StatusAtividadeDTO {
    private String titulo;
    private String status;

    public StatusAtividadeDTO(String titulo, String status) {
        this.titulo = titulo;
        this.status = status;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getStatus() {
        return status;
    }
}

package com.acadly.gestao_tarefas.dto;

import java.time.LocalDateTime;

import com.acadly.gestao_tarefas.model.Notificacao;

public class NotificacaoResponseDTO {
    private String titulo;
    private String mensagem;
    private LocalDateTime dataEnvio;
    private String nomeProfessor;
    private String nomeTurma;

    public NotificacaoResponseDTO(Notificacao notificacao) {
        this.titulo = notificacao.getTitulo();
        this.mensagem = notificacao.getMensagem();
        this.dataEnvio = notificacao.getDataEnvio();
        this.nomeProfessor = notificacao.getProfessor().getNome();
        this.nomeTurma = notificacao.getTurma().getNomeMateria();
    }

    public String getTitulo() {
        return titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public String getNomeProfessor() {
        return nomeProfessor;
    }

    public String getNomeTurma() {
        return nomeTurma;
    }
}

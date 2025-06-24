package com.acadly.gestao_tarefas.dto;

import com.acadly.gestao_tarefas.model.Usuario;

public class LoginResponse {
    private String mensagem;
    private Usuario usuario;

    public LoginResponse(String mensagem, Usuario usuario) {
        this.setMensagem(mensagem);
        this.setUsuario(usuario);
    }

	public String getMensagem() {
		return mensagem;
	}

	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

 
}

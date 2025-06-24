package com.acadly.gestao_tarefas.service;

import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public List<Usuario> buscarPorTipo(Usuario.TipoUsuario tipo) {
        return usuarioRepository.findByTipo(tipo);
    }
    public Usuario salvarUsuario(Usuario usuario) {
        String senhaCriptografada = new BCryptPasswordEncoder().encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepository.save(usuario);
    }
}

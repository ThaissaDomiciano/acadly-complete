package com.acadly.gestao_tarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acadly.gestao_tarefas.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByTipo(Usuario.TipoUsuario tipo);
}

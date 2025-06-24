package com.acadly.gestao_tarefas.controller;

import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.salvarUsuario(usuario); 
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.buscarTodos();
    }

    @GetMapping("/tipo/{tipo}")
    public List<Usuario> listarPorTipo(@PathVariable Usuario.TipoUsuario tipo) {
        return usuarioService.buscarPorTipo(tipo);
    }

    @GetMapping("/{id}")
    public Optional<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }
}

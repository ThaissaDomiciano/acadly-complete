package com.acadly.gestao_tarefas.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.acadly.gestao_tarefas.dto.LoginRequest;
import com.acadly.gestao_tarefas.dto.LoginResponse;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(loginRequest.getEmail());

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos");
        }

        Usuario usuario = usuarioOptional.get();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if (!encoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos");
        }

        LoginResponse resposta = new LoginResponse("Login realizado com sucesso", usuario);
        return ResponseEntity.ok(resposta);
    }
}

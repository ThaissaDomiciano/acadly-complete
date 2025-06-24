package com.acadly.gestao_tarefas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.acadly.gestao_tarefas.dto.NotificacaoRequestDTO;
import com.acadly.gestao_tarefas.dto.NotificacaoResponseDTO;
import com.acadly.gestao_tarefas.model.Notificacao;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.UsuarioRepository;
import com.acadly.gestao_tarefas.service.NotificacaoService;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

   
    @PostMapping
    public ResponseEntity<?> enviar(@RequestBody NotificacaoRequestDTO dto) {
        notificacaoService.enviar(dto);
        return ResponseEntity.ok().build();
    }

    
    @GetMapping("/aluno/{idAluno}")
    public ResponseEntity<List<NotificacaoResponseDTO>> buscarPorAluno(@PathVariable Long idAluno) {
        Usuario aluno = usuarioRepository.findById(idAluno)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (aluno.getTipo() != Usuario.TipoUsuario.ALUNO) {
            return ResponseEntity.badRequest().body(null);
        }

        List<NotificacaoResponseDTO> notificacoes = notificacaoService.buscarPorAluno(aluno);
        return ResponseEntity.ok(notificacoes);
    }
    
    @GetMapping("/turma/{id}")
    public ResponseEntity<List<NotificacaoResponseDTO>> buscarPorTurma(@PathVariable Long id) {
        List<NotificacaoResponseDTO> lista = notificacaoService.buscarPorTurma(id);
        return ResponseEntity.ok(lista);
    }
    
    @GetMapping("/professor/{id}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarPorProfessor(@PathVariable Long id) {
        List<NotificacaoResponseDTO> notificacoes = notificacaoService.buscarPorProfessor(id);
        return ResponseEntity.ok(notificacoes);
    }


}

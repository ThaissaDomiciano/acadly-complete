package com.acadly.gestao_tarefas.controller;

import com.acadly.gestao_tarefas.dto.NotaDTO;
import com.acadly.gestao_tarefas.dto.StatusAtividadeDTO;
import com.acadly.gestao_tarefas.model.EntregaTarefa;
import com.acadly.gestao_tarefas.service.EntregaTarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
@RestController
@RequestMapping("/entregas")
public class EntregaTarefaController {

    @Autowired
    private EntregaTarefaService entregaService;

    @PostMapping
    public EntregaTarefa entregar(@RequestBody EntregaTarefa entrega) {
        entrega.setDataEnvio(LocalDateTime.now());
        entrega.setEntregue(true);
        return entregaService.salvar(entrega);
    }

    @PutMapping("/avaliar/{id}")
    public ResponseEntity<EntregaTarefa> avaliar(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Double nota = Double.parseDouble(body.get("nota").toString());

            Optional<EntregaTarefa> entregaOpt = entregaService.buscarPorId(id);
            if (entregaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            EntregaTarefa entrega = entregaOpt.get();
            entrega.setNotaRecebida(nota);
            EntregaTarefa atualizada = entregaService.salvar(entrega);
            return ResponseEntity.ok(atualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/aluno/{alunoId}")
    public List<EntregaTarefa> listarPorAluno(@PathVariable Long alunoId) {
        return entregaService.listarPorAluno(alunoId);
    }

    @GetMapping("/tarefa/{tarefaId}")
    public List<EntregaTarefa> listarPorTarefa(@PathVariable Long tarefaId) {
        return entregaService.listarPorTarefa(tarefaId);
    }
  
    @GetMapping("/notas/aluno/{id}")
    public List<NotaDTO> listarNotasPorAluno(@PathVariable Long id) {
        List<EntregaTarefa> entregas = entregaService.listarPorAluno(id);

        return entregas.stream()
            .filter(e -> e.getNotaRecebida() != null)
            .map(e -> new NotaDTO(
                e.getTarefa().getTitulo(), 
                e.getNotaRecebida()
            ))
            .toList();
    }
    
    @GetMapping("/notas/aluno/{alunoId}/turma/{turmaId}")
    public List<NotaDTO> listarNotasPorAlunoETurma(
        @PathVariable Long alunoId,
        @PathVariable Long turmaId
    ) {
        List<EntregaTarefa> entregas = entregaService.listarPorAluno(alunoId);

        return entregas.stream()
            .filter(e -> e.getNotaRecebida() != null)
            .filter(e -> e.getTarefa().getTurma().getId().equals(turmaId))
            .map(e -> new NotaDTO(
                e.getTarefa().getTitulo(),
                e.getNotaRecebida()
            ))
            .toList();
    }
    
    @GetMapping("/status/aluno/{alunoId}/turma/{turmaId}")
    public List<StatusAtividadeDTO> listarStatusAtividadesPorAlunoETurma(
        @PathVariable Long alunoId,
        @PathVariable Long turmaId
    ) {
        return entregaService.listarStatusAtividades(alunoId, turmaId);
    }


}




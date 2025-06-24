package com.acadly.gestao_tarefas.controller;

import com.acadly.gestao_tarefas.model.Tarefa;
import com.acadly.gestao_tarefas.service.TarefaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // <--- IMPORTANTE
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa) {
        return tarefaService.salvar(tarefa);
    }

    @GetMapping("/turma/{turmaId}")
    public List<Tarefa> listarPorTurma(@PathVariable Long turmaId) {
        return tarefaService.listarPorTurma(turmaId);
    }

    @GetMapping("/{id}")
    public Optional<Tarefa> buscarPorId(@PathVariable Long id) {
        return tarefaService.buscarPorId(id);
    }

    @GetMapping
    public List<Tarefa> listarTodas() {
        return tarefaService.listarTodas();
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @RequestBody Tarefa tarefaAtualizada) {
        Optional<Tarefa> tarefaOptional = tarefaService.buscarPorId(id);
        if (tarefaOptional.isPresent()) {
            Tarefa tarefa = tarefaService.atualizar(id, tarefaAtualizada);
            return ResponseEntity.ok(tarefa);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Tarefa> tarefaOptional = tarefaService.buscarPorId(id);
        if (tarefaOptional.isPresent()) {
            tarefaService.deletar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

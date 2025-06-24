package com.acadly.gestao_tarefas.controller;

import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.service.TurmaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/turmas")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @PostMapping
    public Turma criar(@RequestBody Turma turma) {
        return turmaService.salvar(turma);
    }

    @GetMapping("/professor/{professorId}")
    public List<Turma> listarPorProfessor(@PathVariable Long professorId) {
        return turmaService.listarPorProfessor(professorId);
    }

    @GetMapping("/{id}")
    public Optional<Turma> buscarPorId(@PathVariable Long id) {
        return turmaService.buscarPorId(id);
    }

    @GetMapping
    public List<Turma> listarTodas() {
        return turmaService.listarTodas();
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Turma> atualizar(@PathVariable Long id, @RequestBody Turma turmaAtualizada) {
        Optional<Turma> turmaOptional = turmaService.buscarPorId(id);
        if (turmaOptional.isPresent()) {
            Turma turma = turmaService.atualizar(id, turmaAtualizada);
            return ResponseEntity.ok(turma);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Optional<Turma> turmaOptional = turmaService.buscarPorId(id);
        if (turmaOptional.isPresent()) {
            turmaService.deletar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

package com.acadly.gestao_tarefas.controller;

import com.acadly.gestao_tarefas.model.AlunoTurma;
import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.service.AlunoTurmaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // <--- NOVO IMPORT!
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/aluno-turma")
public class AlunoTurmaController {

    @Autowired
    private AlunoTurmaService alunoTurmaService;

    @PostMapping
    public AlunoTurma adicionarAluno(@RequestBody AlunoTurma alunoTurma) {
        return alunoTurmaService.salvar(alunoTurma);
    }

    @GetMapping("/aluno/{alunoId}")
    public List<AlunoTurma> listarPorAluno(@PathVariable Long alunoId) {
        return alunoTurmaService.listarPorAluno(alunoId);
    }

    @GetMapping("/turma/{turmaId}")
    public List<AlunoTurma> listarPorTurma(@PathVariable Long turmaId) {
        return alunoTurmaService.listarPorTurma(turmaId);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirVinculo(@PathVariable Long id) {
        Optional<AlunoTurma> vinculo = alunoTurmaService.buscarPorId(id);
        if (vinculo.isPresent()) {
            alunoTurmaService.deletar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<AlunoTurma> editarVinculo(@PathVariable Long id, @RequestBody AlunoTurma atualizado) {
        Optional<AlunoTurma> vinculo = alunoTurmaService.buscarPorId(id);
        if (vinculo.isPresent()) {
            AlunoTurma atualizadoVinculo = alunoTurmaService.atualizar(id, atualizado);
            return ResponseEntity.ok(atualizadoVinculo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/turmas/{alunoId}")
    public ResponseEntity<List<Turma>> buscarTurmasDoAluno(@PathVariable Long alunoId) {
        List<Turma> turmas = alunoTurmaService.listarTurmasDoAluno(alunoId);
        return ResponseEntity.ok(turmas);
    }
}

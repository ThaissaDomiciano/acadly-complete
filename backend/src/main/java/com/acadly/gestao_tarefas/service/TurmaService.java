package com.acadly.gestao_tarefas.service;

import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private UsuarioService usuarioService;

    public Turma salvar(Turma turma) {
        
        Usuario professorCompleto = usuarioService.buscarPorId(turma.getProfessor().getId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        turma.setProfessor(professorCompleto);
        return turmaRepository.save(turma);
    }

    public List<Turma> listarPorProfessor(Long professorId) {
        return turmaRepository.findByProfessorId(professorId);
    }

    public Optional<Turma> buscarPorId(Long id) {
        return turmaRepository.findById(id);
    }

    public List<Turma> listarTodas() {
        return turmaRepository.findAll();
    }

    
    public Turma atualizar(Long id, Turma turmaAtualizada) {
        Turma turmaExistente = turmaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        turmaExistente.setNomeMateria(turmaAtualizada.getNomeMateria());

        
        if (turmaAtualizada.getProfessor() != null) {
            Usuario professor = usuarioService.buscarPorId(turmaAtualizada.getProfessor().getId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            turmaExistente.setProfessor(professor);
        }

        return turmaRepository.save(turmaExistente);
    }

    
    public void deletar(Long id) {
        turmaRepository.deleteById(id);
    }
    
    
}

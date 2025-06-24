package com.acadly.gestao_tarefas.service;

import com.acadly.gestao_tarefas.model.AlunoTurma;
import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.AlunoTurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoTurmaService {

    @Autowired
    private AlunoTurmaRepository alunoTurmaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TurmaService turmaService;

    public AlunoTurma salvar(AlunoTurma alunoTurma) {
        Usuario alunoCompleto = usuarioService.buscarPorId(alunoTurma.getAluno().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Turma turmaCompleta = turmaService.buscarPorId(alunoTurma.getTurma().getId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        alunoTurma.setAluno(alunoCompleto);
        alunoTurma.setTurma(turmaCompleta);

        return alunoTurmaRepository.save(alunoTurma);
    }

    public List<AlunoTurma> listarPorAluno(Long alunoId) {
        return alunoTurmaRepository.findByAlunoId(alunoId);
    }

    public List<AlunoTurma> listarPorTurma(Long turmaId) {
        return alunoTurmaRepository.findByTurmaId(turmaId);
    }

    public Optional<AlunoTurma> buscarPorId(Long id) {
        return alunoTurmaRepository.findById(id);
    }

    public void deletar(Long id) {
        alunoTurmaRepository.deleteById(id);
    }

    public AlunoTurma atualizar(Long id, AlunoTurma atualizado) {
        AlunoTurma existente = alunoTurmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vínculo não encontrado"));

        if (atualizado.getAluno() != null) {
            Usuario alunoCompleto = usuarioService.buscarPorId(atualizado.getAluno().getId())
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
            existente.setAluno(alunoCompleto);
        }

        if (atualizado.getTurma() != null) {
            Turma turmaCompleta = turmaService.buscarPorId(atualizado.getTurma().getId())
                    .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
            existente.setTurma(turmaCompleta);
        }

        return alunoTurmaRepository.save(existente);
    }

    public List<Turma> listarTurmasDoAluno(Long alunoId) {
        return alunoTurmaRepository.buscarTurmasPorAlunoId(alunoId);
    }
}

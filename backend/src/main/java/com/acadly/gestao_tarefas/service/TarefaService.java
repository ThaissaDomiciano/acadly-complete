package com.acadly.gestao_tarefas.service;

import com.acadly.gestao_tarefas.model.Tarefa;
import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private TurmaService turmaService;

    // Salvar tarefa
    public Tarefa salvar(Tarefa tarefa) {
        Turma turmaCompleta = turmaService.buscarPorId(tarefa.getTurma().getId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        tarefa.setTurma(turmaCompleta);
        return tarefaRepository.save(tarefa);
    }

    // Listar tarefas por turma
    public List<Tarefa> listarPorTurma(Long turmaId) {
        return tarefaRepository.findByTurmaId(turmaId);
    }

    // Buscar tarefa por ID
    public Optional<Tarefa> buscarPorId(Long id) {
        return tarefaRepository.findById(id);
    }

    // Listar todas as tarefas
    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    // Atualizar tarefa
    public Tarefa atualizar(Long id, Tarefa tarefaAtualizada) {
        Tarefa tarefaExistente = tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        tarefaExistente.setTitulo(tarefaAtualizada.getTitulo());
        tarefaExistente.setDescricao(tarefaAtualizada.getDescricao());
        tarefaExistente.setDataEntrega(tarefaAtualizada.getDataEntrega());
        tarefaExistente.setNotaMaxima(tarefaAtualizada.getNotaMaxima());
        tarefaExistente.setLinkPdf(tarefaAtualizada.getLinkPdf());
        if (tarefaAtualizada.getTurma() != null) {
            Turma turmaCompleta = turmaService.buscarPorId(tarefaAtualizada.getTurma().getId())
                    .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
            tarefaExistente.setTurma(turmaCompleta);
        }
        return tarefaRepository.save(tarefaExistente);
    }

    // Deletar tarefa
    public void deletar(Long id) {
        tarefaRepository.deleteById(id);
    }
}

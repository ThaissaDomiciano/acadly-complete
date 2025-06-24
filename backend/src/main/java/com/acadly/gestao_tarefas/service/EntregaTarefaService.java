package com.acadly.gestao_tarefas.service;

import com.acadly.gestao_tarefas.dto.StatusAtividadeDTO;
import com.acadly.gestao_tarefas.model.EntregaTarefa;
import com.acadly.gestao_tarefas.model.Tarefa;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.EntregaTarefaRepository;
import com.acadly.gestao_tarefas.repository.TarefaRepository;
import com.acadly.gestao_tarefas.service.TarefaService;
import com.acadly.gestao_tarefas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EntregaTarefaService {

    @Autowired
    private EntregaTarefaRepository entregaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TarefaService tarefaService;
    
    @Autowired
    private TarefaRepository tarefaRepository;

    public EntregaTarefa salvar(EntregaTarefa entrega) {
        Usuario alunoCompleto = usuarioService.buscarPorId(entrega.getAluno().getId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Tarefa tarefaCompleta = tarefaService.buscarPorId(entrega.getTarefa().getId())
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        entrega.setAluno(alunoCompleto);
        entrega.setTarefa(tarefaCompleta);
        entrega.setEntregue(true);
        entrega.setDataEnvio(LocalDateTime.now());

        EntregaTarefa salva = entregaRepository.save(entrega);

        
        return entregaRepository.findById(salva.getId())
                .orElseThrow(() -> new RuntimeException("Erro ao buscar entrega salva"));
    }

    public List<EntregaTarefa> listarPorAluno(Long alunoId) {
        return entregaRepository.findByAlunoId(alunoId);
    }

    public List<EntregaTarefa> listarPorTarefa(Long tarefaId) {
        return entregaRepository.findByTarefaId(tarefaId);
    }

    public Optional<EntregaTarefa> buscarPorAlunoETarefa(Long alunoId, Long tarefaId) {
        return entregaRepository.findByAlunoIdAndTarefaId(alunoId, tarefaId);
    }

    public Optional<EntregaTarefa> buscarPorId(Long id) {
        return entregaRepository.findById(id);
    }
    
    public List<StatusAtividadeDTO> listarStatusAtividades(Long alunoId, Long turmaId) {
        List<Tarefa> tarefasDaTurma = tarefaRepository.findByTurmaId(turmaId);
        List<EntregaTarefa> entregasDoAluno = entregaRepository.findByAlunoId(alunoId);

        return tarefasDaTurma.stream().map(tarefa -> {
            boolean foiEntregue = entregasDoAluno.stream()
                .anyMatch(e -> e.getTarefa().getId().equals(tarefa.getId()) && e.isEntregue());

            return new StatusAtividadeDTO(
                tarefa.getTitulo(),
                foiEntregue ? "Entregue" : "Pendente"
            );
        }).toList();
    }
    
    
}

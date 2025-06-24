package com.acadly.gestao_tarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acadly.gestao_tarefas.model.EntregaTarefa;

import java.util.List;
import java.util.Optional;

public interface EntregaTarefaRepository extends JpaRepository<EntregaTarefa, Long> {
    List<EntregaTarefa> findByAlunoId(Long alunoId);
    List<EntregaTarefa> findByTarefaId(Long tarefaId);
    Optional<EntregaTarefa> findByAlunoIdAndTarefaId(Long alunoId, Long tarefaId);
}

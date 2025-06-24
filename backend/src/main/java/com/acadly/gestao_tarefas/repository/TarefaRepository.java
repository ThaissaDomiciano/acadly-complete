package com.acadly.gestao_tarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acadly.gestao_tarefas.model.Tarefa;

import java.util.List;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    List<Tarefa> findByTurmaId(Long turmaId);
}

package com.acadly.gestao_tarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acadly.gestao_tarefas.model.Turma;

import java.util.List;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByProfessorId(Long professorId);
    
}

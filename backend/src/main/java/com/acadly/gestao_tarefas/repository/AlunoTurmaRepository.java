package com.acadly.gestao_tarefas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.acadly.gestao_tarefas.model.AlunoTurma;
import com.acadly.gestao_tarefas.model.Turma;

public interface AlunoTurmaRepository extends JpaRepository<AlunoTurma, Long> {

    List<AlunoTurma> findByAlunoId(Long alunoId);

    List<AlunoTurma> findByTurmaId(Long turmaId);

    @Query("SELECT at.turma FROM AlunoTurma at WHERE at.aluno.id = :alunoId")
    List<Turma> buscarTurmasPorAlunoId(@Param("alunoId") Long alunoId);
}

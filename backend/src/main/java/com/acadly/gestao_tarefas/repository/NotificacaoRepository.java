package com.acadly.gestao_tarefas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.acadly.gestao_tarefas.model.Notificacao;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    @Query("SELECT n FROM Notificacao n WHERE n.turma.id IN :idsTurmas ORDER BY n.dataEnvio DESC")
    List<Notificacao> findByTurmas(List<Long> idsTurmas);

    @Query("SELECT n FROM Notificacao n WHERE n.turma.id = :turmaId ORDER BY n.dataEnvio DESC")
    List<Notificacao> findByTurmaId(Long turmaId);

    List<Notificacao> findByProfessorIdOrderByDataEnvioDesc(Long professorId);

}

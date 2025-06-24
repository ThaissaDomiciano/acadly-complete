package com.acadly.gestao_tarefas.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.acadly.gestao_tarefas.dto.NotificacaoRequestDTO;
import com.acadly.gestao_tarefas.dto.NotificacaoResponseDTO;
import com.acadly.gestao_tarefas.model.Notificacao;
import com.acadly.gestao_tarefas.model.Turma;
import com.acadly.gestao_tarefas.model.Usuario;
import com.acadly.gestao_tarefas.repository.AlunoTurmaRepository;
import com.acadly.gestao_tarefas.repository.NotificacaoRepository;
import com.acadly.gestao_tarefas.repository.TurmaRepository;
import com.acadly.gestao_tarefas.repository.UsuarioRepository;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TurmaRepository turmaRepository;
    
    @Autowired
    private AlunoTurmaRepository alunoTurmaRepository;

    public void enviar(NotificacaoRequestDTO dto) {
        Usuario professor = usuarioRepository.findById(dto.getIdProfessor())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (professor.getTipo() != Usuario.TipoUsuario.PROFESSOR) {
            throw new RuntimeException("Usuário informado não é um professor.");
        }

        Turma turma = turmaRepository.findById(dto.getIdTurma())
            .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        Notificacao notificacao = new Notificacao();
        notificacao.setTitulo(dto.getTitulo());
        notificacao.setMensagem(dto.getMensagem());
        notificacao.setDataEnvio(LocalDateTime.now());
        notificacao.setProfessor(professor);
        notificacao.setTurma(turma);

        notificacaoRepository.save(notificacao);
    }



    public List<NotificacaoResponseDTO> buscarPorAluno(Usuario aluno) {
        List<Long> idsTurmas = alunoTurmaRepository.findByAlunoId(aluno.getId())
            .stream()
            .map(at -> at.getTurma().getId())
            .toList();

        List<Notificacao> notificacoes = notificacaoRepository.findByTurmas(idsTurmas);
        return notificacoes.stream()
                .map(NotificacaoResponseDTO::new)
                .toList();
    }
    
    public List<NotificacaoResponseDTO> buscarPorTurma(Long turmaId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByTurmaId(turmaId);
        return notificacoes.stream()
                .map(NotificacaoResponseDTO::new)
                .toList();
    }
    
    public List<NotificacaoResponseDTO> buscarPorProfessor(Long idProfessor) {
        List<Notificacao> notificacoes = notificacaoRepository.findByProfessorIdOrderByDataEnvioDesc(idProfessor);
        return notificacoes.stream().map(NotificacaoResponseDTO::new).toList();
    }


}

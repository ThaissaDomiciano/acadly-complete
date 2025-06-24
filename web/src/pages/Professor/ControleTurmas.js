import './ControleTurmas.css';
import Header from '../../components/Header';
import BotaoSair from '../../components/BotaoSair';
import { useEffect, useState, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const ControleTurmas = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [turmas, setTurmas] = useState([]);
  const [turmasVisiveis, setTurmasVisiveis] = useState({});

  const buscarTurmas = useCallback(async () => {
    if (!usuario?.id) return;

    try {
      const res = await axios.get(`http://localhost:8080/turmas/professor/${usuario.id}`);

      const turmasRecebidas = await Promise.all(
        res.data.map(async (t) => {
          try {
            const alunosRes = await axios.get(`http://localhost:8080/aluno-turma/turma/${t.id}`);
            return { ...t, alunos: alunosRes.data };
          } catch (e) {
            console.warn(`Erro ao buscar alunos da turma ${t.id}:`, e);
            return { ...t, alunos: [] };
          }
        })
      );

      setTurmas(turmasRecebidas);

      setTurmasVisiveis((prev) => {
        const novoEstado = { ...prev };
        turmasRecebidas.forEach((t) => {
          if (!(t.id in novoEstado)) {
            novoEstado[t.id] = false;
          }
        });
        return novoEstado;
      });
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
    }
  }, [usuario]);

  useEffect(() => {
    buscarTurmas();
  }, [buscarTurmas]);

  const toggleTurma = (idTurma) => {
    setTurmasVisiveis((prev) => ({
      ...prev,
      [idTurma]: !prev[idTurma],
    }));
  };

  const adicionarAluno = async (turmaIndex) => {
    const email = prompt("E-mail do aluno:");
    if (!email) return;

    try {
      const response = await axios.get('http://localhost:8080/usuarios');
      const usuarios = response.data;
      const aluno = usuarios.find(u => u.email === email && u.tipo === 'ALUNO');

      if (!aluno) {
        toast.warning('Aluno não encontrado com esse e-mail.');
        return;
      }

      const turma = turmas[turmaIndex];

      await axios.post('http://localhost:8080/aluno-turma', {
        aluno: { id: aluno.id },
        turma: { id: turma.id }
      });

      await buscarTurmas();
      toast.success(`Aluno ${aluno.nome} adicionado com sucesso!`);
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      toast.error('Erro ao adicionar aluno.');
    }
  };

 const excluirAluno = async (turmaIndex, alunoId) => {
  const confirmar = window.confirm("Deseja remover este aluno da turma?");
  if (!confirmar) return;

  try {
    const turma = turmas[turmaIndex];
    const relacao = turma.alunos.find(rel => rel.aluno.id === alunoId);

    if (!relacao || !relacao.id) {
      toast.warning('Vínculo do aluno com a turma não encontrado.');
      return;
    }

    await axios.delete(`http://localhost:8080/aluno-turma/${relacao.id}`);

    await buscarTurmas(); 
    toast.success('Aluno removido da turma com sucesso.');
  } catch (error) {
    console.error('Erro ao remover aluno:', error);
    toast.error('Erro ao remover aluno da turma.');
  }
};

  const linksProfessor = [
    { to: '/homeProfessor', label: 'INÍCIO' },
    { to: '/controle-turmas', label: 'TURMAS' },
    { to: '/cadastro-atividade', label: 'CADASTRO' },
  ];

  if (!usuario) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Você precisa estar logado para acessar esta página.</p>;
  }

  return (
    <div className="container-atividades-professor">
      <Header links={linksProfessor} />
      <div className="atividades-turmas-header">
        <h2>CONTROLE DE TURMAS</h2>
        <BotaoSair tipo="professor" />
      </div>

      {turmas.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Nenhuma turma encontrada.</p>
      )}

      {turmas.map((turma, index) => (
        <div key={turma.id} className="turma-container">
          <div className="turma-header">
            <strong>{turma.nomeMateria}</strong>
            <button
              className="btn-toggle"
              onClick={() => toggleTurma(turma.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--cor-primaria)'
              }}
            >
              {turmasVisiveis[turma.id] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {turmasVisiveis[turma.id] && (
            <div className="turma-conteudo">
              <div className="tabela-alunos">
                <div className="linha-cabecalho">
                  <span>NOME</span>
                  <span>E-MAIL</span>
                  <span>AÇÕES</span>
                </div>

                <div className="lista-alunos">
                  {turma.alunos?.length === 0 && (
                    <div style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic' }}>
                      Nenhum aluno nesta turma ainda.
                    </div>
                  )}

                  {turma.alunos?.map((relacao, i) => (
                    <div className="linha-aluno" key={relacao.aluno.id || i}>
                      <span>{relacao.aluno.nome}</span>
                      <span>{relacao.aluno.email}</span>
                      <span className="acoes">
                        <button className="btn-excluir" onClick={() => excluirAluno(index, relacao.aluno.id)}>
                          <FaTrash />
                        </button>
                      </span>
                    </div>
                  ))}

                  <div
                    className="linha-adicionar"
                    onClick={() => adicionarAluno(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>ADICIONAR ALUNO</span>
                    <span className="mais">+</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ControleTurmas;

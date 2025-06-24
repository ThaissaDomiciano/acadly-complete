import './Analise.css';
import Header from '../../components/Header';
import BotaoSair from '../../components/BotaoSair';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEye, FaEdit, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Analise = () => {
  const location = useLocation();
  const turma = location.state?.turma;

  const [atividades, setAtividades] = useState([]);
  const [visiveis, setVisiveis] = useState([]);
  const [notasTemp, setNotasTemp] = useState({});
  const [editandoNota, setEditandoNota] = useState({});

  useEffect(() => {
    const buscarAtividades = async () => {
      if (!turma?.id) return;

      try {
        const response = await axios.get(`http://localhost:8080/tarefas/turma/${turma.id}`);
        const atividadesComAlunos = await Promise.all(response.data.map(async (atividade) => {
          const entregaResp = await axios.get(`http://localhost:8080/entregas/tarefa/${atividade.id}`);
          
          const alunos = entregaResp.data.map((entrega) => ({
            nome: entrega.aluno.nome,
            status: entrega.linkEntrega ? 'ENTREGUE' : 'PENDENTE',
            nota: entrega.notaRecebida,
            pdfUrl: entrega.linkEntrega,
            entregaId: entrega.id
          }));

          return {
            nome: atividade.titulo,
            data: `De ${atividade.dataEntrega} a ${atividade.dataEntrega}`, 
            alunos
          };
        }));

        setAtividades(atividadesComAlunos);
        setVisiveis(atividadesComAlunos.map(() => false));
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      }
    };

    buscarAtividades();
  }, [turma]);

  const toggleAtividade = (index) => {
    const novas = [...visiveis];
    novas[index] = !novas[index];
    setVisiveis(novas);
  };

  const handleNotaChange = (atividadeIndex, alunoIndex, novaNota) => {
    const key = `${atividadeIndex}-${alunoIndex}`;
    setNotasTemp({ ...notasTemp, [key]: novaNota });
  };

  const editarNota = (atividadeIndex, alunoIndex) => {
    const key = `${atividadeIndex}-${alunoIndex}`;
    setEditandoNota({ ...editandoNota, [key]: true });
    const notaAtual = atividades[atividadeIndex].alunos[alunoIndex].nota;
    setNotasTemp({ ...notasTemp, [key]: notaAtual });
  };

  const salvarNota = async (atividadeIndex, alunoIndex) => {
    const key = `${atividadeIndex}-${alunoIndex}`;
    const novaNota = notasTemp[key];
    const entregaId = atividades[atividadeIndex].alunos[alunoIndex].entregaId;

    try {
      await axios.put(`http://localhost:8080/entregas/avaliar/${entregaId}`, { nota: novaNota });

      const novasAtividades = [...atividades];
      novasAtividades[atividadeIndex].alunos[alunoIndex].nota = novaNota;
      setAtividades(novasAtividades);

      const novasNotasTemp = { ...notasTemp };
      delete novasNotasTemp[key];
      setNotasTemp(novasNotasTemp);

      const novosEditando = { ...editandoNota };
      delete novosEditando[key];
      setEditandoNota(novosEditando);
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      alert('Erro ao salvar nota');
    }
  };

  const visualizarPdf = (url) => {
    if (!url) {
      alert("Nenhum PDF enviado.");
      return;
    }
    window.open(url, '_blank');
  };

  const linksProfessor = [
    { to: '/homeProfessor', label: 'INÍCIO' },
    { to: '/controle-turmas', label: 'TURMAS' },
    { to: '/cadastro-atividade', label: 'CADASTRO' },
  ];

  return (
    <div className="container-atividades-professor">
      <Header links={linksProfessor} />

      <div className="atividades-turmas-header">
        <h2>{turma?.nomeMateria?.toUpperCase() || 'ANÁLISE DE ATIVIDADES'}</h2>
        <BotaoSair tipo="professor" />
      </div>

      <div className="atividade-turma">
        {atividades.length === 0 && (
          <p style={{ marginTop: '20px' }}>Nenhuma atividade cadastrada para esta turma.</p>
        )}

        {atividades.map((atividade, index) => (
          <div className="atividade-box" key={index}>
            <div className="atividade-header" onClick={() => toggleAtividade(index)}>
              <div>
                <strong>{atividade.nome}</strong>
                <p>{atividade.data}</p>
              </div>
              {visiveis[index] ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {visiveis[index] && (
              <div className="atividade-conteudo">
                {atividade.alunos.map((aluno, alunoIndex) => {
                  const key = `${index}-${alunoIndex}`;
                  const estaEditando = editandoNota[key] || false;
                  const notaAtual = estaEditando ? notasTemp[key] : aluno.nota ?? '';

                  return (
                    <div key={alunoIndex} className="linha-aluno">
                      <span>{aluno.nome}</span>
                      <span className={`status ${aluno.status.toLowerCase()}`}>{aluno.status}</span>

                      {aluno.status === 'ENTREGUE' && (
                        <button className="btn-visualizar" onClick={() => visualizarPdf(aluno.pdfUrl)}>
                          <FaEye />
                        </button>
                      )}

                      <input
                        className="campo-nota"
                        type="number"
                        placeholder="Nota"
                        value={notaAtual}
                        onChange={(e) => handleNotaChange(index, alunoIndex, e.target.value)}
                        min="0"
                        max="10"
                        disabled={!estaEditando}
                      />

                      <span className="icones-acoes">
                        {!estaEditando ? (
                          <button onClick={() => editarNota(index, alunoIndex)} title="Editar Nota">
                            <FaEdit />
                          </button>
                        ) : (
                          <button onClick={() => salvarNota(index, alunoIndex)} title="Salvar Nota">
                            <FaCheck />
                          </button>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analise;

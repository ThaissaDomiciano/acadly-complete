import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import './HomeProfessor.css';
import Header from '../../components/Header';
import Banner from '../../assets/banner-professor.svg';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';

const HomeProfessor = ({ usuario, onLogout, onVincular }) => {
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState('');

  const linksProfessor = [
    { to: '/homeProfessor', label: 'INÍCIO' },
    { to: '/controle-turmas', label: 'TURMAS' },
    { to: '/cadastro-atividade', label: 'CADASTRO' },
  ];

  const buscarTurmas = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/turmas/professor/${usuario.id}`);
      const turmasFormatadas = res.data.map(turma => ({
        titulo: turma.nomeMateria,
        professor: usuario.nome,
        turmaOriginal: turma,
      }));
      setTurmas(turmasFormatadas);
    } catch (err) {
      console.error("Erro ao buscar turmas do professor:", err);
    }
  }, [usuario]);

  const criarTurma = async () => {
    if (!novaTurma.trim()) return;

    try {
      await axios.post('http://localhost:8080/turmas', {
        nomeMateria: novaTurma,
        professor: { id: usuario.id }
      });
      setNovaTurma('');
      buscarTurmas();
    } catch (error) {
      console.error('Erro ao criar turma:', error);
    }
  };

  const editarTurma = async (id, novoNome) => {
    try {
      await axios.put(`http://localhost:8080/turmas/${id}`, {
        nomeMateria: novoNome,
        professor: { id: usuario.id }
      });
      buscarTurmas();
    } catch (error) {
      console.error("Erro ao editar turma:", error);
    }
  };

  const excluirTurma = async (id) => {
    console.log('Excluir turma chamada com id:', id);
    if (!window.confirm("Tem certeza que deseja excluir essa turma?")) return;
    try {
      await axios.delete(`http://localhost:8080/turmas/${id}`);
      console.log('Turma excluída com sucesso');
      buscarTurmas();
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  };

  useEffect(() => {
    buscarTurmas();
  }, [buscarTurmas]);

  const navigate = useNavigate();

  return (
    <div className="container-professor">
      <Header
        links={linksProfessor}
        nomeUsuario={usuario.nome}
        onLogout={onLogout}
        onVincular={onVincular}
      />
      <img src={Banner} alt="Banner" className="banner" />
      <h3 className="titulo-professor">CRIAR NOVA TURMA</h3>
      <div className="criar-turma-box">
        <div className="criar-turma-form">
          <label htmlFor="nomeTurma" className="label-turma">NOME DA TURMA:</label>
          <input
            id="nomeTurma"
            type="text"
            placeholder="INFORME O NOME DA NOVA TURMA"
            className="input-criar-turma"
            value={novaTurma}
            onChange={(e) => setNovaTurma(e.target.value)}
          />
          <button className="btn-criar-turma" onClick={criarTurma}>
            CRIAR
          </button>
        </div>
      </div>

      <h2 className="titulo-professor">TURMAS CRIADAS</h2>
      <div className="botao-notificacao">
    <button
      onClick={() => navigate('/notificacoes')}
      className="btn-chat-notificacao"
      title="Notificações"
    >
      <MdEmail size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
      <span className="btn-chat-label">ENVIAR NOTIFICAÇÃO</span>
    </button>


    </div>
      <div className="turmas-container">
        {turmas.map((turma, index) => (
          <Card
            key={index}
            titulo={turma.titulo}
            professor={turma.professor}
            isProfessor={true}
            onEditar={(novoNome) => editarTurma(turma.turmaOriginal.id, novoNome)}
            onExcluir={() => excluirTurma(turma.turmaOriginal.id)}
            botoes={[
              {
                label: 'ANÁLISE',
                className: 'botao-sala',
                onClick: () => navigate('/analise', { state: { turma: turma.turmaOriginal } }),
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeProfessor;

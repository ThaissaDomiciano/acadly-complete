import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import AtividadeFormBase from '../../components/AtividadeFormBase';
import BotaoSair from '../../components/BotaoSair';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CadastroAtividade = () => {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");

  useEffect(() => {
    const buscarTurmas = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const idProfessor = usuario?.id; // ou `usuario.professor.id` se estiver aninhado

        if (!idProfessor) {
          toast.error("Professor não identificado.");
          return;
        }

        const response = await axios.get(`http://localhost:8080/turmas/professor/${idProfessor}`);
        setTurmas(response.data);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        toast.error('Erro ao buscar turmas do professor');
      }
    };

    buscarTurmas();
  }, []);

  const handleEnviar = async (formData) => {
    try {
      const novaAtividade = {
        titulo: formData.atividadeDescricao,
        descricao: formData.descricao,
        dataEntrega: formData.dataEntrega,
        notaMaxima: parseFloat(formData.notaMaxima),
        linkPdf: formData.documento,
        turma: { id: parseInt(formData.turma) }
      };

      await axios.post('http://localhost:8080/tarefas', novaAtividade);
      toast.success('Atividade cadastrada com sucesso!');
      navigate('/analise');
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error);
      toast.error('Erro ao cadastrar atividade');
    }
  };

  const linksProfessor = [
    { to: '/homeProfessor', label: 'INÍCIO' },
    { to: '/controle-turmas', label: 'TURMAS' },
    { to: '/cadastro-atividade', label: 'CADASTRO' },
  ];

  return (
    <div className='container-atividades-professor'>
      <Header links={linksProfessor} />
      <div className="atividades-turmas-header">
        <h2>CADASTRO DE ATIVIDADE</h2>
        <BotaoSair tipo="professor" />
      </div>

      {turmas.length > 0 ? (
        <AtividadeFormBase
          modoEdicao={true}
          turma={turmaSelecionada}
          notaMaxima=""
          dataEntrega=""
          descricao=""
          documento=""
          atividadeDescricao=""
          onEnviar={handleEnviar}
          turmas={turmas}
          setTurmaSelecionada={setTurmaSelecionada}
        />
      ) : (
        <p>Carregando turmas...</p>
      )}
    </div>
  );
};

export default CadastroAtividade;

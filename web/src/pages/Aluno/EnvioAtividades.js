import Header from '../../components/Header';
import AtividadeFormBase from '../../components/AtividadeFormBase';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BotaoSair from '../../components/BotaoSair';
import axios from 'axios';

const EnvioAtividades = () => {
  const [pdfAluno, setPdfAluno] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { atividade, turma, usuario } = location.state || {};

  const handleEnviar = async () => {
    try {
      const linkEntrega = `https://meusite.com/uploads/${pdfAluno.name}`;

      await axios.post('http://localhost:8080/entregas', {
        aluno: { id: usuario.id },
        tarefa: { id: atividade.id },
        linkEntrega
      });

      alert('Entrega enviada com sucesso!');
      navigate('/atividades', { state: { turma, usuario } });
    } catch (error) {
      console.error('Erro ao enviar entrega:', error);
      alert('Erro ao enviar entrega');
    }
  };

  const handleAnexarPDF = (e) => {
    setPdfAluno(e.target.files[0]);
  };

  const linksAluno = [
    { to: '/aluno', label: 'INÍCIO' },
    { to: '/aluno/turmas', label: 'TURMAS' },
    { to: '/aluno/resultado', label: 'RESULTADO' },
  ];

  return (
    <div className="container-atividades-aluno">
      <Header links={linksAluno} />
      <div className="atividades-turmas-header">
        <h2>{atividade?.titulo || 'ATIVIDADE'}</h2>
        <BotaoSair tipo="aluno" />
      </div>

      <AtividadeFormBase
        modoEdicao={false}
        turma={turma?.nomeMateria}
        notaMaxima={atividade?.notaMaxima}
        dataEntrega={atividade?.dataEntrega}
        descricao={atividade?.descricao}
        documento={atividade?.linkPdf}
        atividadeDescricao={atividade?.descricao}
        onAnexarPDF={handleAnexarPDF}
        pdfAluno={pdfAluno}
        onEnviar={handleEnviar}
      />
    </div>
  );
};

export default EnvioAtividades;

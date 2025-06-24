import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import HomeProfessor from './pages/Professor/HomeProfessor';
import HomeAluno from './pages/Aluno/HomeAluno';
import CadastroAtividade from './pages/Professor/CadastroAtividade';
import ControleTurmas from './pages/Professor/ControleTurmas';
import NotificacoesProfessor from './pages/Professor/NotificacoesProfessor';
import Analise from './pages/Professor/Analise';
import Atividades from './pages/Aluno/Atividades';
import NotificacoesAluno from './pages/Aluno/NotificacoesAluno';
import EnvioAtividades from './pages/Aluno/EnvioAtividades';
import Notas from './pages/Aluno/Notas';
import PrivateRoute from './components/PrivateRoute';


function App() {
  const [usuario, setUsuario] = useState(undefined);
  const CLIENT_ID = '768493393603-3uj7mfdf3nfrm4qjbu47mqd4oov0h7o4.apps.googleusercontent.com'; 

  useEffect(() => {
    const userStorage = localStorage.getItem('usuario');
    if (userStorage) {
      try {
        const userParsed = JSON.parse(userStorage);
        if (userParsed?.tipo && userParsed?.id) {
          setUsuario(userParsed);
        } else {
          setUsuario(null);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário do localStorage:", e);
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }, []);

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });
    });
  }, [CLIENT_ID]);

  const handleLogin = (usuario) => {
    setUsuario(usuario);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const onVincular = useCallback(async () => {
  try {
    const auth = gapi.auth2.getAuthInstance();
    await auth.signIn();

    const idUsuario = usuario?.id;
    const tipo = usuario?.tipo;

    let idsTurmas = [];

    if (tipo === 'ALUNO') {
      const res = await axios.get(`http://localhost:8080/aluno-turma/aluno/${idUsuario}`);
      const turma = res.data[0]?.turma;
      if (turma) idsTurmas = [turma.id];
    } else if (tipo === 'PROFESSOR') {
      const res = await axios.get(`http://localhost:8080/turmas/professor/${idUsuario}`);
      idsTurmas = res.data.map((turma) => turma.id);
    }

    if (idsTurmas.length === 0) {
      alert("Nenhuma turma encontrada.");
      return;
    }

    let totalEventos = 0;

    for (const idTurma of idsTurmas) {
      const tarefasRes = await axios.get(`http://localhost:8080/tarefas/turma/${idTurma}`);
      const tarefas = tarefasRes.data;

      const promises = tarefas.map((tarefa) => {
        const dataInicio = new Date(`${tarefa.dataEntrega}T09:00:00-03:00`);
        const dataFim = new Date(dataInicio);
        dataFim.setHours(dataInicio.getHours() + 1);

        const evento = {
          summary: tarefa.titulo,
          description: tarefa.descricao,
          start: {
            dateTime: dataInicio.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: dataFim.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
        };

        return gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: evento,
        });
      });

      const resultados = await Promise.all(promises);
      totalEventos += resultados.length;
    }

    if (totalEventos === 0) {
      alert("Nenhuma tarefa encontrada para vincular.");
    } else {
      alert(`${totalEventos} tarefas vinculadas ao Google Calendar com sucesso!`);
    }

  } catch (err) {
    console.error('Erro ao vincular tarefas:', err);
    alert('Erro ao vincular tarefas. Veja o console.');
  }
}, [usuario]);


  if (usuario === undefined) {
    return <div style={{ textAlign: 'center', marginTop: '30vh', fontSize: '1.5rem' }}>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/homeProfessor" element={
          <PrivateRoute user={usuario} allowed={['PROFESSOR']}>
            <HomeProfessor usuario={usuario} onLogout={handleLogout} onVincular={onVincular} />
          </PrivateRoute>
        } />
        <Route path="/cadastro-atividade" element={
          <PrivateRoute user={usuario} allowed={['PROFESSOR']}>
            <CadastroAtividade />
          </PrivateRoute>
        } />
        <Route path="/controle-turmas" element={
          <PrivateRoute user={usuario} allowed={['PROFESSOR']}>
            <ControleTurmas />
          </PrivateRoute>
        } />
        <Route path="/analise" element={
          <PrivateRoute user={usuario} allowed={['PROFESSOR']}>
            <Analise />
          </PrivateRoute>
        } />

        <Route path="/notificacoes" element={
          <PrivateRoute user={usuario} allowed={['PROFESSOR']}>
            <NotificacoesProfessor usuario={usuario} onLogout={handleLogout} />
          </PrivateRoute>
        } />


        <Route path="/homeAluno" element={
          <PrivateRoute user={usuario} allowed={['ALUNO']}>
            <HomeAluno usuario={usuario} onLogout={handleLogout} onVincular={onVincular} />
          </PrivateRoute>
        } />
        <Route path="/atividades" element={
          <PrivateRoute user={usuario} allowed={['ALUNO']}>
            <Atividades />
          </PrivateRoute>
        } />
        <Route path="/envio-atividades" element={
          <PrivateRoute user={usuario} allowed={['ALUNO']}>
            <EnvioAtividades />
          </PrivateRoute>
        } />
        <Route path="/notas" element={
          <PrivateRoute user={usuario} allowed={['ALUNO']}>
            <Notas />
          </PrivateRoute>
        } />
        <Route path="/notificacoes-aluno" element={
          <PrivateRoute user={usuario} allowed={['ALUNO']}>
            <NotificacoesAluno usuario={usuario} onLogout={handleLogout} onVincular={onVincular} />
          </PrivateRoute>
        } />
              </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

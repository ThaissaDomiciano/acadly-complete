import { useEffect, useState } from "react";
import axios from "axios";
import Header from '../../components/Header';
import './NotificacoesProfessor.css';


const NotificacoesProfessor = ({ usuario, onLogout, onVincular }) => {
  const [turmas, setTurmas] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [titulo, setTitulo] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [notificacoesEnviadas, setNotificacoesEnviadas] = useState([]);

  const links = [
    { to: '/homeProfessor', label: 'INÍCIO' },
    { to: '/controle-turmas', label: 'TURMAS' },
    { to: '/cadastro-atividade', label: 'CADASTRO' },
  ];

  useEffect(() => {
    axios.get(`http://localhost:8080/turmas/professor/${usuario.id}`)
      .then(res => {
        setTurmas(res.data);
        if (res.data.length > 0) {
          setTurmaSelecionada(res.data[0].id);
        }
      });

    axios.get(`http://localhost:8080/notificacoes/professor/${usuario.id}`)
      .then(res => setNotificacoesEnviadas(res.data));
  }, [usuario.id]);

  const enviarNotificacao = async () => {
    if (!titulo.trim() || !mensagem.trim()) return;

    await axios.post('http://localhost:8080/notificacoes', {
      titulo,
      mensagem,
      idProfessor: usuario.id,
      idTurma: turmaSelecionada
    });

    setTitulo('');
    setMensagem('');
    const res = await axios.get(`http://localhost:8080/notificacoes/professor/${usuario.id}`);
    setNotificacoesEnviadas(res.data);
  };

  return (
    <div className="container-notificacoes">
      <Header
        links={links}
        nomeUsuario={usuario.nome}
        onLogout={onLogout}
        onVincular={onVincular}
      />

      <h2 className="texto-notificacoes">Enviar Notificação</h2>
      <div className="form-notificacao">
        <select value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)}>
          {turmas.map(t => (
            <option key={t.id} value={t.id}>{t.nomeMateria}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button onClick={enviarNotificacao}>ENVIAR</button>
      </div>

      <h2 className="texto-notificacoes">Notificações Enviadas</h2>
      <ul className="lista-notificacoes">
        {notificacoesEnviadas.map((n, i) => (
          <li key={i}>
            <strong>{n.titulo}</strong><br />
            <small>{n.nomeTurma} - {new Date(n.dataEnvio).toLocaleString()}</small><br />
            <span>{n.mensagem}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificacoesProfessor;

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import './NotificacoesAluno.css';

const NotificacoesAluno = ({ usuario, onLogout, onVincular }) => {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/notificacoes/aluno/${usuario.id}`)
      .then(res => setNotificacoes(res.data))
      .catch(err => console.error("Erro ao buscar notificações:", err));
  }, [usuario.id]);

  const links = [
    { to: '/homeAluno', label: 'INÍCIO' }
  ];

  return (
    <div className="container-notificacoes-aluno">
      <Header
        links={links}
        nomeUsuario={usuario.nome}
        onLogout={onLogout}
        onVincular={onVincular}
      />

      <h2 className="texto-notificacoes">Notificações Recebidas</h2>
      <ul className="lista-notificacoes">
        {notificacoes.length === 0 ? (
          <p>Nenhuma notificação encontrada.</p>
        ) : (
          notificacoes.map((n, i) => (
            <li key={i}>
              <strong>{n.titulo}</strong><br />
              <small>{n.nomeTurma} - {new Date(n.dataEnvio).toLocaleString()}</small><br />
              <span>{n.mensagem}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificacoesAluno;

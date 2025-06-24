import './Notas.css'
import Header from '../../components/Header'
import BotaoSair from '../../components/BotaoSair'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Notas = () => {
  const location = useLocation()
  const usuario = location.state?.usuario

  const linksAluno = [
    { to: '/aluno', label: 'INÍCIO' },
    { to: '/aluno/turmas', label: 'TURMAS' },
    { to: '/aluno/resultado', label: 'RESULTADO' },
  ]

  const [atividades, setAtividades] = useState([])

  useEffect(() => {
    if (!usuario) return

    const carregarNotas = async () => {
      try {
        const resTurmas = await axios.get(`http://localhost:8080/aluno-turma/aluno/${usuario.id}`)
        const todasAtividades = []
        const entregasRes = await axios.get(`http://localhost:8080/entregas/aluno/${usuario.id}`)
        const entregasMap = {}
        entregasRes.data.forEach(entrega => {
          entregasMap[entrega.tarefa.id] = entrega
        })

        for (const relacao of resTurmas.data) {
          const turma = relacao.turma
          const tarefasRes = await axios.get(`http://localhost:8080/tarefas/turma/${turma.id}`)

          tarefasRes.data.forEach(tarefa => {
            const entrega = entregasMap[tarefa.id]
            todasAtividades.push({
              id: tarefa.id,
              titulo: tarefa.titulo,
              data: `De ${tarefa.dataEntrega} a ${tarefa.dataEntrega}`,
              descricao: tarefa.descricao,
              situacao: entrega ? 'ENTREGUE' : 'PENDENTE',
              nota: entrega?.notaRecebida ?? null,
              linkPdf: entrega?.linkEntrega,
              expandido: false
            })
          })
        }

        setAtividades(todasAtividades)
      } catch (error) {
        console.error('Erro ao carregar notas:', error)
      }
    }

    carregarNotas()
  }, [usuario])

  const toggleExpandir = (id) => {
    const novas = atividades.map((a) =>
      a.id === id ? { ...a, expandido: !a.expandido } : a
    )
    setAtividades(novas)
  }

  const visualizarEntrega = (link) => {
    if (!link) {
      alert('Nenhuma entrega disponível.')
      return
    }
    window.open(link, '_blank')
  }

  return (
    <div className="container-atividades-aluno">
      <Header links={linksAluno} />
      <div className="atividades-turmas-header">
        <h2>ATIVIDADES</h2>
        <BotaoSair tipo="aluno" />
      </div>

      <div className="atividades-turmas">
        {atividades.map((atividade) => (
          <div key={atividade.id} className="atividade-nota-card">
            <div className="atividade-topo" onClick={() => toggleExpandir(atividade.id)}>
              <div>
                <h3>{atividade.titulo}</h3>
                <p>{atividade.data}</p>
              </div>
              <span className="seta">
                {atividade.expandido ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {atividade.expandido && (
              <div className="atividade-detalhes">
                <div className="nota-status">
                  <div>
                    <p><strong>SITUAÇÃO</strong></p>
                    <p>{atividade.situacao}</p>
                  </div>
                  <div>
                    <p><strong>NOTA</strong></p>
                    <p>{atividade.nota != null ? atividade.nota : '-'}</p>
                  </div>
                  {atividade.situacao === 'ENTREGUE' && (
                    <button
                      className="botao-ver-pdf"
                      onClick={() => visualizarEntrega(atividade.linkPdf)}
                    >
                      👁
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notas

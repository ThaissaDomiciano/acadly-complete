import './Atividades.css'
import Header from '../../components/Header'
import BotaoSair from '../../components/BotaoSair'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const Atividades = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const turmaSelecionada = location.state?.turma
  const usuario = location.state?.usuario

  const linksAluno = [
    { to: '/aluno', label: 'INÍCIO' },
    { to: '/aluno/turmas', label: 'TURMAS' },
    { to: '/aluno/resultado', label: 'RESULTADO' },
  ]

  const [atividades, setAtividades] = useState([])
  const [entregas, setEntregas] = useState({})

  useEffect(() => {
    if (!turmaSelecionada || !usuario) {
      console.warn("Dados ausentes: redirecionando para HomeAluno.")
      navigate('/aluno')
      return
    }

    const buscarAtividades = async () => {
      try {
        const atividadesRes = await axios.get(`http://localhost:8080/tarefas/turma/${turmaSelecionada.id}`)
        const entregasRes = await axios.get(`http://localhost:8080/entregas/aluno/${usuario.id}`)

        const entregasMap = {}
        entregasRes.data.forEach(e => {
          entregasMap[e.tarefa.id] = e
        })

        setEntregas(entregasMap)
        setAtividades(atividadesRes.data)
      } catch (error) {
        console.error('Erro ao buscar atividades ou entregas:', error)
      }
    }

    buscarAtividades()
  }, [turmaSelecionada, usuario, navigate])

  return (
    <div className='container-atividades-aluno'>
      <Header links={linksAluno} />
      <div className="atividades-turmas-header">
        <h2>ATIVIDADES - {turmaSelecionada?.nomeMateria}</h2>
        <BotaoSair tipo="aluno" />
      </div>

      <div className="atividades-turmas">
        {atividades.length === 0 && <p>Nenhuma atividade disponível.</p>}

        {atividades.map((atividade) => {
          const entrega = entregas[atividade.id]
          const entregue = !!entrega

          return (
            <div key={atividade.id} className="atividade-card">
              <div className="atividade-info">
                <h3>{atividade.titulo}</h3>
                <p>DE {atividade.dataEntrega}</p>
              </div>

              <div className="atividade-status">
                <span className={entregue ? 'entregue' : 'pendente'}>
                  {entregue ? 'ENTREGUE' : 'PENDENTE'}
                </span>

                <button
                  className="botao-acessar"
                  onClick={() =>
                    navigate('/envio-atividades', {
                      state: {
                        atividade,
                        entrega,
                        usuario,
                        turma: turmaSelecionada
                      }
                    })
                  }
                >
                  👁 ACESSAR
                </button>

                {entregue && <span className="check-icon">✔</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Atividades

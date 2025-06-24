import { FaSignOutAlt } from 'react-icons/fa';
import './BotaoSair.css';

const BotaoSair = ({tipo}) => {
    const rota = tipo === 'professor' ? '/homeProfessor' : '/homeAluno';
    return (
        <button className="btn-voltar" onClick={() => window.location.href = rota}>
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                        VOLTAR
            </button>
    )
} 

export default BotaoSair;
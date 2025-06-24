import { useState } from 'react';
import { FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import './Card.css';

const Card = ({ titulo, professor, botoes, isProfessor, onEditar }) => {
  const [editando, setEditando] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState(titulo);

  const salvarEdicao = () => {
    if (novoTitulo.trim() === '') {
      alert('O nome não pode ficar vazio.');
      return;
    }
    onEditar(novoTitulo);
    setEditando(false);
  };

  const cancelarEdicao = () => {
    setNovoTitulo(titulo);
    setEditando(false);
  };

  return (
    <div className="card">
      <div className="card-content">
        {editando ? (
          <>
            <input
              type="text"
              className="input-edicao"
              value={novoTitulo}
              onChange={e => setNovoTitulo(e.target.value)}
              autoFocus
            />
            <div className="edicao-icones">
              <FaCheck
                className="icone-salvar"
                onClick={salvarEdicao}
                title="Salvar edição"
              />
              <FaTimes
                className="icone-cancelar"
                onClick={cancelarEdicao}
                title="Cancelar edição"
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="titulo-card">{titulo}</h3>
            <p className="professor-label"><strong>PROFESSOR:</strong> {professor}</p>
            <div className="linha-separadora"></div>
            {isProfessor && (
              <div className="acoes-icones" style={{ alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <FaPen
                  className="icone-editar"
                  onClick={() => setEditando(true)}
                  title="Editar nome"
                  style={{ cursor: 'pointer' }}
                />
                <span
                  onClick={() => setEditando(true)}
                  className="texto-editar"
                >
                  EDITAR TURMA
                </span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card-footer-botoes">
        {botoes?.map((botao, index) => (
          <button
            key={index}
            className={botao.className}
            onClick={botao.onClick}
          >
            {botao.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Card;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';  
import './Styles.css';
import Image from '../assets/img-login.svg';  
import Logo from '../assets/logo-texto.svg';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const navigate = useNavigate();

 const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email,
      senha
    });

    const { usuario } = response.data;

    localStorage.setItem('usuario', JSON.stringify(usuario));
    onLogin(usuario);
    setUsuarioLogado(usuario);
  } catch (error) {
    console.error(error); //
    setErro('Erro ao conectar com o servidor');
    toast.error("E-mail ou senha inválidos!");
  }
};


  useEffect(() => {
    if (usuarioLogado) {
      if (usuarioLogado.tipo === 'PROFESSOR') {
        navigate('/homeProfessor');
      } else {
        navigate('/homeAluno');
      }
    }
  }, [usuarioLogado, navigate]);

  return (
    <div className='login-wrapper'>
      <img src={Logo} alt="Logo Acadly" className="logo" />
      <div className='left-section'>
        <img src={Image} alt='Professora dando aula para alunos' className='left-image' />
      </div>
      <div className='divider' />
      <div className='right-section'>
        <h2 className='title'>LOGIN</h2>
        <input
          type='email'
          placeholder='DIGITE SEU E-MAIL'
          className='input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='DIGITE SUA SENHA'
          className='input'
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button className='button' onClick={handleLogin}>ENTRAR</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <p className='link-cadastro'>
          NÃO TEM UMA CONTA? <a href='/cadastro'>CADASTRE-SE</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

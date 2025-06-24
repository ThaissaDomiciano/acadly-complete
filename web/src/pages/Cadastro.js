import { useState } from 'react';
import { toast } from 'react-toastify';
import './Cadastro.css';   
import './Styles.css' 
import Image from '../assets/img-cadastro.svg';  
import Logo from '../assets/logo-texto.svg';
import axios from 'axios';

function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, settipo] = useState('');

    const HandleCadastro = async () => {
  if (!nome || !email || !senha || !tipo) {
    toast.warning("Preencha todos os campos!"); 
    return;
  }

  try {
    await axios.post('http://localhost:8080/usuarios', {
      nome,
      email,
      senha,
      tipo: tipo.toUpperCase()
    });
    toast.success('Usuário cadastrado com sucesso!');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  } catch (error) {
    console.error(error);
    toast.error("Erro ao cadastrar usuário!");
  }
};

    return (
        <div className='cadastro-wrapper'>
            <img src={Logo} alt="Logo Acadly" className="logo" />
            <div className='left-section'>
                <img src={Image} alt='Professora dando aula para alunos' className='left-image-cadastro' />
            </div>
            <div className='divider' />
            <div className='right-section'>
                <h2 className='title'>CADASTRO</h2>
                <input 
                    type='text' 
                    placeholder='DIGITE SEU NOME COMPLETO' 
                    className='input'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
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
                <select 
                    className='select-input'
                    value={tipo}
                    onChange={(e) => settipo(e.target.value)}
                    >
                    <option value="">SELECIONE O TIPO DE USUÁRIO</option>
                    <option value="ALUNO">ALUNO</option>
                    <option value="PROFESSOR">PROFESSOR</option>
                    </select>
                <button 
                    className='button'
                    onClick={HandleCadastro}
                >
                    CADASTRAR
                </button>
                <p className='link-cadastro'>
                    JÁ TEM CONTA? <a href='/login'>FAÇA LOGIN</a>
                </p>
            </div>
        </div>
    );
}

export default Cadastro;

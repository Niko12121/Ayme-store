import React, { useEffect, useState } from 'react';
import '../App.css';
import Axios from 'axios';
import NavBar from '../components/NavBar';

function Signup() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post("http://localhost:3001/login", {
            userName: userName,
            password: password
        }).then((response) => {
            console.log(response.data);
        })
    }

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            console.log(response)
        });
    }, []);

    return (
      <div className="registerPage">
        <NavBar />
        <h1>Aymé</h1>
        <div className="form">
          <h2>Inicia sesión</h2>
          <label>Nombre de usuario</label>
          <input type="text" name="userName" onChange={(e)=>setUserName(e.target.value)} />
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
          <button onClick={login}>Ingresa</button>
          </div>
      </div>
    );
  }

export default Signup;
import React, { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const createUser = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/register", {
      userName: userName, 
      password: password
    });
    history.push("/");
  }

  return (
    <div className="registerPage">
    <form action="" onSubmit={createUser}>
      <h2>Regístrate</h2>
      <label>Nombre de usuario</label>
      <input type="text" name="userName" onChange={(e)=>setUserName(e.target.value)} />
      <label>Contraseña:</label>
      <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
      <button type='submit' onClick={createUser}>Ingresar</button>
      </form>
  </div>
  );
}


export default Register;
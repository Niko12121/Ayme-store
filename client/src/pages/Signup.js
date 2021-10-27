import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function Signup() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    let history = useHistory()

    Axios.defaults.withCredentials = true;

    const login = (e) => {
      e.preventDefault();
        Axios.post("http://localhost:3001/login", {
            userName: userName,
            password: password
        }).then((response) => {
          if (response.data.message === "Logged") {
            window.location.reload();
          } else if (response.data.message === "Wrong password") {
            setMessage("Contraseña equivocada")
          } else if (response.data.message === "User doesn't exist") {
            setMessage("Usuario no existe")
          }
      }
    )}

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn) {
              history.push('/')
            };
    })});

    return (
      <div className="registerPage">
        <form action="" onSubmit={login}>
          <h2>Inicia sesión</h2>
          <label>Nombre de usuario</label>
          <input type="text" name="userName" onChange={(e)=>setUserName(e.target.value)} />
          <label>Contraseña:</label>
          <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
          <button type='submit' onClick={login}>Ingresar</button>
          </form>
          {message}
      </div>
    );
  }

export default Signup;
import React, { useEffect, useState } from 'react';
import '../App.css';
import Axios from 'axios';
import NavBar from '../components/NavBar';

function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/users/get").then((users) => {
      setUserList(users.data)
    })
  }, []);

  const createUser = () => {

    Axios.post("http://localhost:3001/register", {
      userName: userName, 
      password: password
    });

    setUserList([
        ...userList,
        { name: userName, password: password }
    ]);

    window.location.reload();
  }

  return (
    <div className="registerPage">
      <NavBar />
      <h1>Aymé</h1>
      <div className="form">
        <h2>Registrate</h2>
        <label>Nombre de usuario</label>
        <input type="text" name="userName" onChange={(e)=>setUserName(e.target.value)} />
        <label>Contraseña:</label>
        <input type="password" name="password" onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={createUser}>Registarse</button>
      {userList.map((user, index) => {
        return <div className="user">{index + 1}) Usuario: {user.name} | Contraseña: {user.password} </div>
        })}
        </div>
    </div>
  );
}


export default Register;
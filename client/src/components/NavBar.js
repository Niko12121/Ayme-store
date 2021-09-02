import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";

export default function NavBar() {
    const [userName, setUserName] = useState('')
    const [role, setRole] = useState('')
    
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn) {
              setRole(response.data.user.role)
              setUserName(response.data.user.name)
            }
        })
    }, [])

    const logout = () => {
        Axios.get("http://localhost:3001/logout").then((response) => {
            console.log(response)
        });
        window.location.reload();
    }
    
    return (
        <div className="navbar">
        {role !== '' && <p>Bienvenidx {userName}</p>}
        <Link to='/'><button>Home</button></Link>
        <Link to='/products'><button>Productos</button></Link>
        {role === '' && 
        <Link to="/register">
            <button>
                Registrate
            </button>
        </Link>}
        {role === '' && 
        <Link to="/signup">
            <button>
                Inicia Sesión
            </button>
        </Link>}
        {role === 'admin' && 
        <Link to="/newproduct">
            <button>
                Crear Producto
            </button>
        </Link>}
        {role === 'admin' && 
        <Link to="/categories">
            <button>
                Editar Categorias
            </button>
        </Link>}
        {role !== '' && 
        <button onClick={logout}>Salir</button>}
        <h1>Aymé</h1>
        </div>
    )
}

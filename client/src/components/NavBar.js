import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
import SearchBar from './SearchBar';
import ShoppingCart from './ShoppingCart'

export default function NavBar() {
    const [user, setUser] = useState({role: ''})
    
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn) {
                setUser(response.data.user)
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
        {user.role !== '' && <p>Bienvenidx {user.name}</p>}
        <Link to='/'><button>Home</button></Link>
        <Link to='/products'><button>Productos</button></Link>
        {user.role === '' && 
        <Link to="/register"><button>Registrate</button></Link>}
        {user.role === '' && <Link to="/signup"><button>Inicia Sesión</button></Link>}
        {user.role === 'admin' && <Link to="/newproduct"><button>Crear Producto</button></Link>}
        {user.role === 'admin' && <Link to="/categories"><button>Editar Categorias</button> </Link>}
        {user.role !== '' && <button onClick={logout}>Salir</button>}
        {user.role !== '' && <div className='shoppingCartIcon' onClick={showCart}>C</div>}
        {user.role !== '' && <ShoppingCart user={user} />}
        <h1>Aymé</h1>
        <SearchBar />
        </div>
    )
}

const showCart = () => {
    let cart = document.getElementsByClassName('shoppingCart')[0]
    if (cart.classList.contains("OnCart")) {
        cart.classList.remove("OnCart")
    } else {
        cart.classList.add("OnCart")
    }
}
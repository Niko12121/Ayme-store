import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";
import SearchBar from './SearchBar';
import ShoppingCart from './ShoppingCart'
import "../style/NavBar.css"

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
        <h1 className="titlePage">Aymé</h1>
        <div className="linksNavbar">
            <SearchBar />
            <Link to='/'><div className="link">Home</div></Link>
            <Link to='/products'><div className="link">Productos</div></Link>
            {user.role === '' && 
            <Link to="/register"><div className="link">Registrate</div></Link>}
            {user.role === '' && <Link to="/signup"><div className="link">Inicia Sesión</div></Link>}
            {user.role === 'admin' && <Link to="/newproduct"><div className="link">Crear Producto</div></Link>}
            {user.role === 'admin' && <Link to="/categories"><div className="link">Editar Categorias</div></Link>}
            {user.role !== '' && <div className="link" onClick={logout}>Salir</div>}
            {user.role !== '' && <div className='shoppingCartIcon' onClick={showCart}></div>}
            {user.role !== '' && <ShoppingCart user={user} />}
        </div>
        
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
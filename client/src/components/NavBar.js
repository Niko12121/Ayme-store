import React from 'react';
import { Link } from "react-router-dom";

class NavBar extends React.Component {
    render () {
    return (
        <div className="navbar">
        <Link to="/">
            <button variant="outlined">
                Home
            </button>
        </Link>
        <Link to="/register">
                <button variant="outlined">
                    Registrate
                </button>
            </Link>
        <Link to="/signup">
            <button variant="outlined">
                Inicia Sesión
            </button>
        </Link>
        <Link to="/newproduct">
            <button variant="outlined">
                Crear Producto
            </button>
        </Link>
        </div>
    )
    }
}

export default NavBar;
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import NavBar from '../components/NavBar';

export default function Main() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setProducts(p.data)
            console.log(p.data)
        })
      }, []);

    return (
        <div>
            <NavBar />
            <h2>Productos</h2>
            {products.map((p) => {
                return <div className="product"><b>{p.name}</b><br />${p.value}</div> })}
        </div>
    )
}

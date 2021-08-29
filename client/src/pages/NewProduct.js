import React, { useState ,useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import NavBar from '../components/NavBar';

function NewProduct() {
    const [productName, setProductName] = useState("");
    const [productValue, setProductValue] = useState("");
    let history = useHistory();

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (!response.data.loggedIn) {
                history.push('/')
            } else if (response.data.user.role !== 'admin') {
                history.push('/')
            }
        })
    })

    const createProduct = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/product", {
            name: productName,
            value: productValue
        })
        history.push("/");
    }

    return (
        <div className="newProductPage">
        <NavBar />
        <form action="" onSubmit={createProduct}>
          <h2>Crear Nuevo Producto</h2>
          <label>Nombre producto</label>
          <input type="text" name="productName" onChange={(e)=>setProductName(e.target.value)} />
          <label>Valor</label>
          <input type="number" name="productValue" onChange={(e)=>setProductValue(e.target.value)}/>
          <button type='submit' onClick={createProduct}>Ingresar</button>
          </form>
      </div>
      );
}

export default NewProduct;
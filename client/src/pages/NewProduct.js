import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function NewProduct() {
    const [productName, setProductName] = useState('');
    const [productValue, setProductValue] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [photo, setProductPhoto] = useState()
    let history = useHistory();

    Axios.defaults.withCredentials = true;

    const createProduct = (e) => {
        let seconds = Math.trunc(Date.now() / 1000);
        console.log(seconds)
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", photo);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        Axios.post("http://localhost:3001/upload", formData, config)
        .then((response) => alert("A ver?"))
        .catch((err) => alert("error :C"))

        Axios.post("http://localhost:3001/product", {
            name: productName,
            value: productValue,
            description: productDesc,
            file: seconds
        })
    }

    useEffect(()=>{
        Axios.get("http://localhost:3001/login").then((res)=>{
            if (!res.data.loggedIn || res.data.user.role !== "admin") {
                console.log(res.data)
                history.push("/");
            }
        })
    })

    return (
        <div className="newProductPage">
        <form action="" onSubmit={createProduct}>
          <h2>Crear Nuevo Producto</h2>
          <label>Nombre producto</label>
          <input type="text" name="productName" onChange={(e)=>setProductName(e.target.value)} />
          <label>Foto</label>
          <input type="file" name="image" onChange={(e) =>setProductPhoto(e.target.files[0])} />
          <label>Descripción</label>
          <input type="text" name="productDescription" onChange={(e)=>setProductDesc(e.target.value)} />
          <label>Valor</label>
          <input type="number" name="productValue" onChange={(e)=>setProductValue(e.target.value)}/>
          <button type='submit'>Ingresar</button>
          </form>
      </div>
      );
}

export default NewProduct;
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function NewProduct() {
    const [productName, setProductName] = useState('');
    const [productValue, setProductValue] = useState('');
    const [productActualValue, setProductActualValue] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [photo, setProductPhoto] = useState()
    let history = useHistory();


    const createProduct = (e) => {
        let seconds = Math.trunc(Date.now() / 1000);
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", photo);

        Axios.post("http://localhost:3001/upload", formData, {headers: {'content-type': 'multipart/form-data'}})
        .then((response) => {
            alert("Subida correctamente");
            window.location.reload()
        })

        Axios.post("http://localhost:3001/product", {
            name: productName,
            value: productValue,
            actual_value: productActualValue,
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
          <label>Valor actual (oferta)</label>
          <input type="number" name="productActualValue" onChange={(e)=>setProductActualValue(e.target.value)}/>
          <button type='submit'>Ingresar</button>
          </form>
      </div>
      );
}

export default NewProduct;
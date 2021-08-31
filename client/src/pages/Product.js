import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Axios from 'axios';

export default function Product() {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');

    Axios.defaults.withCredentials = true;
    let id = useParams().productId
    useEffect(() => {
        Axios.get("http://localhost:3001/products/product/get", {
            params: {id: id}}).then((res) => {
                const product = res.data[0];
                setName(product.name);
                setValue(product.value);
                setDescription(product.description);
                setFile(product.file.toString())})
      });
    console.log(file)

    return (
        <div>Nombre: {name}<br/>Valor: {value}<br/><img src={require("../Images/1630371509.jpg")} alt="No cargó" width="100px" height="200px"/><br/>Descripción: {description}</div>
    )
}
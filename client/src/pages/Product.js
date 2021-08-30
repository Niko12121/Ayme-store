import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Axios from 'axios';

export default function Product() {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');

    Axios.defaults.withCredentials = true;
    let id = useParams().productId
    useEffect(() => {
        Axios.get("http://localhost:3001/products/product/get", {
            params: {id: id}}).then((res) => {
                const product = res.data[0];
                setName(product.name);
                setValue(product.value);
                setDescription(product.description)});
      });
    return (
        <div>Nombre: {name}<br/>Valor: {value}<br/>Descripción: {description}</div>
    )
}
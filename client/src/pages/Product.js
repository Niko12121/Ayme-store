import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import Axios from 'axios';

export default function Product() {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [actualValue, setActualValue] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');
    const [role, setRole] = useState('');
    const [nameChange, setNameChange] = useState('');
    const [valueChange, setValueChange] = useState('');
    const [actualValueChange, setActualValueChange] = useState('');
    const [descriptionChange, setDescriptionChange] = useState('');
    const [categories, setCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([])

    
    let history = useHistory();

    const id = useParams().productId

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn) {
              setRole(response.data.user.role)
            }
        })
        Axios.get("http://localhost:3001/products/product/get", {
            params: {id: id}}).then((res) => {
                const product = res.data[0];
                setName(product.name);
                setValue(product.value);
                setActualValue(product.actual_value)
                setDescription(product.description);
                setFile(require('../Images/' + product.file.toString() + '.jpg').default )})
        Axios.get("http://localhost:3001/categories/get").then((p) => {
            setCategories(p.data)
            })
        Axios.get("http://localhost:3001/product/categories/get", {
            params: {id : id}}).then((res) => {
                setProductCategories(res.data)
            })
      }, [id]);
    
    const editProduct = () => {
        /* If the input was left empty, no change the value */
        let newName = nameChange === '' ? name : nameChange;
        let newValue = valueChange === '' ? value : valueChange;
        let newActualValue = actualValueChange === '' ? actualValue : actualValueChange;
        let newDescription = descriptionChange === '' ? description : descriptionChange;

        Axios.put(`http://localhost:3001/api/product/update`, {
            idProduct: id,
            newName: newName,
            newValue: newValue,
            newActualValue: newActualValue,
            newDescription: newDescription
        });
        alert("Producto editado");
        window.location.reload()
    }

    const deleteProduct = () => {
        window.confirm("¡Segura que quieres eliminar este producto?") && Axios.delete(`http://localhost:3001/api/product/delete/${id}`);
        history.push('/')
    }

    const addCategory = () => {
        const addCategory = document.getElementById("newCategory").value;
        Axios.post("http://localhost:3001/product/category", {
            idProduct: id,
            category: addCategory
        })
        alert("Categoría añadida")
        window.location.reload()
    }

    const removeCategory = () => {
        const removeCategory = document.getElementById("removeCategory").value;
        Axios.delete("http://localhost:3001/product/category", {
            data: {id: id, category: removeCategory}
        })
        alert("Categoría eliminada")
        window.location.reload()
    }

    return (
        <div>
            Nombre: {name}<br/>
            Valor: ${value}<br/>
            {actualValue !== value && <b>OFERTA: ${actualValue}</b>}
            <img className="imagePage" src={file} alt="No cargó" /><br/>
            Descripción: {description}<br/>
            Categorias: {productCategories.map((category) => {
                return <p>{category.category}: {category.description}<br/></p>
            })}<br/>
            {role === "admin" && 
            <div>
                <input onChange={(e) => setNameChange(e.target.value)} placeholder="Nuevo título"/><br/>
                <input type="number" onChange={(e) => setValueChange(e.target.value)} placeholder="Nuevo precio"/><br/>
                <input type="number" onChange={(e) => setActualValueChange(e.target.value)} placeholder="Nuevo precio oferta"/><br/>
                <input onChange={(e) => setDescriptionChange(e.target.value)} placeholder="Nueva descripción"/><br/>
                <button onClick={editProduct}>Editar producto</button>
            </div>}<br/>
            {role === "admin" && <button onClick={deleteProduct}>Eliminar producto</button>}<br/>
            {role === "admin" && <div>Añadir Categoria: <select id="newCategory">
                {categories.map((category) => {
                    if (productCategories.filter(e => e.category === category.category).length === 0) {
                        return <option>{category.category}</option>
                    } else {return ''}
            })}</select><button onClick={addCategory}>Añadir</button></div>}
            {role === "admin" && <div>Eliminar Categoria: <select id="removeCategory">
                {productCategories.map((category) => {
                    return <option>{category.category}</option>
            })}</select><button onClick={removeCategory}>Eliminar</button></div>}
        </div>
    )
}
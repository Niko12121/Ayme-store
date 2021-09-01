import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function Categories() {
    const [categories, setCategories] = useState([])
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('')
    let history = useHistory();

    const createCategory = (e) => {
        Axios.post("http://localhost:3001/categories", {
            name: categoryName,
            description: categoryDescription
        });
        alert("Categoría creada");
        window.location.reload()
    }

    const deleteCategory = (category) => {
        Axios.delete(`http://localhost:3001/category/delete/${category}`);
        alert("Categoría eliminada")
        window.location.reload()
    }

    useEffect(()=>{
        Axios.get("http://localhost:3001/login").then((res)=>{
            if (!res.data.loggedIn || res.data.user.role !== "admin") {
                console.log(res.data)
                history.push("/");
            }
        })
        Axios.get("http://localhost:3001/categories/get").then((p) => {
            setCategories(p.data)
        })
    })


    return (
        <div className="categoryPage">
        <form action="" onSubmit={createCategory}>
          <h2>Crear Nueva Categoria</h2>
          <label>Nombre categoria</label>
          <input type="text" name="categoryName" onChange={(e)=>setCategoryName(e.target.value)} />
          <label>Descripción</label>
          <input type="text" name="categoryDescription" onChange={(e)=>setCategoryDescription(e.target.value)} />
          <button type='submit'>Ingresar</button>
        </form>
        {categories.map((category) => {
            return <div className="category">
                Categoria: {category.category}<br/>
                Descripción: {category.description}<br/>
                <button onClick={() => {deleteCategory(category.category)}}>Eliminar</button>
                </div>
        })}
      </div>
      );
}

export default Categories;
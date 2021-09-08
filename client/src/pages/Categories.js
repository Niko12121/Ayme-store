import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom";

function Categories() {
    const [categories, setCategories] = useState([])
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('')
    const [subcategories, setSubcategories] = useState({})
    let history = useHistory();

    const createCategory = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/categories", {
            name: categoryName,
            description: categoryDescription
        });
        alert("Categoría creada");
        window.location.reload()
    }

    const addSubcategory = (category) => {
        let name = document.getElementById("sub"+category).value;
        Axios.post("http://localhost:3001/subcategories", {
            name: name,
            category: category
        })
        alert("Subcategoría añadida");
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
            Axios.get("http://localhost:3001/categories/get").then(async (p) => {
            let actual = {}
            for (let i = 0; i < p.data.length; i++) {
                await Axios.get("http://localhost:3001/category/subcategories", {
                params : {category : p.data[i].category}}).then((pa) => {
                    if (p.data.length > 0) {
                        actual[p.data[i].category] = pa.data
                    }
                })
            setSubcategories(actual);
            setCategories(p.data)
        }
        })
    }, [history])


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
                Descripción: {category.description}<br/><br />
                {console.log(subcategories[category.category])}
                <label>Añadir subcategoría</label><br />
                <input type="text" id={"sub" + category.category}/>
                <button onClick={() => addSubcategory(category.category)}>Añadir</button><br />
                <button onClick={() => deleteCategory(category.category)}>Eliminar</button>
                </div>
        })}
        {console.log(subcategories)}
      </div>
      );
}

export default Categories;
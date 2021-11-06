import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import Axios from 'axios';
import "../style/Product.css";


export default function Product() {
    const [product, setProduct] = useState({})
    const [file, setFile] = useState('');
    const [user, setUser] = useState({role: ""});
    const [nameChange, setNameChange] = useState('');
    const [valueChange, setValueChange] = useState('');
    const [actualValueChange, setActualValueChange] = useState('');
    const [descriptionChange, setDescriptionChange] = useState('');
    const [categories, setCategories] = useState([]);
    const [productCategories, setProductCategories] = useState({})
    const [quantity, setQuantity] = useState(1)

    
    let history = useHistory();

    const id = useParams().productId

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn) {
                setUser(response.data.user)
            }
        })
        Axios.get("http://localhost:3001/products/product/get", {
            params: {id: id}}).then((res) => {
                const productTo = res.data[0]
                setProduct(productTo)
                setFile(require('../Images/' + productTo.file.toString() + '.jpg').default )})
        Axios.get("http://localhost:3001/categories/get").then(async (p) => {
            let actual = {}
            for (let i = 0; i < p.data.length; i++) {
                await Axios.get("http://localhost:3001/category/subcategories", {
                params : {category : p.data[i].category}}).then((pa) => {
                    if (p.data.length > 0) {
                        if (actual[p.data[i]] === undefined) {
                            actual[p.data[i].category] = pa.data
                        } else {
                            actual[p.data[i]].push(pa.data)
                        }
                    }
                })
            }
            setCategories(actual);
        });
        Axios.get("http://localhost:3001/product/categories/get", {
            params: {id : id}}).then((res) => {
                let actual = {}
                for (let i = 0; i < res.data.length; i++) {
                    if (actual[res.data[i].category] === undefined) {
                        actual[res.data[i].category] = [res.data[i].subcategory]
                    } else {
                        actual[res.data[i].category].push(res.data[i].subcategory)
                    }
                }
                setProductCategories(actual);
            })
      }, [id]);
    
    const editProduct = () => {
        /* If the input was left empty, no change the value */
        let newName = nameChange === '' ? product.name : nameChange;
        let newValue = valueChange === '' ? product.value : valueChange;
        let newActualValue = actualValueChange === '' ? product.actual_value : actualValueChange;
        let newDescription = descriptionChange === '' ? product.description : descriptionChange;

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

    const addSubcategory = (category) => {
        const subcat = document.getElementById("add" + category).value;
        Axios.post("http://localhost:3001/product/subcategory", {
            idProduct: id,
            category: category,
            subcategory: subcat
        })
        alert("Categoría añadida")
        window.location.reload()
    }

    const removeSubcategory = (category, sub) => {
        Axios.delete("http://localhost:3001/product/subcategory", {
            data: {id: id, category: category, subcategory: sub}
        })
        alert("Categoría eliminada")
        window.location.reload()
    }

    const addCart = () => {
        Axios.post("http://localhost:3001/shoppingCart/new", {
            idUser: user.idUsers,
            idProduct: id,
            quantity: quantity,
        })
        /* quantity is how many items the user want to add to Cart, and id is the product */
        window.location.reload()
    }


    return (
        <div id="productPage">
            <div id="photoProduct">
            <img id="imagePage" src={file} alt="No cargó" /><br/>
                
            </div>
            <div>
                <h3 id="titleProduct">{product.name}</h3>
                <div id="infoProduct">
                <div id="textProduct">
                    <p>{product.description}</p><br/>
                    <div className="productCategories">
                    {Object.keys(productCategories).map((category) => {
                        return <div className="productCategory">
                                {category}<br/>
                                <ul>
                                {productCategories[category].map((sub) => {
                                    return <span>
                                        {user.role === "admin" && 
                                            <span className="removeSubcat" onClick={() => {removeSubcategory(category, sub)}}>
                                            &#10006;</span>}{sub}
                                            </span>
                                })}
                                </ul>
                            </div>
                    })}
                    </div>
                </div>
                <div id="buyProduct">
                    <div id="centerBuy">
                    {product.actual_value !== product.value && <span class="originalPrice">${quantity * product.value}</span>}{product.actual_value === product.value && <span>${ quantity * product.value}</span>}<br/>
                    {product.actual_value !== product.value && <span class="salePrice">${quantity * product.actual_value}</span>}<br/><br/>
                    <div onClick={() => setQuantity(Math.max(quantity - 1, 1))} className="quantityButton">-</div>
                    <div className="quantityValue">{quantity}</div>
                    <div onClick={() => setQuantity(quantity + 1)} className="quantityButton">+</div><br/><br/><br/>
                    {user.role !== "" && <div><button onClick={() => addCart()}>Añadir</button>
                    </div>}
                    </div>
                </div>
                </div>
            </div>
            <div id="adminProduct">
                {user.role === "admin" && <div>
                <div>
                    <input onChange={(e) => setNameChange(e.target.value)} placeholder="Nuevo título"/><br/>
                    <input type="number" onChange={(e) => setValueChange(e.target.value)} placeholder="Nuevo precio"/><br/>
                    <input type="number" onChange={(e) => setActualValueChange(e.target.value)} placeholder="Nuevo precio oferta"/><br/>
                    <input onChange={(e) => setDescriptionChange(e.target.value)} placeholder="Nueva descripción"/><br/>
                    <button onClick={editProduct}>Editar producto</button><br/>
                </div>
                <div>
                    Añadir Categoria:
                    {Object.keys(categories).map((category) => {
                        return <div><p>{category}</p>
                            <select id={"add" + category}>
                                {categories[category].map((sub) => {
                                    let show = true;
                                    if (productCategories[category] !== undefined) {
                                        if (productCategories[category].includes(sub.name)) {
                                            show = false
                                        }
                                    } if (show) {return <option>{sub.name}</option>} else {return ''}
                                })}
                            </select>
                            <button onClick={() => addSubcategory(category)}>Añadir</button>
                        </div>
                })}
                </div>
                <button onClick={deleteProduct}>Eliminar producto</button></div>}
            </div>
        </div>
    )
}
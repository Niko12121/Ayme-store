import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Axios from 'axios';

export default function Category() {
    const [products, setProducts] = useState([])
    const [show, setShow] = useState([])
    const [subCats, setSubCats] = useState([])
    const [filters, setFilters] = useState([])

    const name = useParams().categoryName

    useEffect(() => {
        Axios.get("http://localhost:3001/category/get", {
            params: {name: name}}).then((p) => {
                setProducts(p.data.reverse())
                setShow(p.data.reverse().sort((a, b) => (a.actual_value - a.value) - (b.actual_value - b.value)))
            })
        Axios.get("http://localhost:3001/category/subcategories", {
            params : {category : name}}).then((p) => {
                setSubCats(p.data)
            })
    }, [name])

    async function filter(sub) {
        let newList = filters
        if (document.getElementById("check"+sub).checked) {
            newList.push(sub)
        }
        else {
            newList.splice(newList.indexOf(sub), 1)
        }
        setFilters(newList)
        if (filters.length === 0) {
            setShow(orderShowing(products))
            return
        }
        let newShow = []
        for (let i = 0; i < products.length; i++) {
            let res = await getData(products[i].idProduct)
            res && newShow.push(products[i])
        }
        setShow(orderShowing(newShow))
    }

    async function getData(id) {
        let res = await Axios.get("http://localhost:3001/product/subcategories/get", {params: {id : id, name: name}})
        let subs = res.data.map(a => a.subcategory)
        let actual = true;
        for (let i = 0; i < filters.length; i++) {
            if (!subs.includes(filters[i])) {
                actual = false
            }
        }
        return actual
    }

    const orderShowing = (actual) => {
        let actual_show = [...actual]
        let newOrder = document.getElementById('productsOrder').value;
        if (newOrder === "Mayor precio") {
            actual_show.sort((a, b) => b.actual_value - a.actual_value)
        } else if (newOrder === "Menor precio") {
            actual_show.sort((a, b) => a.actual_value - b.actual_value)
        } else if (newOrder === "Mayor Oferta") {
            actual_show.sort((a, b) => (a.actual_value - a.value) - (b.actual_value - b.value))
        }
        return (actual_show)
    }

    return (<div className="productsPage">
            <div class="filter">
                {Object.values(subCats).map((sub) => {
                    return <p><input className="checkboxCat" id={"check" + sub.name} type="checkbox" onClick={() => filter(sub.name)}/>{sub.name}</p>
                })}
                <select id="productsOrder" onChange={() => setShow(orderShowing(show))}>
                    <option>Mayor Oferta</option>
                    <option>Mayor precio</option>
                    <option>Menor precio</option>
                </select>
            </div>
            <Products products={show} />
            </div>)
}


/* Same as Products page */

function Products(props) {
    return (
        <div className="store">
            {props.products.map((p) => {
                return <Product product={p}/>})}
        </div>
    )
}

function Product(props) {
    const product = props.product
    return (<a href={`/products/${product.idProduct}`} className="productMain">
                <div className="img">
                    <img src={ require('../Images/' + product.file + '.jpg' ).default } alt=""/>
                </div>
                <div className="product">
                    <b>{product.name}</b><br/><i>${product.value}</i><br/>
                    {product.actual_value !== product.value && <b> OFERTA: ${product.actual_value}</b>}
                </div>
            </a>
    )
    
}
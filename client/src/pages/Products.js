import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [filters, setFilters] = useState([])
    const [show, setShow] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setProducts(p.data.reverse())
            setShow(p.data.reverse().sort((a,b) => {return (a.actual_value - a.value) - (b.actual_value - b.value)}))
        })
        Axios.get("http://localhost:3001/categories/get").then((p) => {
            setCategories(p.data)
        })
      }, []);

    const orderShowing = (e) => {
        let newOrder = e.target.value;
        let sortProd = show.sort((a, b)=>{
            if (newOrder === "Mayor precio") {
                return b.actual_value - a.actual_value
            } else if (newOrder === "Menor precio") {
                return a.actual_value - b.actual_value
            } else {
                return (a.actual_value - a.value)>(b.actual_value - b.value)?1:-1
            }
        })
        setShow(sortProd)
        console.log(sortProd)
    }

    async function getData(id) {
        let res = await Axios.get("http://localhost:3001/product/categories/get", {
            params: {id : id}})
        let actual = true;
        let productCategories = res.data.map((a) => a.category);
        for (let j = 0; j<filters.length; j++) {
            if (!productCategories.includes(filters[j])) {
                actual = false
            }
        }
        return actual
    }

    async function filter(category) {
        let newList = filters
        let click = document.getElementById("check"+category).checked
        if (click) {
            newList.push(category)
        } else {
            while (newList.includes(category)) {
                newList.splice(newList.indexOf(category), 1)
            }
        }
        setFilters(newList)
        if (filters.length === 0) {
            setShow(products)
            return};
        let newShow = []
        for (let i = 0; i < products.length; i++) {
            let id = products[i].idProduct;
            let res = await getData(id)
            res && newShow.push(products[i])
        }
        setShow(newShow)
    }

    return (
        <div>
            <h2>Productos</h2>
            <Filter orderShowing={orderShowing} categories={categories} filter={filter}/>
            <Products products={show} />
        </div>
    )
}

function Filter(props) {
    return (<div>
                {props.categories.map((category) => {
                    return <div><p>{category.category}<input id={"check" + category.category} type="checkbox" onClick={() => props.filter(category.category)}/></p></div>
                })}
                <select id="productsOrder" onChange={props.orderShowing}>
                    <option>All</option>
                    <option>Mayor Oferta</option>
                    <option>Mayor precio</option>
                    <option>Menor precio</option>
                </select>
            </div>)
}

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
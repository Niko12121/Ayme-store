import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [show, setShow] = useState([])
    const [categories, setCategories] = useState({})
    const [filters, setFilters] = useState({"category": [], "subcategory": []})

    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setProducts(p.data.reverse())
            setShow(p.data.reverse().sort((a, b) => (a.actual_value - a.value) - (b.actual_value - b.value)))
        })
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
        })
      }, []);

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

    async function getData(id) {
        let res = await Axios.get("http://localhost:3001/product/categories/get", {params: {id : id}})
        let productCategories = {"category": [], "subcategory": []}
        for (let i = 0; i < res.data.length; i++) {
            productCategories["category"].includes(res.data[i].category) || productCategories["category"].push(res.data[i].category);
            productCategories["subcategory"].push([res.data[i].subcategory, res.data[i].category])
        }
        let actual = true;
        for (let i = 0; i < filters["category"].length; i++) {
            if (!productCategories["category"].includes(filters["category"][i])) {
                actual = false;
            }
        }
        for (let i = 0; i < filters["subcategory"].length; i++) {
            if (JSON.stringify(productCategories["subcategory"]).indexOf(JSON.stringify(filters["subcategory"][i])) === -1) {
                actual = false
            }
        }
        return actual
    }

    async function filter(belongs, categoryName) {
        let newList = filters;
        let type;
        if (belongs) {
            type = "subcategory"
        } else {
            type = "category"
        }
        let click = document.getElementById("check"+type+categoryName).checked;
        if (click) {
            belongs ? newList[type].push([categoryName, belongs]) : newList[type].push(categoryName)
        } else {
            if (belongs) {
                while (newList[type].includes([categoryName, belongs])) {
                    newList[type].splice(newList[type].indexOf([categoryName, belongs]), 1)
                }
            } else {
                while (newList[type].includes(categoryName)) {
                    newList[type].splice(newList[type].indexOf(categoryName), 1)
                }
            }
        }
        console.log(newList)
        setFilters(newList)
        if (filters["category"].length === 0 && filters["subcategory"].length === 0) {
            setShow(orderShowing(products))
            return};
        let newShow = []
        for (let i = 0; i < products.length; i++) {
            let id = products[i].idProduct;
            let res = await getData(id)
            res && newShow.push(products[i])
        }
        setShow(orderShowing(newShow))
    }

    return (
        <div>
            <h2>Productos</h2>
            <Filter orderShowing={() => setShow(orderShowing(show))} categories={categories} filter={filter}/>
            <Products products={show} />
        </div>
    )
}

function Filter(props) {
    return (<div>
                {Object.keys(props.categories).map((category) => {
                    return <div>
                                <p><input id={"checkcategory" + category} type="checkbox" onClick={() => props.filter(false ,category)}/>{category}</p>
                                {props.categories[category].map((sub) => {
                                    return <div className="subcategoriesFilters">
                                                <p><input id={"checksubcategory" + sub.name} type="checkbox" onClick={() => props.filter(category ,sub.name)}/>{sub.name}</p>
                                            </div>
                                })}
                            </div>
                })}
                <select id="productsOrder" onChange={props.orderShowing}>
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
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function Products() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [filters, setFilters] = useState([])

    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setProducts(p.data.reverse())
        })
        Axios.get("http://localhost:3001/categories/get").then((p) => {
            setCategories(p.data)
        })
      }, []);

    const filter = (category) => {
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
        console.log(filters)
    }

    return (
        <div>
            <h2>Productos</h2>
            <div className="productsFilter">
                {categories.map((category) => {
                    return <div><p>{category.category}<input id={"check" + category.category} type="checkbox" onClick={() => filter(category.category)}/></p></div>
                })}
            </div>
            <div className="store">
            {products.map((p) => {
                let ref = `/products/${p.idProduct}`
                return <a href={ref} className="productMain">
                    <div className="img">
                        <img src={ require('../Images/' + p.file + '.jpg' ).default } alt=""/>
                    </div>
                    <div className="product">
                        <b>{p.name}</b><br/><i>${p.value}</i><br/>
                        {p.actual_value !== p.value && <b> OFERTA: ${p.actual_value}</b>}
                    </div></a>})}
            </div>
        </div>
    )
}

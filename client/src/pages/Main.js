import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function Main() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setProducts(p.data.reverse())
        })
      }, []);
    return (
        <div>
            <h2>Productos</h2>
            <div className="store">
            {products.map((p) => {
                let ref = `/products/${p.idProduct}`
                return <a href={ref} className="productMain">
                    <div className="img">
                        <img src={ require('../Images/' + p.file + '.jpg').default } alt=""/>
                    </div>
                    <div className="product">
                        <b>{p.name}</b><br/><i>${p.value}</i>
                    </div></a> })}
            </div>
        </div>
    )
}

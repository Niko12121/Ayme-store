import React, { useEffect, useState } from 'react';
import Axios from 'axios';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const [allProducts, setAllProducts] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [dataCat, setDataCat] = useState([])

    /* Get products and categories */
    useEffect(() => {
        Axios.get("http://localhost:3001/products/get").then((p) => {
            setAllProducts(p.data)
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
        setAllCategories(actual);
        })
      }, []);

    useEffect(() => {
        const products = allProducts.filter((p) => {
            return p.name.toLowerCase().includes(searchTerm)
        })
        const categories = {}
        for (const key of Object.keys(allCategories)) {
            if (key.toLowerCase().includes(searchTerm)) {
                categories[key] = []
            }
            for (const subcat of allCategories[key]) {
                if (subcat.name.toLowerCase().includes(searchTerm)) {
                    if (categories[key] === undefined) {
                        categories[key] = [subcat.name]
                    } else {
                        categories[key].push(subcat.name)
                    }
                }
            }
        }
        setDataProducts(products)
        setDataCat(categories)
    }, [searchTerm, allProducts, allCategories])

    const showSearchBar = (e) => {
        if (e.target.value.length < 3) {
            document.getElementById("dataResult").style.height = 0
            return
        }
        document.getElementById("dataResult").style.height = "150px"
        setSearchTerm(e.target.value.toLowerCase())
    }

    return <div className="search">
            <div className="searchinput">
                <input type="text" placeholder="Búsqueda..." id="searchBar" onChange={(e) => {showSearchBar(e)}} />
            </div>
            <div id="dataResult">
                <div className="dataProduct">
                    <h5> Productos </h5>
                    <ul className="listSearchBar">
                    {dataProducts.map((p) => {
                        return <li><a className="prodSearchBar" href={`/products/${p.idProduct}`}>{p.name}</a></li>
                    })}
                    </ul>
                </div>
                <div className="dataCategory">
                    <h5> Categorias </h5>
                    {Object.keys(dataCat).map((cat) => {
                        return <div><a className="catSearchBar" href={`/category/${cat}`}>{cat}</a>
                        <ul className="listSearchBar">
                        {dataCat[cat].map((sub) => {
                            return <li>{sub}</li>
                        })}
                        </ul>
                        </div>
                    })}
                </div>
            </div>
        </div>
}
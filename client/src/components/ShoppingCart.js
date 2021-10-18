import React, { useEffect, useState } from 'react';
import Axios from 'axios';

export default function SearchingCart(props) {
    const [cart, setCart] = useState([])

    const idUser = props.user.idUsers
    /* Get Cart of the user */
    useEffect(() => {
        Axios.get("http://localhost:3001/shoppingCart", {
            params: {idUser: idUser}}).then((pa) => {
                console.log(pa.data)
                setCart(pa.data)
        })
    }, [idUser])

    const updateQuantity = (idProduct, newQuantity) => {
        if (newQuantity === 0) {
            Axios.delete("http://localhost:3001/shoppingDelete", {
            data: {idUser: idUser, idProduct: idProduct}
        })} else {
            Axios.put(`http://localhost:3001/shoppingUpdate`, {
                idUser: idUser,
                idProduct: idProduct,
                quantity: newQuantity
            });
        }
        /* Change this */
        window.location.reload()
    }

    return <div className='shoppingCart'>
            <h4>Carrito de Compra</h4>
                {cart.map(product => {
                    return <div className="productShopping">
                        {product.name} ${product.actual_value} c/u<br/>
                        <a href={`/products/${product.idProduct}`}>
                        <img className="imgShopping" alt="No cargo" src={require('../Images/' + product.file.toString() + '.jpg').default}></img>
                        </a><br />
                        <button onClick={() => updateQuantity(product.idProduct, 0)}> E </button>
                        <button onClick={() => updateQuantity(product.idProduct, product.quantity - 1)}> - </button>
                        {product.quantity}
                        <button onClick={() => updateQuantity(product.idProduct, product.quantity + 1)}> + </button>
                        <b> ${product.quantity * product.actual_value}</b>
                    </div>
                })}<br/>
                <button> Ir a Pagar </button>
        </div>
}

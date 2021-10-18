import React, { useEffect, useState } from 'react';
import Axios from 'axios';

export default function SearchingCart(props) {
    const [cart, setCart] = useState([])

    const idUser = props.user.idUsers
    /* Get Cart of the user */
    useEffect(() => {
        Axios.get("http://localhost:3001/shoppingCart", {
            params: {idUser: idUser}}).then((pa) => {
                setCart(pa.data)
        })
    }, [idUser])

    return <div className='shoppingCart'>
            <h4>Carrito de Compra</h4>
                {cart.map(product => {
                    return <ProductShopping product={product} idUser={idUser} />
                })}<br/>
                <button> Ir a Pagar </button>
        </div>
}

function ProductShopping(props) {
    const [quantity, setQuantity] = useState(props.product.quantity)
    const [show, setShow] = useState(true)

    const updateQuantity = (idProduct, newQuantity) => {
        if (newQuantity === 0) {
            Axios.delete("http://localhost:3001/shoppingDelete", {
            data: {idUser: props.idUser, idProduct: idProduct}
            
        })
            setShow(false)
        } else {
            Axios.put(`http://localhost:3001/shoppingUpdate`, {
                idUser: props.idUser,
                idProduct: idProduct,
                quantity: newQuantity
            });
        }
        setQuantity(newQuantity)
    }

    return show && <div className="productShopping">
        {props.product.name} ${props.product.actual_value} c/u<br/>
        <a href={`/products/${props.product.idProduct}`}>
        <img className="imgShopping" alt="No cargo" src={require('../Images/' + props.product.file.toString() + '.jpg').default}></img>
        </a><br />
        <button onClick={() => updateQuantity(props.product.idProduct, 0)}> E </button>
        <button onClick={() => updateQuantity(props.product.idProduct, quantity - 1)}> - </button>
        {quantity}
        <button onClick={() => updateQuantity(props.product.idProduct, quantity + 1)}> + </button>
        <b> ${quantity * props.product.actual_value} </b>
    </div>
}
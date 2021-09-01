import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Main from '../pages/Main';
import Signup from '../pages/Signup';
import Register from '../pages/Register';
import NewProduct from '../pages/NewProduct';
import Product from '../pages/Product';
import Categories from '../pages/Categories';
import NavBar from '../components/NavBar';
import "../App.css"

function App() {
  return (
      <BrowserRouter>
        <NavBar />
        <Route exact path='/' render={(props) => <Main />}/>
        <Route exact path='/newproduct' render={(props) => <NewProduct />}/>
        <Route exact path='/categories' render={(props) => <Categories />}/>
        <Route exact path='/signup' render={(props) => <Signup />}/>
        <Route exact path='/register' render={(props) => <Register />}/>
        <Route exact path='/products/:productId' render={(props) => <Product />}/>
      </BrowserRouter>
  );
}

export default App;
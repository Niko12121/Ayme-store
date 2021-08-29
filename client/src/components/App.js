import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Main from '../pages/Main';
import Signup from '../pages/Signup';
import Register from '../pages/Register';
import NewProduct from '../pages/NewProduct';
import "../App.css"

function App() {
  return (
    <BrowserRouter>
      <Route exact path='/' render={(props) => <Main />}></Route>
      <Route exact path='/newproduct' render={(props) => <NewProduct />}></Route>
      <Route exact path='/signup' render={(props) => <Signup />}></Route>
      <Route exact path='/register' render={(props) => <Register />}></Route>
    </BrowserRouter>
  );
}

export default App;
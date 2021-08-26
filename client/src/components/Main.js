import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Register from '../pages/Register';
import NewProduct from '../pages/NewProduct';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/newproduct' component={NewProduct}></Route>
      <Route exact path='/signup' component={Signup}></Route>
      <Route exact path='/register' component={Register}></Route>
    </Switch>
  );
}

export default Main;
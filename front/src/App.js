import React from 'react';
import DefaultLayout from './layout/DefaultLayout';
import { BrowserRouter, Switch, Route  } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={'/'}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={DefaultLayout}/>
      </Switch>
    </BrowserRouter>

  );
}

export default App;

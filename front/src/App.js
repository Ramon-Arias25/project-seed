import React from 'react';
import Interior from './views/Interior';
import { BrowserRouter, Switch, Route  } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename={'/'}>
      <Switch>
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Interior}/>
      </Switch>
    </BrowserRouter>

  );
}

export default App;

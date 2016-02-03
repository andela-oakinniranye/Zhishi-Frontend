import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute, Link, IndexLink } from 'react-router'


import AuthStore from './stores/AuthStore.js';
import AuthActions from './actions/AuthActions.js'
import webAPI from './utils/webAPI.js'

import Zhishi from './components/Zhishi.react';
import Home from './components/Home.react';
import Login from './components/Login.react';
import Users from './components/users/Index.react';

$.cookie.json = true

let user_logged_in = function(nextState, replaceState) {
  if (!AuthStore.userLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

let user_logged_out = function(nextState, replaceState) {

  if (AuthStore.userLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/')
  }
}

let log_out = function(nextState, replaceState) {
  AuthActions.logoutUser();
  replaceState({ nextPathname: nextState.location.pathname }, '/login')
}

let SignUpUser = function(nextState, replaceState){
  if (!$.isEmptyObject(nextState.location.query.temp_token)) {
    webAPI.processRequest('/validate_token', 'POST', nextState.location.query, AuthActions.loginUser)
  }
}


ReactDOM.render(
  (<Router history={createBrowserHistory()}>
    <Route path="/logout" onEnter={log_out} />

    <Route path="/" component={Zhishi} >

      <Route path="/login" component={Login} onEnter={user_logged_out} >
        <Route path='/login/auth' onEnter={SignUpUser} />
      </Route>

      <IndexRoute component={Home} onEnter={user_logged_in} />

      <Route path="/users" component={Users}  onEnter={user_logged_in}>
        <Route path="/users/:id" component={Login} />
      </Route>

      <Route path="*" component={Zhishi} onEnter={user_logged_in}/>

    </Route>
  </Router>),
  document.getElementById('app')
);

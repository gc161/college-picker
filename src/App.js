import { useState, useEffect } from "react";
import Signup from './components/Signup';
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import { HashRouter, BrowserRouter, Switch, Redirect } from "react-router-dom"
import RouteWrapper from "./RouteWrapper";
import { AuthProvider } from './AuthContext';
import { VERSION_NUMBER } from "./Constants";


function App() {

  console.log("Version " + VERSION_NUMBER);

  return (
    <AuthProvider>
      <HashRouter>
        <Switch>
          <RouteWrapper exact path="/">
            <Redirect to={`/home`} />
          </RouteWrapper>
          <RouteWrapper exact path="/signup">
            <Signup />
          </RouteWrapper>
          <RouteWrapper exact path="/login">
            <Login />
          </RouteWrapper>
          <RouteWrapper exact path="/home">
            <Home />
          </RouteWrapper>
          <RouteWrapper exact path="/profile">
            <Profile />
          </RouteWrapper>
        </Switch>
      </HashRouter>

    </AuthProvider>
  );
}

export default App;

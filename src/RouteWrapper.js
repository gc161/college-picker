import React from 'react'
import { Route } from 'react-router';
import { Redirect } from 'react-router';
import { useAuth } from './AuthContext';

function RouteWrapper({comp: Comp, ...others}) {
    const { user } = useAuth()

    return (
        <Route
        {...others}
        render={props => {
            user ? <Comp {...props} /> : <Redirect to="/login"/>}}
        ></Route>
    )
}

export default RouteWrapper

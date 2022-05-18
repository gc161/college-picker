

import React, { useState, useEffect, useContext } from 'react'
import {cognitoAuth} from './Cognito';
import { makeStyles } from '@material-ui/core/styles';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const useStyles = makeStyles((theme) => ({
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '500px',
    marginTop: '25px'
  },
  left: {
    width: '40%',
    float: 'left',
    marginTop: '25px'
  },

  right: {
    width: '40%',
    float: 'left',
    border: "1px solid grey",
    borderRadius: '25px',
    marginTop: '25px',
    marginRight: '25px'
  },

  icon: {
    margin: theme.spacing(1),
    width: 60,
    height: 60
  },
  form: {
    width: '60%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  divider: {
    margin: theme.spacing(3),
  }
}));

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState("");
  const [firebaseInitDone, setFirebaseInitDone] = useState(false)

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const value = {
    user,
    setUser,
    openSnackbar,
    setOpenSnackbar,
    message,
    setMessage,
    timeout
  }

  useEffect(() => {
    setFirebaseInitDone(true)
    // const cleanup = cognitoAuth.onAuthStateChanged((u) => {
    //   setUser(u);
    //   setFirebaseInitDone(true)
    // })
  //  return cleanup;
  }, [])


  return (
    <AuthContext.Provider value={value}>
      {firebaseInitDone && children}
    </AuthContext.Provider>

  )

}
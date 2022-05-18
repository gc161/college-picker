
import React, { useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import NavBar from './NavBar';
import Intro from './Intro';
import { cognitoAuth, AuthenticationDetails } from '../Cognito';

import { useAuth, useStyles } from '../AuthContext';
import { useHistory } from 'react-router-dom';



export default function SignUp() {
  const classes = useStyles();

  const emailRef = useRef();
  const passwordRef = useRef();
  const password2Ref = useRef();

  const { setOpenSnackbar, setMessage, user } = useAuth()
  const history = useHistory();

  useEffect(() => {
    if (user) {
      history.push('/home')
    }
  }, [user])



  const signUp = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== password2Ref.current.value) {
      setMessage("password does not match");
      setOpenSnackbar(true);
      return;
    }
    try {
      await cognitoAuth.signUp( emailRef.current.value, passwordRef.current.value, [], null, (err, data) => {
        if (err) {
          console.log(err);
          setMessage(err.message);
          setOpenSnackbar(true);
          return;
        } else {
          console.log(data);
          return;
        }
        // setMessage(err);
        // setOpenSnackbar(true);
      });
      history.push('/home')
    } catch (e) {
      setMessage(e.message);
      setOpenSnackbar(true);
    }
  }

  return (
    <div>
      <NavBar />
      <div className={classes.left}>
        <Intro />
      </div>
      <div className={classes.right}>
        <Container component="main" maxWidth="lg" >
          <CssBaseline />
          <div className={classes.center}>
            <AccountCircleIcon className={classes.icon} color='primary' />
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputRef={emailRef}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    inputRef={passwordRef}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    inputRef={password2Ref}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={signUp}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}

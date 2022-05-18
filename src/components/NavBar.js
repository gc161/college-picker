import  { useState, useRef } from 'react'
import 'react-quill/dist/quill.snow.css';
import '../styles.css'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import uuid from 'react-uuid'
import { useHistory } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { cognitoAuth } from '../Cognito';
import { SettingsInputSvideoRounded } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const columns = [
    { field: 'userEmail', headerName: 'Email', width: 200 },
];

export default function NavBar({ inUser }) {

    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
  
    const { openSnackbar, setOpenSnackbar, message, setMessage, user, timeout, setUser } = useAuth()


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignout = () => {
        setAnchorEl(null);
        try {
            setUser(null)
         //   cognitoAuth.getCurrentUser().signOut();
            history.push('/login')
        } catch (e) {
            setMessage(e.message);
            setOpenSnackbar(true);
        }
    };

    const goToProfile = () => {
        setAnchorEl(null);
        history.push("/profile")
    };


    return (
        <AppBar position="static" color="primary">
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                // onClose={handleClose}
                message={message}
                autoHideDuration={3000}
                onClose={() => { setOpenSnackbar(false); setMessage("") }}
            //  key={vertical + horizontal}
            />
            <Toolbar>

                <Typography variant="h6" className={classes.title}>
                    College Picker
                </Typography>

                {inUser && <div>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit">
                        <MenuIcon color="inherit" />
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={goToProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleSignout}>Logout</MenuItem>
                    </Menu>
                </div>
                }
             
            </Toolbar>
        </AppBar>
    )
}

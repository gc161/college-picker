import React, { useEffect } from 'react'
import { useAuth } from '../AuthContext';

import NavBar from './NavBar';
import Card from '@material-ui/core/Card';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Email from '@material-ui/icons/Email';
import Box from '@material-ui/core/Box';
import Feedback from '@material-ui/icons/Feedback';

function Profile() {

  const { user } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login')
      return;
    }
  }, [user])

  return (


    <div>
      <NavBar inUser={true}></NavBar>
      <Card className='center'>
      <Typography className='center' > <AccountCircle color='primary' style={{fontSize: '32px'}} /> My Profile</Typography>
      </Card>
      <Box m={2} pt={3} >
          <Typography className='center'> <div><Email color='primary'  />   {user} </div></Typography>
      </Box>
        <Box m={2} pt={3}>
          <Typography className='center' > <div> <Feedback color='primary' />   More to come... </div></Typography>
      </Box>
    </div>
  )
}

export default Profile

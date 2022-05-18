
import React from 'react';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SchoolIcon from '@material-ui/icons/School';
import GroupIcon from '@material-ui/icons/Group';
import Divider from '@material-ui/core/Divider';
import { useStyles } from '../AuthContext';
import Share from '@material-ui/icons/Share';


export default function Intro() {
  const classes = useStyles();

  return (
    <div>
      <Container component="main" maxWidth="lg">

        <div className={classes.center}>

          <SchoolIcon color='primary' className={classes.icon} />
          <Typography component="h1" variant="h5"  >College Picker</Typography>
          <Divider variant="inset" className={classes.divider} />

        

          <GroupIcon color='primary' className={classes.icon} />
          <Typography component="h1" variant="h5" >Find your dream schools</Typography>
          <Divider variant="inset" className={classes.divider} />
        </div>
      </Container>
    </div>
  );
}

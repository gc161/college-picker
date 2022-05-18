

import React, { useState } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SchoolIcon from '@material-ui/icons/School';
import SendIcon from '@material-ui/icons/Send';
import Slider from '@material-ui/core/Slider';
import DoneIcon from '@material-ui/icons/Done';
import { CircularProgress } from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const Output = ({rating, schoolName, collegeUrl, collegeId, school_state, tuition, sat_scores, num_of_student}) => {
  
  const [clicked, setClicked] = useState(0);
  const { user } = useAuth()
  const [openInfo, setOpenInfo] = useState(false);
  let sliderValue = 3;
  function valuetext(value) {
    return `${value}`;
  }

  const sendCollegeRating = (collegeId, value) => {
    
      if (!collegeId) {
          return
      }
      setClicked(1)

      const currUser = user;

      axios.post(process.env.REACT_APP_AWS_API_GATEWAY + '/rate', { params: {
        user_school_id: '' +collegeId +"_" + currUser +"@@@",
        rating: '' + value +"###",
      }}, { params: {
        user_school_id: '' +collegeId +"_" + currUser +"@@@",
        rating: '' + value +"###",
      }} )
      .then((response) => {
        console.log("getRecommendedCollege response:", response);
        setClicked(2)

      })
      .catch((error) => {
        console.log("getRecommendedCollege error:", error);
        setClicked(3)
      });
  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];

  const handleClick = () =>{
    setOpenInfo(true);
  }


  const closeInfo = () => {
    setOpenInfo(false);
}
 
    return (

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SchoolIcon onClick={handleClick}/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={ schoolName }
            secondary= {<Slider
              defaultValue={rating}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              marks
              min={0}
              max={5}
              onChange = { (event, value) => { sliderValue = value;}}
              valueLabelDisplay="auto"
              disabled = {clicked !== 0}
            />}
          />
          <ListItemSecondaryAction>
            {clicked === 0 && <IconButton edge="end" aria-label="send" onClick={() => { sendCollegeRating(collegeId, sliderValue) }}>
            <Tooltip title="Send rating">
              <SendIcon />
              </Tooltip>
            </IconButton> }
            {clicked === 1 &&  <CircularProgress size={ 30 } /> }
            {clicked === 2 &&  <DoneOutlineIcon /> }
            {clicked === 3 &&  <ErrorOutline /> }
          </ListItemSecondaryAction>

          <Dialog open={openInfo} onClose={closeInfo} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" >{schoolName}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            URL: {<a href={"http://" + collegeUrl} target="_blank">{collegeUrl}</a>}
                        </DialogContentText>
                        <DialogContentText>
                            State: {school_state}
                        </DialogContentText>

                        <DialogContentText>
                            Student Size: {num_of_student}
                        </DialogContentText>

                        <DialogContentText>
                            Tuition: {tuition}
                        </DialogContentText>

                        <DialogContentText>
                         Avg. SAT: {sat_scores}
                        </DialogContentText>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeInfo} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
        </ListItem>



      
    );
}

export default Output;
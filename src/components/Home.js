import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../AuthContext';

import { makeStyles } from '@material-ui/core/styles';
import NavBar from './NavBar';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import List from '@material-ui/core/List';
import Container from '@material-ui/core/Container';
import Output from './Output'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
        verticalAlign: 'middle',
        color: theme.palette.text.secondary,
        fontSize: '30px'
    },
    relativeDiv: {
        position: 'relative',
    },
    leftIcon: {
        flexGrow: 1,
    },
    rightIcon: {
        display: 'block',
        position: 'absolute',
        top: '-7px',
        right: '-10px'
    },
    icon: {
        color: 'rgb(48, 128, 188)'
    }
}));

function Home() {

    const { user, setMessage, setOpenSnackbar } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [allColleges, setAllColleges] = useState([]);
    const collegeName = useRef();
    const [analyzing, setAnalyzing] = useState(0)
    const [recommendedColleges, setRecommendedColleges] = useState([]);

    const us_states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 
    'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA',
     'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 
     'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 
     'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

    useEffect(() => {
        if (!user) {
            history.push('/login')
            return;
        }
        setLoading(true)
        getAllColleges()

    }, [user])

    const getAllColleges =  () => {

        axios.get(process.env.REACT_APP_AWS_API_GATEWAY + '/allcolleges', null, { params: {
          }} )
          .then((response) => {
            const colleges = response["data"]["data"]
            console.log("getRecommendedCollege response:", response);
            setAllColleges(colleges)
            setLoading(false)
          })
          .catch((error) => {
            console.log("getRecommendedCollege error:", error);
            setLoading(false)
          });
    };

    const getRecommendedCollege = (event, college) => {
        console.log("getRecommendedCollege")
        if (!college) {
            return
        }
        setAnalyzing(1)
        axios.get(process.env.REACT_APP_AWS_API_GATEWAY + '/recommend', { params: {
            school_id: '' + college.school_id +'###',
            user_email: '' + user+"@@@"
          }}, { params: {
            school_id: '' + college.school_id +'###',
            user_email: '' + user+"@@@"
          }} )
          .then((response) => {
            console.log("getRecommendedCollege response:", response);
            setRecommendedColleges(response.data.result)
            setAnalyzing(2)

          })
          .catch((error) => {
            console.log("getRecommendedCollege error:", error);
            setAnalyzing(3)
          });
    }

    const filterOptions = createFilterOptions({
        limit: 50,
      });


    return (
        <div>
            <NavBar inUser={true} ></NavBar>
            
            { loading && <div className='center'><CircularProgress/><h2>Loading school list...</h2></div>}
        { !loading && <div className='center'>
            <form>
            <Autocomplete
                id="combo-box-demo"
                filterOptions={filterOptions}
                options={allColleges}
                getOptionLabel={(option) => option.school_name}
                style={{ width: 600 }}
                onChange={getRecommendedCollege}
                renderInput={(params) => <TextField {...params} label="Which school is your top choice?" variant="outlined" />}
                />
            </form>
            { analyzing === 1 && <div className="center"> <CircularProgress /> Looking for similar schools</div>}
            { analyzing === 2 && <div>
            <div className="center"> We found these schools that are similar to your top choice</div>
            <div className='recommend-body'>
            <Container maxWidth="sm">
                <List >
                    {recommendedColleges.map( (item) => {
                         if (item && item.school_name) {
                            return <Output rating={item.rating } schoolName={item.school_name } school_state={item.state } num_of_student={item.num_of_student} sat_scores={item.sat_scores} tuition={item.tuition} collegeUrl={item.school_url} collegeId={item.school_id} key={item.Title}></Output>
                         }
                         return <div></div>
                    })}
                </List>
                </Container>
            </div></div>}
            { analyzing === 3 && <div className="center"> <ErrorOutlineIcon/> Error. Please try again</div>} 
        </div>}
        </div>
    )
}

export default Home

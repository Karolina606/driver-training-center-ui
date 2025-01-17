
import { Container, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import useAxios from '../utils/useAxios';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContext from '../context/DialogContex';
import EditUserDialogForm from './forms/EditUserForm';
import { makeStyles } from '@material-ui/core';
import EnrollCourse from './forms/EnrollCourse';
import { purple, red } from '@mui/material/colors';
import ToastContext from "../context/ToastContex";
import { BorderColor } from '@mui/icons-material';
import { baseURL } from '../utils/useAxios';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      maxWidth: '300px',
      minWidth: '130px'
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));


const UserCard = (props) => {

  const { user, logoutUser } = useContext(AuthContext);
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };
  const { toastState, setToastState } = useContext(ToastContext);
  const [refresh, setRefresh] = useState(false);

  const { response, loading, error } = useAxios({
    method: 'get',
    url: 'users/' + user.user_id
  });

  const [groupsNames, setGroupNames] = useState([]);

  const fetchGroups = async (groups) => {

    console.log({groups});
      groups?.forEach(group => {
        axios.get(group, {headers}).then(resp => {setGroupNames([...groupsNames ,resp.data.name]) });
        console.log({groupsNames});
      });
  }

  const fetchUsers = async () => {
    await axios.get("/users/", { headers }).then(resp => {props.updateUsers(resp.data)});
}

  const username = props.user.username;
  const email = props.user.email;
  const groups = props.user.groups;
  const user_id = props.user.id;
  const first_name = props.user.first_name;
  const last_name = props.user.last_name;

  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log({ username })
  };

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
    console.log({ open });
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    fetchGroups(groups);
  }, []);


  const grant_admin = async () => {
    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };
    await axios.post('/users/' + user_id + '/grant_admin/', {}, headers).then(resp => {
      if(resp.status === 200) {
        setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie dodano rolę admina'});
      }else {
        setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
      }
    });
    setRefresh(true);
  };

  const grant_instructor = async () => {
    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };
    await axios.post('/users/' + user_id + '/grant_instructor/', {}, headers).then(resp => {
      if(resp.status === 200) {
        setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie dodano rolę instruktora'});
      }else {
        setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
      }
    });
    setRefresh(true);
  };

  const grant_student = async () => {
    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };
    await axios.post('/users/' + user_id + '/grant_student/', {}, headers).then(resp => {
      console.warn({resp})
      if(resp.status === 200) {
        setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie dodano rolę kursanta'});
      }else {
        setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
      }
    });
    setRefresh(true);
  };

  useEffect(() => {
    fetchUsers();
    setRefresh(false);
  }, [refresh]);

  return <>
    <Container maxWidth="md" sx={{ mt: "2rem", px: "1rem" }}>
      <Card sx={{ minWidth: 130, p: "1rem", 
      backgroundColor: theme.palette.third.main
       }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {username}: {first_name} {last_name}
          </Typography>
          <Typography color="text.secondary">
            Email: {email}
          </Typography>
          <Typography color="text.secondary">
            Grupy: 
            {/* {groupsNames?.map(name => {return ' ' + name + ' '})} */}
          </Typography>
        </CardContent>


        {response?.groups.includes(baseURL + "groups/1/") ?
        <>
          <ButtonGroup variant="contained" aria-label="outlined primary button group" maxWidth="md" sx={{width: '100%'}}>
            <Button sx={{width: '100%'}} onClick={e => {grant_student(); // window.location.reload(false); 
              }} 
            disabled={groups.includes(baseURL + "groups/3/")}>
              {groups.includes(baseURL + "groups/3/") ?
                <>
                  Student
                </>
                :
                <>
                  Uprawnij studenta
                </>
              }
            </Button>

            <Button sx={{width: '100%'}} onClick={e => {
              grant_instructor();
            }}
            disabled={groups.includes(baseURL + "groups/2/")}>
              {groups.includes(baseURL + "groups/2/") ?
                <>
                  Instruktor
                </>
                :
                <>
                  Uprawnij inst
                </>
              }
            </Button>

            <Button sx={{width: '100%'}} onClick={e => {
              grant_admin();
              }}
              disabled={groups.includes(baseURL + "groups/1/")}>
              {groups.includes(baseURL + "groups/1/") ?
                <>
                  Admin
                </>
                :
                <>
                  Uprawnij admina
                </>
              }
            </Button>
            </ButtonGroup>

            {groups.includes(baseURL + "groups/3/") ?
            <Button onClick={handleClickOpen} sx={{ mt: 2, width: '100%',
             color: theme.palette.secondary.main,
             borderColor: theme.palette.secondary.main
             }} variant="outlined" aria-label="outlined button group">
              Zapisz na kurs
            </Button>
          
          : <></>}
          </>
          : <></>
        }
      </Card>
    </Container>

<DialogContext.Provider value={[open, setOpen]}>
<EnrollCourse student={props.user} />
</DialogContext.Provider>
  </>
}

export default UserCard;
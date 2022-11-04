
import { Container, Card, CardContent, Typography } from '@mui/material';
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
  const headers = { Authorization: `Bearer ${authTokens?.access}` };

  const { response, loading, error } = useAxios({
    method: 'get',
    url: 'users/' + user.user_id
  });

  const [groupss, setGroups] = useState([]);

  const fetchGroups = async (groups) => {
      // const groupNames = [];
      // groups?.forEach(group => {
      //   axios.get(group, {headers}).then(resp => {console.log({resp});
      //   groupNames.push(resp.data.name)});
      // });
      // console.log({groupNames});
      // return groupNames;

      // let group_text = "";
      // groups.forEach(group => {
      //   axios.get(group, {headers}).then(resp => {group_text += resp.data.name + ", " });
      // });
      // setGroups(group_text);

      groups?.forEach(group => {
        axios.get(group, {headers}).then(resp => {setGroups([...groupss ,resp.data.name]) });
      });

      // axios.get(groups[0], {headers}).then(resp => {let kconsole.log({resp});
      //    return resp.data.name});
      // // return k;
  }

  const username = props.user.username;
  const email = props.user.email;
  const groups = props.user.groups;
  const user_id = props.user.id;

  const [open, setOpen] = useState(false);

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


  return <>
    <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
      <Card sx={{ minWidth: 130, p: "1rem" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {username}
          </Typography>
          <Typography color="text.secondary">
            Email: {email}
          </Typography>
          <Typography color="text.secondary">
            Grupy: {groups}
          </Typography>
        </CardContent>


        {response?.groups.includes("http://127.0.0.1:8000/groups/1/") ?
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button>One</Button>
            <Button onClick={e => {
              axios.post('users/' + user_id + '/grand_student/', {}, headers)
            }}>
              Grand student</Button>
            <Button onClick={handleClickOpen}>Edit</Button>
          </ButtonGroup>
          : <></>
        }
      </Card>
    </Container>

    <div>
      <DialogContext.Provider value={[open, setOpen]}>
        <EditUserDialogForm></EditUserDialogForm>
      </DialogContext.Provider>
    </div>
  </>
}

export default UserCard;
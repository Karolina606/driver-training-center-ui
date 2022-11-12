import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContext from '../../context/DialogContex';
import {makeStyles } from '@material-ui/core';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';


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

export default function AddCategory(props) {
  const [open, setOpen] = React.useContext(DialogContext);
  const { authTokens, setUser, setAuthTokens } = React.useContext(AuthContext);
  const headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const fetchCategories = async () => {
    await axios.get("/driving_license_categories/", { headers }).then(resp => { props.updateCategories(resp.data) });
  }

  const [dialogCategory, setCategory] = React.useState('');
  const [dialogTheory, setTheory] = React.useState('');
  const [dialogPractice, setPractice] = React.useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("driving_license_categories/",
      {
        "name": dialogCategory, 
        "theory_full_time": dialogTheory, 
        "practice_full_time": dialogPractice
      },
      headers);
      setOpen(false);
      window.location.reload(false);
  };

  React.useEffect(() => {
    fetchCategories();
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dodaj nową kategorię</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dodaj nową kategorię prawa jazdy.
          </DialogContentText>
          <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Nazwa kategorii"
                variant="outlined"
                required
                value={dialogCategory}
                onChange={e => setCategory(e.target.value)}
              />
              <TextField
                label="Ilość godzin - teoria"
                variant="outlined"
                value={dialogTheory}
                onChange={e => setTheory(e.target.value)}
              />
              <TextField
                label="Ilość godzin - praktyka"
                variant="outlined"
                value={dialogPractice}
                onChange={e => setPractice(e.target.value)}
              />
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button onClick={handleSubmit}>Zapisz</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

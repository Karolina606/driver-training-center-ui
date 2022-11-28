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
import ToastContext from '../../context/ToastContex';


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

export default function EditUserDialogForm(props) {
  const [open, setOpen] = React.useContext(DialogContext);
  const { toastState, setToastState } = React.useContext(ToastContext);

  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const [dialogUsername, setUsername] = React.useState("");
  const [dialogFirstName, setFirstName] = React.useState('');
  const [dialogLastName, setLastName] = React.useState('');
  const [dialogEmail, setEmail] = React.useState('');
  

  const handleSubmit = async e => {
    e.preventDefault();
    console.log({ dialogUsername })
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edytuj Użytkownika</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Podaj nowe dane użytkownika.
          </DialogContentText>
          <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Nazwa użytkownika"
                variant="outlined"
                required
                value={dialogUsername}
                onChange={e => setUsername(e.target.value)}
              />
              <TextField
                label="Imie"
                variant="outlined"
                value={dialogFirstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <TextField
                label="Nazwisko"
                variant="outlined"
                value={dialogLastName}
                onChange={e => setLastName(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={dialogEmail}
                onChange={e => setEmail(e.target.value)}
              />
              <div>
                <Button type="submit" variant="contained">
                  Zapisz
                </Button>
              </div>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button onClick={handleClose}>Zapisz</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

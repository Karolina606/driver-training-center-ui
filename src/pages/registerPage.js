import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FormGroup, FormControl, InputLabel, Input, FormHelperText, TextField, Box, useTheme } from '@mui/material';
import { Button, makeStyles } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { registerUser } = useContext(AuthContext);
  const theme = useTheme();

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(email, firstName, lastName, password, password2);
  };

  const classes = useStyles();

  return (
    <section>
      <Card sx={{ minWidth: 275, px: "1rem", backgroundColor: theme.palette.third.main }}>
        <CardContent>
          <Box >
            <h1 sx={{color: theme.palette.text_primary.main}}>Zarejestruj się</h1>
            <form className={classes.root} onSubmit={handleSubmit}>
            <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                label="Imie"
                variant="outlined"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <TextField
                label="Nazwisko"
                variant="outlined"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <TextField
                label="Hasło"
                variant="outlined"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <TextField
                label="Powtórz hasło"
                variant="outlined"
                type="password"
                required
                value={password2}
                onChange={e => setPassword2(e.target.value)}
              />
              <div>
                <Button type="submit" variant="contained" sx={{backgroundColor: theme.palette.primary.main}}>
                  Zarejestruj
                </Button>
              </div>
            </form>
          </Box>
        </CardContent>
      </Card>
    </section>
  );
};

export default Register;
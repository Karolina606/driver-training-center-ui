import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Box, Grid, useTheme } from '@mui/material';
import { makeStyles } from '@material-ui/core';
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
      maxWidth: '310px',
      minWidth: '130px'
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const theme = useTheme();

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    email.length > 0 && loginUser(email, password);
  };


  return (
    <section>
      <Card sx={{ minWidth: 275, px: "1rem", backgroundColor: theme.palette.third.main }}>
        <CardContent maxWidth="sm">
          <Box >
            <h1 sx={{color: theme.palette.text_primary.main}}>Zaloguj się</h1>
            <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                required
                value={email}
                type='email'
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                label="Hasło"
                variant="outlined"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div>
                <Button type="submit" variant="contained">
                  Logowanie
                </Button>
              </div>
            </form>
          </Box>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
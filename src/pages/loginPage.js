import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Box, Grid } from '@mui/material';
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

  const classes = useStyles();
  // create state variables for each input
  // const [username, setUsername] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // const username = e.target.username.value;
    // const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };


  return (
    <section>
      <Card sx={{ minWidth: 275, px: "1rem" }}>
        <CardContent maxWidth="sm">
          {/* <form onSubmit={handleSubmit}>
        <h1>Login </h1>
        <hr />
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Enter Username" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Enter Password" />
        <button type="submit">Login</button>
      </form> */}
          <Box >
            <h1>Zaloguj się</h1>
            <form className={classes.root} onSubmit={handleSubmit}>
              <TextField
                label="Nazwa użytkownika"
                variant="outlined"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
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

              {/* <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <TextField
            label="Nazwa użytkownika"
            variant="outlined"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Hasło"
            variant="outlined"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
              Logowanie
          </Button>
        </Grid>
      </Grid> */}

            </form>
          </Box>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
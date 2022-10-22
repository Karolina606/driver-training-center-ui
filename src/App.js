import React from "react";
import "./index.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {ReactDOM, createRoot} from "react-dom/client";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import ProtectedPage from "./pages/ProtectedPage";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
        main: '#ffb300',
    },
      secondary: {
        main: '#ffffff',
    },
  },
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing(2),
//     '& .MuiTextField-root': {
//         margin: theme.spacing(1),
//         width: '300px',
//         },
//     '& .MuiButtonBase-root': {
//         margin: theme.spacing(2),
//         },
//     },
});

const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#757ce8',
//       main: '#3f50b5',
//       dark: '#002884',
//       contrastText: '#fff',
//     },
//     secondary: {
//       light: '#ff7961',
//       main: '#f44336',
//       dark: '#ba000d',
//       contrastText: '#000',
//     },
//   },
palette: {
    primary: {
      main: '#ffb300',
    },
    secondary: {
      main: '#3f51b5',
    },
  },
});

function App() {
    return ( <div className="App">
            <main>
                <Router>
                    <div className="flex flex-col min-h-screen overflow-hidden">
                        <AuthProvider>
                        <ThemeProvider theme={darkTheme}>
                             <Navbar />
                                <CssBaseline />
                                <Container maxWidth="sm" sx={{ mt: "2rem", px: "2rem"}}>
                                    <Card sx={{ minWidth: 275, px: "2rem" }}>
                                        <CardContent>
                                            <Switch>
                                                <PrivateRoute component={ProtectedPage} path="/protected" exact />
                                                <Route component={Login} path="/login"/>
                                                <Route component={Register} path="/register" />
                                                <Route component={Home} path="/" />
                                            </Switch>
                                        </CardContent>
                                    </Card>
                                </Container>
                            </ThemeProvider>
                        </AuthProvider>
                        <Footer />
                    </div>
                </Router>
            </main>
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />)
// ReactDOM.render(<App />, document.getElementById("root"));
export default App;
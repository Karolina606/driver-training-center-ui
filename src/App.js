import React, {useState} from "react";
import "./index.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from "react-router-dom";
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
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import CoursesPage from "./pages/CoursesPage";
import CategoriesPage from "./pages/CategoriesPage";
import LessonsPage from "./pages/LessonsPage";
import { AlignHorizontalCenter, SignalCellularNullSharp } from "@mui/icons-material";
import CourseStatusesPage from "./pages/CourseStatusesPage";
import UserDataContext from "./context/UserDataContext";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ToastContext from "./context/ToastContex";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
        main: '#ffb300',
    },
      secondary: {
        main: '#ffffff',
    },
    third: {
      main: '#f4511e',
    },
    archived: {
      backgroundColor: '#fffff',
    }
    // background: {
    //   default: "#e4f0e2"
    // }
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 700,
      lg: 1200,
      xl: 1536,
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
  const [userData, setUserData] = useState({});

  // const [openToast, setOpenToast] = React.useState(false);
  const [toastState, setToastState] = React.useState({'isOpen': false, 'type':'success', 'message': 'success'});
  const value = {toastState, setToastState};


  const handleClick = () => {
    setToastState({...toastState, 'isOpen': true});
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastState({...toastState, 'isOpen': false});
  };

    return ( <div className="App">
            <main>
            <Router>
                    <div className="flex flex-col min-h-screen overflow-hidden">
                    <ToastContext.Provider value={value} >
                        <AuthProvider>
                        <ThemeProvider theme={darkTheme}>
                             <Navbar />
                                <CssBaseline />
                                <Container maxWidth="md" sx={{ mt: "2rem", px: "1rem", minHeight: 'calc(100vh - 34px)'}}>
                                  <Switch>
                                      <PrivateRoute component={ProtectedPage} path="/protected" exact />
                                      <Route component={Login} path="/login"/>
                                      <Route component={Register} path="/register" />

                                      <PrivateRoute component={UsersPage} path="/users" />
                                      <PrivateRoute component={CategoriesPage} path="/categories" />
                                      <PrivateRoute component={CoursesPage} path="/courses" /> 

                                      <PrivateRoute component={LessonsPage} path="/lessons" />
                                      <PrivateRoute component={UserPage} path="/user-profile" />
                                      <PrivateRoute component={CourseStatusesPage} path="/course-statuses" />
                                      <Route component={Home} path="/" />

                                      
                                  </Switch>
                                  
                                </Container>
                                <Footer />

                                <Snackbar open={toastState.isOpen} autoHideDuration={3000} onClose={handleClose}>
                                  <Alert onClose={handleClose} severity={toastState.type} sx={{ width: '100%' }}>
                                    {toastState.message}
                                  </Alert>
                                </Snackbar>

                            </ThemeProvider>
                        </AuthProvider>
                        </ToastContext.Provider>
                        
                    </div>
                </Router>
            </main>
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />)
// ReactDOM.render(<App />, document.getElementById("root"));
export default App;
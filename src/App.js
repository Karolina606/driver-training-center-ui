import React, {useState} from "react";
import "./index.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from "react-router-dom";
import {createRoot} from "react-dom/client";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/homePage";
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import CoursesPage from "./pages/CoursesPage";
import CategoriesPage from "./pages/CategoriesPage";
import LessonsPage from "./pages/LessonsPage";
import CourseStatusesPage from "./pages/CourseStatusesPage";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ToastContext from "./context/ToastContex";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
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


  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },

        palette: {
          mode,
          primary: {
              main: '#ffb300',
          },
          secondary: {
              main: mode === 'dark' ? '#ffb300' : "#ff8f00",
          },
          third: {
            main: mode === 'dark' ? '#212121' : '#f5f5f5',
          },
          archived: {
            main: mode === 'dark' ? '#263238': "#e0e0e0",
          },
          text_primary: {
            main: mode === 'dark' ? '#ffb300' : '#000000',
          },
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
      }),
    [mode],
  );

    return ( <div className="App">
            <main>
            <Router>
                    <div className="flex flex-col min-h-screen overflow-hidden">
                    <ToastContext.Provider value={value} >
                        <AuthProvider>
                        <ColorModeContext.Provider value={colorMode}>
                        <ThemeProvider theme={theme}>
                             <Navbar theme={theme} colorMode={colorMode}/>
                                <CssBaseline />
                                <Container maxWidth="md" sx={{ mt: "2rem", px: "1rem", minHeight: 'calc(100vh - 34px)'}}>
                                  <Switch>
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
                            </ColorModeContext.Provider>
                        </AuthProvider>
                        </ToastContext.Provider>
                        
                    </div>
                </Router>
            </main>
        </div>
    );
}
createRoot(document.getElementById('root')).render(<App />)
export default App;
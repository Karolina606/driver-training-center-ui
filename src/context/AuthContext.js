import { createContext, useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ToastContext from "../context/ToastContex";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const { toastState, setToastState } = useContext(ToastContext);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [userData, setUserData] = useState(() =>
    localStorage.getItem("userData")
      ? localStorage.getItem("userData")
      : {}
  );

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loginUser = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/accounts/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      history.push("/");
      setToastState({'isOpen': true, 'type':'success', 'message': 'Zalogowano poprawnie!'});
    } else {
      alert("Something went wrong!");
      setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
    }
  };

  const fetchUserData = async () =>{
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    await axios.get( 'users/' + user?.user_id, { headers })
      .then(resp => {
        if(resp.status !== 200) {
          setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak przy pobieraniu twoich danych!'});
        }

        setUserData(resp.data);
        localStorage.setItem("userData", resp.data);
        console.log({resp});
      });
    }

  useEffect(() => {
    fetchUserData();
  }, [user]);

    const fetchGroups = async (groups) => {
      const headers = { Authorization: `Bearer ${authTokens?.access}` };
      console.log({groups});
        groups?.forEach(group => {
          axios.get(group, {headers}).then(resp => {
            setUserData({...userData, 'groups': resp.data.name}) 
            // setUserData({...userData, 'groups': resp.data.name}) 
          });
          console.log({userData});
          localStorage.setItem("userData", userData);
        });  
    }

    useEffect(() => {
      fetchGroups(userData?.groups);
    }, [userData]);
  
  const registerUser = async (username, first_name, last_name, password, password2) => {
    const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        first_name,
        last_name,
        password,
        password2
      })
    });
    if (response.status === 201) {
      history.push("/login");
      setToastState({'isOpen': true, 'type':'success', 'message': 'Zarejestrowano poprawnie'});
    } else {
      // alert("Something went wrong!");
      setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak! Sprawdź poprawność wprowadzonych danych'});
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history.push("/");

    setToastState({'isOpen': true, 'type':'success', 'message': 'Zostałeś wylogowany'})
  };

  const contextData = {
    user,
    userData,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    setUserData
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
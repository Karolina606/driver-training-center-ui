import { useContext, useEffect, useState } from "react";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";
import ToastContext from "../context/ToastContex";
import { useHistory } from "react-router-dom";

const Home = () => {
  const { authTokens, user, userData, setUserData } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${authTokens?.access}` };
  const { toastState, setToastState } = useContext(ToastContext);

  const history = useHistory();

    useEffect(() => {
      // console.log({userData});
      if (userData?.groups !== undefined && userData?.groups.length > 0 ){
        history.push('/course-statuses');
      }
    }, [userData]);

    useEffect(() => {
      console.log({user});
    }, [user]);

  return (
    <section>
      <h1>Jesteś na stronie głównej!</h1>
      {(userData?.groups === undefined || userData?.groups.length <= 0) && user !== null?
        <h3>Nie masz przypisanej roli, skontaktuj się z administratorem!</h3> :
        <></>
      }
    </section>
  );
};

export default Home;
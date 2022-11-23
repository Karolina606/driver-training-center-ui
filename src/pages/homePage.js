import { useContext, useEffect, useState } from "react";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";
import ToastContext from "../context/ToastContex";
import { useHistory } from "react-router-dom";
const Home = () => {
  // const { user } = useContext(AuthContext);
  const { authTokens, user, userData, setUserData } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${authTokens?.access}` };
  const { toastState, setToastState } = useContext(ToastContext);
  // const { userData, setUserData } = useContext(UserDataContext);

  const history = useHistory();

  // const fetchUserData = async () =>{
  //   await axios.get( 'users/' + user?.user_id, { headers })
  //     .then(resp => {
  //       setUserData(resp.data);
  //       console.log({resp});
  //     });
  //   }

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  //   const fetchGroups = async (groups) => {
  //     console.log({groups});
  //       groups?.forEach(group => {
  //         axios.get(group, {headers}).then(resp => {setUserData({...userData, 'groups': resp.data.name}) });
  //         console.log({userData});
  //       });  
  //   }

  //   useEffect(() => {
  //     fetchGroups(userData?.groups);
  //   }, [userData]);

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
      {(userData?.groups === undefined || userData?.groups === []) && user !== null?
        <h3>Nie masz przypisanej roli, skontaktuj się z administratorem!</h3> :
        <></>
      }
    </section>
  );
};

export default Home;
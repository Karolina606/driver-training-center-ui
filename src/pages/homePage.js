import { useContext, useEffect, useState } from "react";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";

const Home = () => {
  // const { user } = useContext(AuthContext);
  const { authTokens, user, userData, setUserData } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${authTokens?.access}` };
  // const { userData, setUserData } = useContext(UserDataContext);

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
      console.log({userData});
    }, [userData]);

  return (
    <section>
      {/* {user && <UserInfo user={user} />} */}
      <h1>Jesteś na stronie głównej!</h1>
    </section>
  );
};

export default Home;
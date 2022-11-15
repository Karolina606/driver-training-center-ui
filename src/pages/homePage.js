import { useContext, useEffect } from "react";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";
import UserDataContext from "../context/UserDataContext";
import axios from "axios";

const Home = () => {
  // const { user } = useContext(AuthContext);
  const { authTokens, user } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${authTokens?.access}` };
  const { userData, setUserData } = useContext(UserDataContext);


  const fetchUserData = async () =>{
    await axios.get( 'users/' + user?.user_id, { headers })
      .then(resp123 => {
        setUserData(resp123.data);
      });
  }


  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   console.log({userData});
  // }, [userData]);

  return (
    <section>
      {/* {user && <UserInfo user={user} />} */}
      <h1>Jesteś na stronie głównej!</h1>
    </section>
  );
};

export default Home;
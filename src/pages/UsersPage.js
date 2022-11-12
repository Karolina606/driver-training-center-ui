import UserCard from "../components/UserCard";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, {baseURL} from '../utils/useAxios'


const UsersPage = () => {

    const { user, logoutUser, authTokens } = useContext(AuthContext);


    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'users'
    });

    useEffect(() => {
        if(response !== null ){
            console.log({response});
        }
      }, [response]);


  return (
    <section>
      {/* {user && <UserInfo user={user} />} */}
      <h1>Użytkownicy:</h1>

         {response?.map((user1) => (
            <UserCard user={user1}></UserCard>
        ))}
    </section>
  );
};

export default UsersPage;
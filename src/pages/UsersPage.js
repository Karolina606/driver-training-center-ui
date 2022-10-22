import UserCard from "../components/UserCard";
import UserInfo from "../components/UserInfo";
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
      {user && <UserInfo user={user} />}
      <h1>You are on users page!</h1>

         {response?.map((user1) => (
            <UserCard username={user1.username} email={user1.email}></UserCard>
        ))}
    </section>
  );
};

export default UsersPage;
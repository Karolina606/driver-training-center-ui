import UserCard from "../components/UserCard";
import UserInfo from "./UserPage";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect, useState } from "react";
import useAxios, {baseURL} from '../utils/useAxios';
import ToastContext from "../context/ToastContex";


const UsersPage = () => {

    const { user, logoutUser, authTokens } = useContext(AuthContext);
    const { toastState, setToastState } = useContext(ToastContext);

    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'users'
    });
    const [users, setUsers] = useState([]);

    const updateUsers= (newValues) => {
      setUsers(newValues);
    }

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            updateUsers(response);
        }
      }, [response]);


  return (
    <section>
      {/* {user && <UserInfo user={user} />} */}
      <h1>Użytkownicy:</h1>

         {users?.map((user1) => (
            <UserCard user={user1} updateUsers={updateUsers}></UserCard>
        ))}
    </section>
  );
};

export default UsersPage;
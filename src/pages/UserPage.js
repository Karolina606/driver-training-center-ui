import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useContext } from "react";
import useAxios, {baseURL} from '../utils/useAxios'
import AuthContext from "../context/AuthContext";

const UserPage = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const { response, loading, error } = useAxios({
      method: 'get',
      url: 'users/' + user.user_id
  });

  useEffect(() => {
      if(response !== null ){
          console.log({response});
      }
    }, [response]);

  console.log({response})
    return (
      <Box>
        <h1>Hello, {response?.username}</h1>
        <Typography>{response?.first_name} {response?.last_name}</Typography>
        <Typography>{response?.email}</Typography>
        <Typography>{response?.groups}</Typography>
      </Box>
    );
  }
  
  export default UserPage;
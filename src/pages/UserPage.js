import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useContext, useState } from "react";
import useAxios, {baseURL} from '../utils/useAxios'
import AuthContext from "../context/AuthContext";
import axios from "axios";

const UserPage = () => {
  const { user, authTokens } = useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };

  const { response, loading, error } = useAxios({
      method: 'get',
      url: 'users/' + user.user_id
  });

  useEffect(() => {
      if(response !== null ){
          console.log({response});
      }
    }, [response]);

    const [groupsNames, setGroupNames] = useState([]);

    const fetchGroups = async (groups) => {
      console.log({groups});
        groups?.forEach(group => {
          axios.get(group, {headers}).then(resp => {setGroupNames([...groupsNames ,resp.data.name]) });
          console.log({groupsNames});
        });  
    }

    useEffect(() => {
      fetchGroups(response?.groups);
    }, [response]);

  console.log({response})
    return (
      <Box>
        <h1>Hello, {response?.username}</h1>
        <Typography>{response?.first_name} {response?.last_name}</Typography>
        <Typography>{response?.email}</Typography>
        <Typography>{groupsNames}</Typography>
      </Box>
    );
  }
  
  export default UserPage;
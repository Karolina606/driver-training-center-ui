// import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useState, useEffect } from 'react';
import axios from 'axios';

export const baseURL = "http://127.0.0.1:8000/";
axios.defaults.baseURL = "http://127.0.0.1:8000/";

const useAxios = ({ url, method, body = null, headers = null }) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setloading] = useState(true);
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    headers =  JSON.stringify({ Authorization: `Bearer ${authTokens?.access}` });
    body =  JSON.stringify({});

    
    const axiosInstance = axios.create({
          baseURL,
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        });
      
      axiosInstance.interceptors.request.use(async req => {
        const user = jwt_decode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    
        if (!isExpired) return req;
    
        const response = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: authTokens.refresh
        });
    
        localStorage.setItem("authTokens", JSON.stringify(response.data));
    
        setAuthTokens(response.data);
        setUser(jwt_decode(response.data.access));
    
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
      });

    const fetchData = () => {
      axiosInstance[method](url, JSON.parse(headers), JSON.parse(body))
            .then((res) => {
                setResponse(res.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [method, url, body, headers]);

    return { response, error, loading };
};

export default useAxios;
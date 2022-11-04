import LessonCard from "../components/LessonCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, {baseURL} from '../utils/useAxios'


const LessonsPage = () => {
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'lessons'
    });

    useEffect(() => {
        if(response !== null ){
            console.log({response});


        }
      }, [response]);


  return (
    <section>
      <h1>You are on lessons page!</h1>
         {response?.map((lesson) => (
            <LessonCard lesson={lesson}/>
        ))}
    </section>
  );
};

export default LessonsPage;
import CourseCard from "../components/CourseCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, {baseURL} from '../utils/useAxios'


const CoursesPage = () => {
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'courses'
    });

    useEffect(() => {
        if(response !== null ){
            console.log({response});
        }
      }, [response]);


  return (
    <section>
      <h1>You are on courses page!</h1>

         {response?.map((course) => (
            <CourseCard driving_license_category={course.driving_license_category} start_date={course.start_date}/>
        ))}
    </section>
  );
};

export default CoursesPage;
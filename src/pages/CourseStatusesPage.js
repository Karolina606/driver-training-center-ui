import CourseCard from "../components/CourseCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, { baseURL } from '../utils/useAxios';
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DialogContext from "../context/DialogContex";
import AddCourse from "../components/forms/AddCourse";
import { useState } from "react";
import CourseStatusCard from "../components/CourseStatusCard";


const CourseStatusesPage = () => { 
  const [open, setOpen] = useState(false);
  const { response, loading, error } = useAxios({
    method: 'get',
    url: 'student_course_status'
  });

  const [courseStatuses, setCourseStatuses] = useState([]);

    const updateCourseStatuses = (newValues) => {
      console.log({newValues});
      setCourseStatuses(newValues);
    }

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            setCourseStatuses(response);
        }
      }, [response]);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };



  return (<>
    <section>
      <h1>Kursanci:</h1>

      {courseStatuses?.map((courseStatus) => (
        <CourseStatusCard courseStatus={courseStatus} updateCourseStatuses={updateCourseStatuses} />
      ))}
    </section>

    {/* <DialogContext.Provider value={[open, setOpen]}>
      <AddCourse updateCourseStatuses={updateCourseStatuses}/>
    </DialogContext.Provider> */}
  </>
  );
};

export default CourseStatusesPage;
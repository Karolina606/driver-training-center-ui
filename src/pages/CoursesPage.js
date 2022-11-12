import CourseCard from "../components/CourseCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, { baseURL } from '../utils/useAxios';
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DialogContext from "../context/DialogContex";
import AddCourse from "../components/forms/AddCourse";
import { useState } from "react";


const CoursesPage = () => { 
  const [open, setOpen] = useState(false);
  const { response, loading, error } = useAxios({
    method: 'get',
    url: 'courses'
  });

  const [courses, setCourses] = useState([]);

    const updateCourses = (newValues) => {
      setCourses(newValues);
    }

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            setCourses(response);
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
      <h1>Kursy:</h1>

      {courses?.map((course) => (
        <CourseCard course={course} updateCourses={updateCourses} />
      ))}
    </section>

    <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClickOpen}>
      <AddIcon />
    </Fab>

    <DialogContext.Provider value={[open, setOpen]}>
      <AddCourse updateCourses={updateCourses}/>
    </DialogContext.Provider>
  </>
  );
};

export default CoursesPage;
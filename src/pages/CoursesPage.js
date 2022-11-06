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

  useEffect(() => {
    if (response !== null) {
      console.log({ response });
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
      <h1>You are on courses page!</h1>

      {response?.map((course) => (
        <CourseCard course={course} />
      ))}
    </section>

    <Fab color="primary" aria-label="add" sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={handleClickOpen}>
      <AddIcon />
    </Fab>

    <DialogContext.Provider value={[open, setOpen]}>
      <AddCourse />
    </DialogContext.Provider>
  </>
  );
};

export default CoursesPage;
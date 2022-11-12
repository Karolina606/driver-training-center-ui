import LessonCard from "../components/LessonCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect } from "react";
import useAxios, {baseURL} from '../utils/useAxios'
import AddLesson from "../components/forms/AddLesson";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DialogContext from "../context/DialogContex";
import AddCourse from "../components/forms/AddCourse";
import { useState } from "react";


const LessonsPage = () => {
  const [open, setOpen] = useState(false);
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'lessons'
    });
    const [lessons, setLessons] = useState([]);

    const updateLessons = (newValues) => {
      setLessons(newValues);
    }

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            setLessons(response);
        }
      }, [response]);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };


  return ( <>
    <section>

      <h1>Lekcje:</h1>
         {lessons?.map((lesson) => (
            <LessonCard lesson={lesson} updateLessons={updateLessons}/>
        ))}

    <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClickOpen}>
      <AddIcon />
    </Fab>
    </section>

    <DialogContext.Provider value={[open, setOpen]}>
      <AddLesson updateLessons={updateLessons}/>
    </DialogContext.Provider>
  </>
  );
};

export default LessonsPage;
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

    useEffect(() => {
        if(response !== null ){
            console.log({response});


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
      <h1>You are on lessons page!</h1>
         {response?.map((lesson) => (
            <LessonCard lesson={lesson}/>
        ))}
    </section>

    <Fab color="primary" aria-label="add" sx={{ position: 'absolute', bottom: 16, right: 16 }} onClick={handleClickOpen}>
      <AddIcon />
    </Fab>

    <DialogContext.Provider value={[open, setOpen]}>
      <AddLesson />
    </DialogContext.Provider>
  </>
  );
};

export default LessonsPage;
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
import UserDataContext from "../context/UserDataContext";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import axios from "axios";
import ToastContext from "../context/ToastContex";


const LessonsPage = () => {
  const [open, setOpen] = useState(false);
  const { userData, setUserData, authTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'lessons'
    });
    const { toastState, setToastState } = useContext(ToastContext);

    const [lessons, setLessons] = useState([]);
    const [lessonsByDate, setLessonsByDate] = useState({});
    const [dates, setDates] = useState([]);
    const [finishedLessons, setFinishedLessons] = useState([]);
    const weekday = ["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"];

    const updateLessons = (newValues) => {
      setLessons(newValues);
    }

    const fetchFinishedLessons = async () => {
      await axios.get('/lessons/get_ended_lessons/', { headers }).then(resp => {console.log({resp}); setFinishedLessons(resp.data)});
    }

    useEffect(() => {
      fetchFinishedLessons();
    }, []);

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            setLessons(response);
        }
        fetchFinishedLessons();
      }, [response]);


    useEffect(() => {
      lessons?.forEach((lesson) => {
        const date = lesson.start_date.split('T')[0];

        if(lessonsByDate[date] === undefined){
          lessonsByDate[date] = [lesson];
        }else{
          var currentIds = [];
          lessonsByDate[date].forEach((lesson) => currentIds.push(lesson.id));

          if( currentIds.indexOf(lesson.id) === -1){
            lessonsByDate[date].push(lesson);
          }
          console.log({lessonsByDate});
        }
        setLessonsByDate(lessonsByDate);


        var k = setDates(Object.keys(lessonsByDate));
        console.log({dates});

        var l = lessonsByDate[date];
        console.warn({l});
      });
      console.warn({lessonsByDate});

    }, [lessons]);

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
            <LessonCard lesson={lesson} updateLessons={updateLessons} isArchived={""}/>
        ))}

        {/* {dates?.map((date) => (
          <>
            <Typography sx={{mt:"3rem"}}>{weekday[(new Date(date)).getDay()]}, {date}</Typography >
            
              {lessonsByDate[date]?.map((lesson) => (
              <LessonCard lesson={lesson} updateLessons={updateLessons} isArchived={""}/>
              ))}
          </>
          )
        )} */}

      <Accordion sx={{boxShadow: "none" , backgroundImage: "none"}}>
          <AccordionSummary sx={{ mt: "4rem"}}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
          >
              <Typography>Zakończone lekcje:</Typography>
          </AccordionSummary>
          <AccordionDetails>
              {finishedLessons?.map((lesson) => (
              <LessonCard lesson={lesson} updateLessons={updateLessons} isArchived={"archived"}/>
          ))}
          </AccordionDetails>
      </Accordion>

    </section>

    {userData?.groups?.includes("student") == false ?
      <>
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleClickOpen}>
          <AddIcon />
        </Fab>

        <DialogContext.Provider value={[open, setOpen]}>
          <AddLesson updateLessons={updateLessons}/>
        </DialogContext.Provider>
      </>
      :
      <></>
    }
  </>
  );
};

export default LessonsPage;
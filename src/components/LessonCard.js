
import { Container, Card, CardContent, Typography, Grid, IconButton, useTheme, Chip } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UserDataContext from '../context/UserDataContext';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogContext from '../context/DialogContex';
import AddLesson from './forms/AddLesson';
import ToastContext from "../context/ToastContex";
import RemoveIcon from '@mui/icons-material/Remove';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const LessonCard = (props) => {
    const { authTokens, setUser, setAuthTokens, userData, setUserData } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const [open, setOpen] = useState(false);
    const { toastState, setToastState } = useContext(ToastContext);
    const theme = useTheme();

    const [instructor, setInstructor] = useState("");
    const [course, setCourse] = useState([]);
    const type = props.lesson.type;
    const start_date = props.lesson.start_date.replace('Z', '');
    const end_date = props.lesson.end_date.replace('Z', '');
    const [courseStatus, setCourseStatus] = useState([]);
    const [students2, setStudents2] = useState([]);
    const [course2, setCourse2] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [lessons, setLessons] = useState([]);


    const updateStudents2 = (newValue) =>{
        setStudents2(newValue);
    }

    const fetchInstructor = async (userId) => {
        if( userId !== undefined){
            await axios.get( 'users/' + userId + "/name_of_user/", { headers }).then(resp => { setInstructor(resp.data.first_name + " " + resp.data.last_name) });
            console.log(props);
        }
    }

    const fetchCourse = async (courseId) => {
        if(courseId !== undefined){
            await axios.get("/courses/" + courseId, { headers }).then(resp => { console.log({resp}); setCourse( resp.data) });
        }
        // console.log({course});
    }

    const fetchCourseStatus = (lesson_id) => {
        axios.get("/student_course_status/" + lesson_id + "/get_by_lesson_id/", { headers }).then(resp => { setCourseStatus(resp.data) });
    }

    const fetchStudentsDetails = async (student) => {
        console.warn({student})
         await axios.get('users/' + student.student_id + "/name_of_user/", { headers })
         .then(resp => { 
           student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
           console.log({student});
           setStudents2(students2 => [...students2, student]);
         });
       }

    const fetchLessons = async () => {
        await axios.get("/lessons/", { headers }).then(resp => {props.updateLessons(resp.data); setLessons(resp.data) });
    }

    const fetchCourseDetails = async (course) => {
        // headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };
        console.log({course});
        await axios.get(course.driving_license_category, { headers })
         .then(resp => { 
           course['course_details'] = resp.data.name +  ", " + format(new Date(course.start_date.replace(':00Z', '').replace('T', ', ')), 'dd.MM.yyyy HH:mm');
           setCourse2([...course2, course]);
         });
       }

    useEffect(() => {
        var instructorId;
        if (props.lesson.instructor !== undefined){
            instructorId = props.lesson.instructor;
        }else{
            instructorId = props.lesson.instructor_id;
        }
        fetchInstructor(instructorId);

        var courseId;
        if (props.lesson.course !== undefined){
            courseId = props.lesson.course;
        }else{
            courseId = props.lesson.course_id;
        }
        fetchCourse(courseId);

        fetchCourseStatus(props.lesson?.id);
        // fetchStudentsDetails();
    }, [lessons]);


    useEffect(() => {
        fetchInstructor(props.lesson?.instructor);
        // fetchCourse(props.lesson.course);
        // fetchCourseStatus(props.lesson.id);
        console.log({props});
    }, [props]);

    useEffect(() => {
        setStudents2([]);
        courseStatus?.forEach(student => {
            fetchStudentsDetails(student);
        });
    }, [courseStatus]);

    useEffect(() => {
        if(course !== undefined && course !== '' ){
         fetchCourseDetails(course);
        }
        console.log({course});
    }, [course]);
    
    const handleEdit = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const handleDelete = async e => {
        e.preventDefault();
        console.log({ props });
        console.log({ headers });

        await axios.delete("lessons/" + props.lesson.id + '/', { headers }).then(resp => {
            if(resp.status === 204) {
                setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie usunięto lekcję'});
              }else {
                setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
              }
        });
        setRefresh(true);
    };

    const handleRemoveStudent = async (e, status) => {
        e.preventDefault();
        console.log({ props });
        console.log({ headers });

        await axios.delete("/student_course_status/" + status.id +  "/delete_lesson_from_stu_course/" + props.lesson.id + "/", { headers }).then(resp => {
            console.warn({resp})
            if(resp.status === 203) {
                setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie usunięto kursanta'});
              }else {
                setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
              }
        });
        fetchLessons();
        // setRefresh(true);
    };

    useEffect(() => {
        fetchLessons();
        setRefresh(false);
   }, [refresh]);



    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }} className={props.isArchived}>
            <Card sx={{ minWidth: 130, 
                backgroundColor: props.isArchived === "archived" ? theme.palette.archived.main : theme.palette.third.main 
                }}>
                <CardContent sx={{px: "2rem"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kurs: {course.course_details}
                            </Typography>
                            <Typography color="text.secondary">
                                Instruktor: {instructor}
                            </Typography>
                            <Typography color="text.secondary">
                                Data rozpoczęcia: {format(new Date(start_date), 'dd.MM.yyyy, HH:mm')}
                            </Typography>
                            <Typography color="text.secondary">
                                Data zakończenia: {format(new Date(end_date), 'dd.MM.yyyy, HH:mm')}
                            </Typography>

                            <Typography>
                                Typ: 
                                {type === 'P' ?
                                    <Chip sx={{m: 1}} icon={<DirectionsCarIcon sx={{ fontSize:'medium'}}/>} label="Praktyczny" color="secondary" variant="outlined" />
                                    :
                                    <Chip sx={{m: 1}} icon={<AutoStoriesIcon sx={{ fontSize:'medium'}}/>} label="Teoretyczny" color="success" variant="outlined" />
                                }
                            </Typography>
                        </Grid>


                        {userData?.groups?.includes("student") === false && props.isArchived !== "archived" ?
                            <Grid item xs={2} sx={{ m: "auto" }} >
                                <IconButton aria-label="delete" size="large" sx={{ my: "auto" }} onClick={handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton aria-label="edit" size="large" sx={{ my: "auto" }} onClick={handleEdit}>
                                    <EditIcon />
                                </IconButton>
                            </Grid>
                            :
                            <></>
                        }

                    </Grid>

                </CardContent>

                <Accordion 
                sx={{backgroundColor: props.isArchived === "archived" ? theme.palette.archived.main : theme.palette.third.main }}
                >
                        <AccordionSummary sx={{ px: "2rem",  background: theme.palette.primary.main, color:"black" }}
                            expandIcon={<ExpandMoreIcon sx={{color:"black"}} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Kursanci:</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: "2rem"}}>

                            {students2?.map((status) => (
                                <Grid container spacing={2}>
                                    <Grid item xs={10} sx={{ m: "auto" }} >
                                        <Typography>
                                            Student: {status.student_details}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ m: "auto" }} >
                                        <IconButton aria-label="edit" size="midium" sx={{ my: "auto" }} onClick={e => handleRemoveStudent(e, status)}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                        ))}
                        </AccordionDetails>
                    </Accordion>
            </Card>
        </Container>

        {userData?.groups?.includes("student") == false ?
            <DialogContext.Provider value={[open, setOpen]}>
                <AddLesson updateLessons={props.updateLessons} lessonToEdit={props.lesson} updateStudents2={updateStudents2}/>
            </DialogContext.Provider> :
            <></>
        }
    </>
}

export default LessonCard;
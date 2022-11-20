
import { Container, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
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

const LessonCard = (props) => {
    const { authTokens, setUser, setAuthTokens, userData, setUserData } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const [open, setOpen] = useState(false);

    const [instructor, setInstructor] = useState("");
    const [course, setCourse] = useState([]);
    const type = props.lesson.type;
    const start_date = props.lesson.start_date.replace('Z', '');
    const end_date = props.lesson.end_date.replace('Z', '');
    const [courseStatus, setCourseStatus] = useState([]);
    const [students2, setStudents2] = useState([]);
    const [course2, setCourse2] = useState([]);

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
         await axios.get('users/' + student.student_id + "/name_of_user/", { headers })
         .then(resp => { 
           student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
           console.log({student});
           setStudents2(students2 => [...students2, student]);
         });
       }

       const fetchLessons = async () => {
        await axios.get("/lessons/", { headers }).then(resp => {props.updateLessons(resp.data) });
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
    }, []);


    useEffect(() => {
        fetchInstructor(props.lesson?.instructor);
        // fetchCourse(props.lesson.course);
        // fetchCourseStatus(props.lesson.id);
        console.log({props});
    }, [props]);

    useEffect(() => {
        // setStudents2([]);
        courseStatus?.forEach(student => {
            fetchStudentsDetails(student);
        });
    }, [courseStatus]);

    useEffect(() => {
         fetchCourseDetails(course);
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

        await axios.delete("lessons/" + props.lesson.id + '/', { headers }).then(e => {
            fetchLessons();
        });
    };


    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }} className={props.isArchived}>
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{px: "2rem" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kurs: {course.course_details}
                            </Typography>
                            <Typography color="text.secondary">
                                Instruktor: {instructor}
                            </Typography>
                            <Typography color="text.secondary">
                                Typ: {type}
                            </Typography>
                            <Typography color="text.secondary">
                                Data rozpoczęcia: {format(new Date(start_date), 'dd.MM.yyyy, HH:mm')}
                            </Typography>
                            <Typography color="text.secondary">
                                Data zakończenia: {format(new Date(end_date), 'dd.MM.yyyy, HH:mm')}
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

                <Accordion>
                        <AccordionSummary sx={{ px: "2rem", background:"#ffb300", color:"black" }}
                            expandIcon={<ExpandMoreIcon sx={{color:"black"}} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Kursanci:</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: "2rem"}}>
                            {students2?.map((status) => (
                            <Typography>
                                Student: {status.student_details}
                            </Typography>
                        ))}
                        </AccordionDetails>
                    </Accordion>
            </Card>
        </Container>

        {userData?.groups?.includes("student") == false ?
            <DialogContext.Provider value={[open, setOpen]}>
                <AddLesson updateLessons={props.updateLessons} lessonToEdit={props.lesson}/>
            </DialogContext.Provider> :
            <></>
        }
    </>
}

export default LessonCard;
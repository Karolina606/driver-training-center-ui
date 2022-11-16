
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
    const [course, setCourse] = useState("");
    const type = props.lesson.type;
    const start_date = props.lesson.start_date.replace('Z', '');
    const end_date = props.lesson.end_date.replace('Z', '');
    const [courseStatus, setCourseStatus] = useState([]);
    const [students2, setStudents2] = useState([]);

    const fetchInstructor = (userId) => {
        axios.get( 'users/' + props.lesson.instructor + "/name_of_user/", { headers }).then(resp => { setInstructor(resp.data.first_name + " " + resp.data.last_name) });
    }

    const fetchCourse = (courseId) => {
        axios.get("/courses/" + courseId, { headers }).then(resp => { setCourse(resp.data.id + " " + format(new Date(resp.data.start_date.replace('Z', '')), 'dd.MM.yyyy, HH:mm')) });
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

    useEffect(() => {
        fetchInstructor(props.lesson.instructor);
        fetchCourse(props.lesson.course);
        fetchCourseStatus(props.lesson.id);
    }, []);


    useEffect(() => {
        fetchInstructor(props.lesson.instructor);
        // fetchCourse(props.lesson.course);
        // fetchCourseStatus(props.lesson.id);
    }, [props]);

    useEffect(() => {
        // setStudents2([]);
        courseStatus?.forEach(student => {
            fetchStudentsDetails(student);
        });
    }, [courseStatus]);
    
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
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{px: "2rem" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kurs: {course}
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


                        {userData?.groups?.includes("student") == false ?
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
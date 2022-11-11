
import { Container, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LessonCard = (props) => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };

    const [instructor, setInstructor] = useState("");
    const [course, setCourse] = useState("");
    const type = props.lesson.type;
    const start_date = props.lesson.start_date.replace('Z', '');
    const end_date = props.lesson.end_date.replace('Z', '');
    const [courseStatus, setCourseStatus] = useState([]);
    const [students2, setStudents2] = useState([]);

    const fetchInstructor = (userId) => {
        const controller = new AbortController();
        axios.get("/users/" + props.lesson.instructor, { headers }).then(resp => { setInstructor(resp.data.first_name + " " + resp.data.last_name) });
        controller.abort();
    }

    const fetchCourse = (courseId) => {
        axios.get("/courses/" + courseId, { headers }).then(resp => { setCourse(resp.data.id + " " + format(new Date(resp.data.start_date.replace('Z', '')), 'dd.MM.yyyy, HH:mm')) });
    }

    const fetchCourseStatus = (lesson_id) => {
        axios.get("/student_course_status/" + lesson_id + "/get_by_lesson_id/", { headers }).then(resp => { setCourseStatus(resp.data) });
    }

    const fetchStudentsDetails = async (student) => {
         await axios.get('users/' + student.student_id, { headers })
         .then(resp => { 
           student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
           console.log({student});
           setStudents2(students2 => [...students2, student]);
         });
       }

    useEffect(() => {
        fetchInstructor(props.lesson.instructor);
        fetchCourse(props.lesson.course);
        fetchCourseStatus(props.lesson.id);
    }, []);

    useEffect(() => {
        courseStatus?.forEach(student => {
            fetchStudentsDetails(student);
        });
    }, [courseStatus]);


    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{px: "2rem" }}>
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
                </CardContent>

                <Accordion>
                        <AccordionSummary sx={{ px: "2rem", background:"#ffb300", color:"black" }}
                            expandIcon={<ExpandMoreIcon />}
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
    </>
}

export default LessonCard;
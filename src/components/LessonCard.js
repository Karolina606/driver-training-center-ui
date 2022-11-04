
import {Container, Card, CardContent, Typography} from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext, useState } from 'react';
import { format } from 'date-fns';

const LessonCard = (props) => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };

    const [instructor, setInstructor] = useState("");
	const [course, setCourse] = useState("");
    const type = props.lesson.type;
	const start_date = props.lesson.start_date.replace('Z', '');
	const end_date =props.lesson.end_date.replace('Z', '');
    const [courseStatus, setCourseStatus] = useState([]);

    const fetchInstructor = (userId) => {
        axios.get("/users/" + userId, {headers}).then(resp => {setInstructor(resp.data.first_name + " " + resp.data.last_name)});
    }

    const fetchCourse = (courseId) => {
        axios.get("/courses/" + courseId, {headers}).then(resp => {setCourse(resp.data.id + " " + format(new Date(resp.data.start_date.replace('Z', '')), 'dd.MM.yyyy, HH:mm'))});
    }

    const fetchCourseStatus = (lesson_id) => {
        axios.get("/student_course_status/" + lesson_id + "/get_by_lesson_id/", {headers}).then(resp => {console.log(resp);setCourseStatus(resp.data)});
    }

    fetchInstructor(props.lesson.instructor);
    fetchCourse(props.lesson.course);
    fetchCourseStatus(props.lesson.id)

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem"}}>
            <Card sx={{ minWidth: 130, px: "1rem" }}>
                <CardContent>
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
                <Typography color="text.secondary">
                    Statusy:
                </Typography>
                {courseStatus?.map((status) => (
                    <Typography>
                        Student id: {status.student_id}
                    </Typography>
                ))}
                </CardContent>
            </Card>
        </Container>
    </>
} 

export default LessonCard;

import { Container, Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import UserDataContext from '../context/UserDataContext';
import axios from 'axios';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DialogContext from '../context/DialogContex';
import EditCourseStatus from './forms/EditCourseStatus';

const CourseStatusCard = (props) => {
    const { authTokens, setUser, setAuthTokens, userData, setUserData } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const [open, setOpen] = useState(false);
    // const { userData, setUserData } = useContext(UserDataContext);

    const [course, setCourse] = useState({});
    const [student, setStudent] = useState({});
    const [category, setCategory] = useState({});

    const [courseDetails, setCourseDetails] = useState("");
    const [studentDetails, setStudentDetails] = useState("");
    const [categoryDetails, setCategoryDetails] = useState("");

    const [courseStatuses, setCourseStatuses] = useState([]);



    const fetchCourse = async (course_id) => {
        await axios.get("/courses/" + course_id, { headers }).then(resp => { setCourse(resp.data); setCourseDetails(resp.data.start_date.replace(':00Z', '').replace('T', ', ')) });
    }


    const fetchCourseStatuses = async () => {
        await axios.get('/student_course_status/', { headers }).then(resp => { console.log(resp.data); setCourseStatuses(resp.data); props.updateCourseStatuses(resp.data) });
    }

    const fetchStudent = async (student_id) => {
        await axios.get('users/' + student_id + "/name_of_user/", { headers })
            .then(resp => {
                // student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
                console.log({ student });
                setStudent(resp.data);
                setStudentDetails(resp.data.username + ": " + resp.data.first_name + " " + resp.data.last_name);
            });
    }

    const fetchCategory = (category) => {
        axios.get(category, { headers }).then(resp => { setCategoryDetails(resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time) });
    }

    useEffect(() => {
        fetchStudent(props.courseStatus.student);
        fetchCourse(props.courseStatus.course);
        console.log({props});
        console.log({student});
        console.log({course});
    }, []);

    useEffect(() => {
        fetchCategory(course.driving_license_category);
    }, [course]);


    const handleEdit = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const handleDelete = async e => {
        e.preventDefault();
        // console.log({ id });
        // console.log({ headers });

        await axios.delete("student_course_status/" + props.courseStatus.id, { headers }).then(e => {
            fetchCourseStatuses();
        });
    };

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{ px: "2rem" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h6" component="div" sx={{ mb: 0.5, color: '#ffb300'}}>
                                {studentDetails}
                            </Typography>
                            <Typography color="text.secondary">
                                Kurs: {categoryDetails}
                            </Typography>
                            <Typography color="text.secondary">
                                {/* Data rozpoczęcia: {courseDetails !== undefined ? format(new Date(courseDetails), 'dd.MM.yyyy HH:mm'): "date"} */}
                                Data rozpoczęcia: {courseDetails}
                            </Typography>
                            <Typography component="div" color="text.secondary">
                                Wpłacono: {props.courseStatus?.paid_money} zł
                            </Typography>
                            <Typography component="div" color="text.secondary">
                                Opłacono: {props.courseStatus?.is_course_paid ? ' Tak': ' Nie'}
                            </Typography>
                            <Typography component="div" color="text.secondary">
                                Zdano egzamin teoretyczny wewnętrzny: {props.courseStatus?.is_internal_theoretical_exam_passed ? ' Tak': ' Nie'}
                            </Typography>
                            <Typography component="div" color="text.secondary">
                                Zdano egzamin praktyczny wewnętrzny: {props.courseStatus?.is_internal_practical_exam_passed? ' Tak': ' Nie'}
                            </Typography>
                        </Grid>

                        {userData?.groups?.includes("student")  == false ?
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

            </Card>
        </Container>

        {userData?.groups?.includes("student")  == false ?
            <DialogContext.Provider value={[open, setOpen]}>
                <EditCourseStatus updateCourseStatuses={props.updateCourseStatuses} courseStatusToEdit={props.courseStatus}/>
            </DialogContext.Provider>
            :
            <></>
        }
    </>
}

export default CourseStatusCard;
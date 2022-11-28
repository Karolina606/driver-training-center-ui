
import { Container, Card, CardContent, Typography, IconButton, Grid, useTheme } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogContext from '../context/DialogContex';
import EditCourseStatus from './forms/EditCourseStatus';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import ToastContext from "../context/ToastContex";

const CourseStatusCard = (props) => {
    const { authTokens, setUser, setAuthTokens, userData, setUserData } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const [open, setOpen] = useState(false);
    const { toastState, setToastState } = useContext(ToastContext);
    const theme = useTheme();

    const [course, setCourse] = useState({});
    const [student, setStudent] = useState({});
    const [category, setCategory] = useState({});

    const [courseDetails, setCourseDetails] = useState("");
    const [studentDetails, setStudentDetails] = useState("");
    const [categoryDetails, setCategoryDetails] = useState("");

    const [courseStatuses, setCourseStatuses] = useState([]);
    const [courseProgress, setCourseProgress] = useState({});



    const fetchCourse = async (course_id) => {
        await axios.get("/courses/" + course_id, { headers }).then(resp => { setCourse(resp.data); setCourseDetails(resp.data.start_date.replace('+01:00', '').replace('T', ', ')) });
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
        axios.get(category, { headers }).then(resp => { setCategoryDetails(resp.data) });
    }

    const fetchCourseStatusesProgress = async (statusId) => {
        await axios.get('/student_course_status/' + statusId + '/get_progress' , { headers }).then(resp => { console.warn({resp}); setCourseProgress(resp.data) });
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

    useEffect(() => {
            fetchCourseStatusesProgress(props.courseStatus.id)
    }, []);


    const handleEdit = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };

    const handleDelete = async e => {
        e.preventDefault();

        await axios.delete("student_course_status/" + props.courseStatus.id, { headers }).then(resp => {
            if(resp.status === 204) {
                setToastState({'isOpen': true, 'type':'success', 'message': 'Popranie usunięto status przebiegu kursu'});
              }else {
                setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
              }

            fetchCourseStatuses();
        });
    };

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem"}} >
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{ px: "2rem", 
                backgroundColor: theme.palette.third.main 
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h6" component="div" sx={{ mb: 0.5, 
                                color: theme.palette.text_primary.main
                                }}>
                                {studentDetails}
                            </Typography>
                            <Typography >
                                Kurs: {categoryDetails.name + " T:" + categoryDetails.theory_full_time + " P:" + categoryDetails.practice_full_time}
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

                    <Grid container spacing={2}>
                        <Grid container item xs={6} sx={{ my: "1rem" }} direction="column" alignItems="center" justifyContent="center">
                            <Typography component="div" sx={{ mb: "1rem" }}>
                                Teoria:
                            </Typography>
                            <CircularProgressWithLabel value={courseProgress.theory_perc} percentage={courseProgress.theory_perc}/>
                            <CircularProgressWithLabel value={courseProgress.theory_perc} hours={ {'done':courseProgress.theory, 'full': categoryDetails.theory_full_time} } />
                        </Grid>

                        <Grid container item xs={6} sx={{ my: "1rem" }} direction="column" alignItems="center" justifyContent="center" >
                            <Typography component="div" sx={{ mb: "1rem" }}>
                                Praktyka:
                            </Typography>
                            <CircularProgressWithLabel value={courseProgress.practice_perc} percentage={courseProgress.practice_perc}  sx={{ mb: "1rem" }}/>
                            <CircularProgressWithLabel value={courseProgress.practice_perc} hours={ {'done':courseProgress.practice, 'full': categoryDetails.practice_full_time } } />
                        </Grid>
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
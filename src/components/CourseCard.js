
import { Container, Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseCard = (props) => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };

    const [category, setCategory] = useState("");
    const start_date = props.course.start_date;
    const id = props.course.id;

    const [students, setStudents] = useState([]);
    const [students2, setStudents2] = useState([]);


    const fetchCategory = (category) => {
        axios.get(category, { headers }).then(resp => { setCategory(resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time) });
    }

    const fetchStudents = (course_id) => {
        axios.get('/student_course_status/' + course_id + '/get_by_course_id/', { headers }).then(resp => { console.log(resp.data); setStudents(resp.data) });
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
        fetchCategory(props.course.driving_license_category);
        fetchStudents(id);
    }, []);

    useEffect(() => {
        students?.forEach(student => {
            fetchStudentsDetails(student);
        });
    }, [students]);

    // useEffect(() => {
    //     // fetchCategory(props.course.driving_license_category);
    //     fetchStudents();
    //     console.log({students});
    // }, []);

    // useEffect(() => {
    //     // fetchCategory(props.course.driving_license_category);
    //     // fetchStudents();
    //     console.log({students});
    // }, [students]);

    const handleDelete = async e => {
        e.preventDefault();
        console.log({ id });
        console.log({ headers });

        axios.delete("courses/" + id, { headers });
        window.location.reload(false);
    };

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130 }}>
                <CardContent sx={{ px: "2rem" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kategoria: {category}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Data rozpoczęcia: {format(new Date(start_date), 'dd.MM.yyyy HH:mm')}
                            </Typography>
                        </Grid>

                        <Grid item xs={2} sx={{ m: "auto" }} >
                            <IconButton aria-label="delete" size="large" sx={{ my: "auto" }} onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>

                <Accordion>
                    <AccordionSummary sx={{ px: "2rem", background:"#ffb300", color:"black" }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography fontSize={18}>Kursanci:</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: "2rem" }}>
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

export default CourseCard;
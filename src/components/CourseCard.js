
import { Container, Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';

const CourseCard = (props) => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };

    const [category, setCategory] = useState("");
    const start_date = props.course.start_date;
    const id = props.course.id;

    const fetchCategory = (category) => {
        const controller = new AbortController();
        axios.get(category, { headers }).then(resp => { setCategory(resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time) });
        // controller.abort();
    }

    fetchCategory(props.course.driving_license_category);

    const handleDelete = async e => {
        e.preventDefault();
        console.log({ id });
        console.log({ headers });

        axios.delete("courses/" + id, { headers });
        window.location.reload(false);
    };

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130, px: "1rem" }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kategoria: {category}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                Data rozpoczęcia: {format(new Date(start_date), 'dd.MM.yyyy HH:mm')}
                            </Typography>
                        </Grid>

                            <Grid item xs={2} >
                                <IconButton aria-label="delete" size="large" sx={{ my: "auto" }} onClick={handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                </CardContent>
            </Card>
        </Container>
    </>
}

export default CourseCard;
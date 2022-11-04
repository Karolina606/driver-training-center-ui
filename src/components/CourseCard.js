
import {Container, Card, CardContent, Typography} from '@mui/material';
import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const CourseCard = (props) => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };

    const [category, setCategory] = useState("");
    const start_date = props.start_date;

    const fetchCategory = (category) => {
        axios.get(category, {headers}).then(resp => {setCategory(resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time)});
    }

    fetchCategory(props.driving_license_category);

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem"}}>
            <Card sx={{ minWidth: 130, px: "1rem" }}>
                <CardContent>
                <Typography variant="h7" component="div">
                    Kategoria: {category}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Data rozpoczęcia: {format(new Date(start_date), 'dd.MM.yyyy HH:mm')}
                </Typography>
                </CardContent>
            </Card>
        </Container>
    </>
} 

export default CourseCard;
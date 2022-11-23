
import { useContext } from "react";
import { Container, Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from "../context/AuthContext";
import axios from 'axios';
import ToastContext from "../context/ToastContex";


const CategoryCard = (props) => {
    const name = props.category.name;
    const theory_time = props.category.theory_full_time;
    const practice_time = props.category.practice_full_time;
    const id = props.category.id;
    const { authTokens } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${authTokens?.access}` };
    const { toastState, setToastState } = useContext(ToastContext);
  
    const fetchCategories = async () => {
        await axios.get("/driving_license_categories/", { headers }).then(resp => { props.updateCategories(resp.data) });
      }

    const handleDelete = async e => {
        e.preventDefault();
        console.log({name});
        console.log({id});
        console.log({headers});

        await axios.delete("driving_license_categories/" + id, {headers}).then(resp => {
            if(resp.status === 204) {
                setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie usunięto kategorię'});
              }else {
                setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
              }
        });
        fetchCategories();
    };

    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem" }}>
            <Card sx={{ minWidth: 130, px: "1rem" }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <Typography variant="h7" component="div">
                                Kategoria: {name}
                            </Typography>
                            <Typography color="text.secondary">
                                Pełny czas teorii: {theory_time}
                            </Typography>
                            <Typography color="text.secondary">
                                Pełny czas praktyki: {practice_time}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ m: "auto"}}>
                            <IconButton aria-label="delete" size="large" sx={{my: "auto" }} onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    </>
}

export default CategoryCard;

import {Container, Card, CardContent, Typography} from '@mui/material';

const UserCard = (props) => {
    const username = props.username;
    const email = props.email;


    return <>
        <Container maxWidth="sm" sx={{ mt: "2rem", px: "1rem"}}>
            <Card sx={{ minWidth: 130, px: "1rem" }}>
                <CardContent>
                <Typography variant="h5" component="div">
                    {username}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {email}
                </Typography>
                </CardContent>
            </Card>
        </Container>
    </>
} 

export default UserCard;
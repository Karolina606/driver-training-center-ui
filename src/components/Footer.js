import React from 'react';
import { Paper, useTheme } from '@mui/material';
import {makeStyles } from '@material-ui/core';
import { Container } from '@mui/system';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  footer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginTop: theme.spacing(5),
    position: "relative",
    left:'0',
    bottom:'0',
    right:'0',
  },
}));


const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
    return (
      <Paper elevation={3} className={classes.footer} 
      sx={{backgroundColor: theme.palette.third.main}}
      >
        <Container maxWidth="sm" sx={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width:'fit-content',}} >
        © 2022 Copyright: <a className='text-white' href='https://github.com/Karolina606' style={{color: 'cornflowerblue'}}>
          Karolina Nogacka
        </a>
        </Container>
      </Paper>
    );
  };
  
  export default Footer;
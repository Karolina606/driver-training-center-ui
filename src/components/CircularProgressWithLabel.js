import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function CircularProgressWithLabel(props) {

    var type_progress=<></>;

    if(props.percentage !== undefined){
        type_progress=<>
            {`${Math.round(props.percentage)}%`}
        </>
    }else if (props.hours !== undefined){
        type_progress=<>
            {props.hours.done}/{props.hours.full}h
        </>
    }

    

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', mb:"2rem"}} >
      <CircularProgress variant="determinate" {...props} sx={{minWidth: "70px", minHeight: "70px"}}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {type_progress}
        </Typography>
      </Box>
    </Box>
  );
}

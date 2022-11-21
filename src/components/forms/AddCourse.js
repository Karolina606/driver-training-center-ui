import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContext from '../../context/DialogContex';
import {makeStyles } from '@material-ui/core';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { plPL } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { now } from 'moment/moment';
import { format } from 'date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import pl from 'date-fns/locale/pl';
import { integerPropType } from '@mui/utils';
import ToastContext from '../../context/ToastContex';



const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      maxWidth: '300px',
      minWidth: '130px'
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

export default function AddCourse(props) {
  const [open, setOpen] = React.useContext(DialogContext);
  const { authTokens, setUser, setAuthTokens } = React.useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };
  const [dialogCategory, setCategory] = React.useState('');
  const [startDate, setStartDate] = React.useState(dayjs(now.toString()));
  const [categories, setCategories] =  React.useState([]);
  const classes = useStyles();
  const { toastState, setToastState } = React.useContext(ToastContext);

  const handleChangeDate = (newValue) => {
    setStartDate(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const fetchCategories = () => {
      // axios.get('categories/', {headers}).then(resp => {setCategories(resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time)});
      axios.get('/driving_license_categories/',  {headers}).then(resp => {setCategories(resp.data)});
  }

  const fetchCourses = async () => {
    await axios.get("/courses/", { headers }).then(resp => { props.updateCourses(resp.data) });
  }

  const formatData = (dayjsValue) => {
    var newDate = 
      dayjsValue.$y + '-' + 
      (parseInt(dayjsValue.$M) + 1).toString() + '-' + 
      dayjsValue.$D + 'T' + 
      dayjsValue.$H + ':'+ 
      dayjsValue.$m + ':00Z' ;
      console.log({newDate});
    return newDate;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };

    console.log({dialogCategory});
    console.log({startDate});
    setStartDate(formatData(startDate));
    console.log({startDate});


      await axios.post("courses/",
      {
        "driving_license_category": dialogCategory,
        "start_date": formatData(startDate)
      },
      headers).then(resp => {
        if(resp.status === 201) {
          setToastState({'isOpen': true, 'type':'success', 'message': 'Dodano nową kurs'});
        }else {
          setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
        }
      }).catch((error) => {
        setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!' + error.message})
      });
      setOpen(false);
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchCourses();
  }, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dodaj nowy kurs</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dodaj nowy kurs prawa jazdy.
          </DialogContentText>
          <form className={classes.root} onSubmit={handleSubmit}>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Kategoria kursu</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              className='MuiTextField-root'
              value={dialogCategory}
              label="Kategoria"
              onChange={e => setCategory(e.target.value)}
            >
              {categories?.map((category) => (
                    <MenuItem key={category} value={category.url}>
                        {category.name + " T:" + category.theory_full_time + " P:" + category.practice_full_time}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>

            <LocalizationProvider 
                dateAdapter={AdapterDayjs}
                // adapterLocale={pl}
                localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker 
                  label="Data rozpoczęcia"
                  value={startDate}
                  onChange={handleChangeDate}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={false}
                  // inputFormat="YYYY-MM-DDTHH:mm:00Z"
                />
              </LocalizationProvider>

            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Odrzuć</Button>
          <Button onClick={handleSubmit}>Zapisz</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

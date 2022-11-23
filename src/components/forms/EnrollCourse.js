import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContext from '../../context/DialogContex';
import { makeStyles } from '@material-ui/core';
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
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      maxWidth: '300px',
      minWidth: '130px'
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

export default function EnrollCourse(props) {
  const [open, setOpen] = React.useContext(DialogContext);
  const { authTokens, setUser, setAuthTokens } = React.useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };
  const classes = useStyles();
  const { toastState, setToastState } = React.useContext(ToastContext);

  const [course, setCourse] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [courses2, setCourses2] = React.useState([]);


  const handleClose = () => {
    setOpen(false);
  };

  const fetchCourses = async () => {
    await axios.get('/courses/', { headers }).then(resp => {console.log({resp}); setCourses(resp.data); console.log({courses})});
  }

  const [category, setCategory] = React.useState("");

  const fetchCategory = async (course1) => {
   await axios.get(course1.driving_license_category, { headers })
    .then(resp => { 
      course1['category_details'] = resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time;
      console.log({courses2});
      console.log({course1});
      setCourses2([...courses2, course1]);
    });
  }


  const formatData = (dayjsValue) => {
    var newDate =
      dayjsValue.$y + '-' +
      (parseInt(dayjsValue.$M) + 1).toString() + '-' +
      dayjsValue.$D + 'T' +
      dayjsValue.$H + ':' +
      dayjsValue.$m + ':00Z';
    console.log({ newDate });
    return newDate;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };

    axios.post("student_course_status/",
      {
        "student": props.student.id,
        "course": course,
        "paid_money": 0,
        "is_course_paid": false,
        "is_internal_theoretical_exam_passed": false,
        "is_internal_practical_exam_passed": false
      },
      headers).then(resp => {
        if(resp.status === 201) {
          setToastState({'isOpen': true, 'type':'success', 'message': 'Poprawnie zapisano na kurs'});
        }else {
          setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'});
        }
      }).catch((error) => {
        setToastState({'isOpen': true, 'type':'error', 'message': 'Coś poszło nie tak!'})
      });
    setOpen(false);
    // window.location.reload(false);
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  React.useEffect(() => {
    courses?.forEach( (course1) => {
      fetchCategory(course1);
    });
  }, [courses]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" >
        <DialogTitle sx={{ width: "400px" }}>Wybierz kurs</DialogTitle>
        <DialogContent>
          <form className={classes.root} onSubmit={handleSubmit}>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Kurs</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={course}
                label="course"
                onChange={e => setCourse(e.target.value)}
              >
                {courses?.map((course1) => (
                    <MenuItem key={course1.id} value={course1.id}>
                      {"Kategoria: " + course1.category_details + "  " + format(new Date(course1.start_date.replace('Z', '')), 'dd.MM.yyyy HH:mm')}
                    </MenuItem>
                  )
                )
            }
              </Select>
            </FormControl>

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

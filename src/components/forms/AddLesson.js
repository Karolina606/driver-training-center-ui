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
import OutlinedInput from '@mui/material/OutlinedInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

export default function AddLesson(props) {
  const [open, setOpen] = React.useContext(DialogContext);
  const { authTokens, setUser, setAuthTokens } = React.useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };
  const classes = useStyles();


  const [instructor, setInstructor] =  React.useState([]);
  const [instructors, setInstructors] =  React.useState([]);

  const [course, setCourse] =  React.useState([]);
  const [courses, setCourses] =  React.useState([]);

  const [type, setType] =  React.useState([]);
  const [types, setTypes] =  React.useState([{name:'Teoria', value:'T'}, {name:'Praktyka', value:'P'}]);

  const [startDate, setStartDate] = React.useState(dayjs(now.toString()));
  const [endDate, setEndDate] = React.useState(dayjs(now.toString()));

  const [selectedStudents, setSelectedStudents] =  React.useState([]);
  const [students, setStudents] =  React.useState([]);
  const [students2, setStudents2] = React.useState([]);
  const [courses2, setCourses2] = React.useState([]);



  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const fetchInstructors = () => {
      axios.get('/users/instructors/',  {headers}).then(resp => {setInstructors(resp.data)});
  }

  const fetchCourses = () => {
    axios.get('/courses/',  {headers}).then(resp => {setCourses(resp.data)});
}

const fetchStudents = () => {
  axios.get('/student_course_status/', {headers}).then(resp => {setStudents(resp.data)});
}

const fetchLessons = async () => {
  await axios.get("/lessons/", { headers }).then(resp => { props.updateLessons(resp.data) });
}


const fetchStudentsDetails = async (student) => {
  console.log({student});
     await axios.get('users/' + student.student, { headers })
     .then(resp => { 
       student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
       console.log({student});
       setStudents2(students2 => [...students2, student]);
     });
     console.log({students2});
   }

   const fetchCategory = async (course) => {
    await axios.get(course.driving_license_category, { headers })
     .then(resp => { 
       course['category_details'] = resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time;
       setCourses2([...courses2, course]);
     });
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
    
      await axios.post("lessons/",
      {
          "instructor": instructor,
          "course": course,
          "type": type,
          "start_date": formatData(startDate),
          "end_date": formatData(endDate)
      },
      headers).then(resp => {
        addLessonToStudentStatus(resp.data.id);
      });
      setOpen(false);
      
  };


  const addLessonToStudentStatus = async (lesson_id) => {
    await selectedStudents.forEach(student_id => {
        axios.post("/student_course_status/" + student_id + "/add_lesson_to_stu_course/" + lesson_id + "/", {}, headers);
    });
  }

  const handleStudentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStudents(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  React.useEffect(() => {
    fetchInstructors();
    fetchCourses();
    fetchStudents();
}, []);

React.useEffect(() => {
    students?.forEach(student => {
        fetchStudentsDetails(student);
    });
    courses?.forEach((course) => {
      console.log({courses})
      fetchCategory(course);
    });
}, [students, courses]);

React.useEffect(() => {
  fetchLessons();
}, [open]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Dodaj nową lekcję</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dodaj nową lekcje, czas rozpoczęcia, zakończenia.
          </DialogContentText>
          <form className={classes.root} onSubmit={handleSubmit}>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Instruktor</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={instructor}
              label="instructor"
              onChange={e => setInstructor(e.target.value)}
            >
              {instructors?.map((instructor) => (
                    <MenuItem key={instructor.id} value={instructor.id}>
                        {instructor.first_name + "  " + instructor.last_name}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
          
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Kurs</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={course}
              label="course"
              onChange={e => setCourse(e.target.value)}
            >
              {courses?.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                        {/* {course.driving_license_category + "  " + format(new Date(course.start_date), 'dd.MM.yyyy HH:mm')} */}
                        {course.category_details}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Typ lekcji</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="type"
              onChange={e => setType(e.target.value)}
            >
              {types?.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                        {type.name}
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
                  onChange={handleChangeStartDate}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={false}
                  // inputFormat="YYYY-MM-DDTHH:mm:00Z"
                />
                </LocalizationProvider>

                <LocalizationProvider 
                dateAdapter={AdapterDayjs}
                // adapterLocale={pl}
                localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker 
                  label="Data zakończenia"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={false}
                  // inputFormat="YYYY-MM-DDTHH:mm:00Z"
                /> 
                </LocalizationProvider>

          <FormControl fullWidth>
        <InputLabel id="demo-multiple-name-label">Kursanci</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={selectedStudents}
          onChange={handleStudentChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {students2?.map((student) => (
            <MenuItem
              key={student.id}
              value={student.id}
            >
              {student.student_details}
            </MenuItem>
          ))}
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

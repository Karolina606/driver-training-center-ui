import {useContext, useState, useEffect} from 'react';
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

export default function EditCourseStatus(props) {
  const [open, setOpen] = useContext(DialogContext);
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  var headers = { Authorization: `Bearer ${authTokens?.access}` };
  const classes = useStyles();

  const [course, setCourse] = useState({});
  const [student, setStudent] = useState({});
  const [category, setCategory] = useState({});

  const [courseDetails, setCourseDetails] = useState("");
  const [studentDetails, setStudentDetails] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [paidMoney, setPaidMoney] = useState(0);
  const [isCoursePaid, setCoursePaid] = useState(false);
  const [isTheoryPassed, setTheoryPassed] = useState(false);
  const [isPracticPassed, setPracticPassed] = useState(false);

  const [courseStatuses, setCourseStatuses] = useState([]);

  const [courses, setCourses] = useState([]);
  const [courses2, setCourses2] = useState([]);



  const courseStatusToEdit = props.courseStatusToEdit;


  const fetchCourse = async (course_id) => {
      await axios.get("/courses/" + course_id, { headers }).then(resp => { 
        setCourse(resp.data); 
        setCourseDetails(resp.data.start_date.replace(':00Z', '').replace('T', ', ')) 
      });
  }

  const fetchCourses = async () => {
    await axios.get("/courses/", { headers }).then(resp => { setCourses(resp.data) });
}


  const fetchCourseStatuses = async () => {
      await axios.get('/student_course_status/', { headers }).then(resp => { console.log(resp.data); setCourseStatuses(resp.data); props.updateCourseStatuses(resp.data) });
  }

  const fetchStudent = async (student_id) => {
      await axios.get('users/' + student_id, { headers })
          .then(resp => {
              // student['student_details'] = resp.data.first_name + " " + resp.data.last_name;
              console.log({ student });
              // setStudent(resp.data + { 'student_details': resp.data.first_name + " " + resp.data.last_name });
              setStudent(resp.data);
              setStudentDetails(resp.data.username + ": " + resp.data.first_name + " " + resp.data.last_name);
          });
  }

  const fetchCategory = async (course) => {
    await axios.get(course.driving_license_category, { headers })
     .then(resp => { 
       course['category_details'] = resp.data.name + " T:" + resp.data.theory_full_time + " P:" + resp.data.practice_full_time;
       setCourses2([...courses2, course]);
     });
   }


  useEffect(() => {
    console.log({courseStatusToEdit});
    if(courseStatusToEdit !== undefined ){
        setPaidMoney(courseStatusToEdit.paid_money);
        setTheoryPassed(courseStatusToEdit.is_internal_theoretical_exam_passed);
        setPracticPassed(courseStatusToEdit.is_internal_practical_exam_passed);
        
        fetchStudent(courseStatusToEdit.student);
        fetchCourse(courseStatusToEdit.course);
        fetchCourses();
    }    
  },[]);


  const handleSubmit = async e => {
    e.preventDefault();

    headers = { headers: { Authorization: `Bearer ${authTokens?.access}` } };
    
    if(courseStatusToEdit !== undefined){

        await axios.put(courseStatusToEdit.url,
        {
            "student": student.id,
            "course": course.id,
            "paid_money": paidMoney,
            "is_course_paid": isCoursePaid,
            "is_internal_theoretical_exam_passed": isTheoryPassed,
            "is_internal_practical_exam_passed": isPracticPassed
        },
        headers);
      }
      setOpen(false);
  };

  
  useEffect(() => {
    courses?.forEach( course => {
      fetchCategory(course);
    });
  }, [courses]);
  

  const handleClose = () => {
    setOpen(false);
  };

useEffect(() => {
  fetchCourseStatuses();
}, [open]);



  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edytuj status kursu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edytuj status kursu
          </DialogContentText>
          <form className={classes.root} onSubmit={handleSubmit}>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Kurs</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={course}
              label="course"
              defaultValue={course.id}
              onChange={e => setCourse(e.target.value)}
            >
              {courses2?.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {"Kategoria: " + categoryDetails + "  " + format(new Date(course.start_date.replace('Z', '')), 'dd.MM.yyyy HH:mm')}
                      {/* {"Kategoria: " + categoryDetails + "  " + course.start_date} */}
                    </MenuItem>
                  )
                )
              }
            </Select>
            </FormControl>

            <TextField sx={{margin: "0px"}} fullWidth
                label="Ile zapłacono"
                variant="outlined"
                required
                value={paidMoney}
                defaultValue='0'
                type={'number'}
                onChange={e => setPaidMoney(parseInt(e.target.value))}
              />

            <FormGroup fullWidth>
              <FormControlLabel control={<Checkbox checked={isCoursePaid} onChange={e => setCoursePaid(e.target.checked)}/>} label="Zapłacono za cały kurs" />
              <FormControlLabel control={<Checkbox checked={isTheoryPassed} onChange={e => setTheoryPassed(e.target.checked)}/>} label="Zdano wewnętrzny egzamin teoretyczny" />
              <FormControlLabel control={<Checkbox checked={isPracticPassed} onChange={e => setPracticPassed(e.target.checked)}/>} label="Zdano wewnętrzny egzamin praktyczny" />
            </FormGroup>
          
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

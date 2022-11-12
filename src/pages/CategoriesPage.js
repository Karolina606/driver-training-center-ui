import CategoryCard from "../components/CategoryCard";
import AuthContext from "../context/AuthContext";

import { useContext, useEffect, useState } from "react";
import useAxios, {baseURL} from '../utils/useAxios'
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DialogContext from "../context/DialogContex";
import AddCategory from "../components/forms/AddCategory";


const CategoriesPage = () => {

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'driving_license_categories'
    });

    const updateCategories = (newValues) => {
      setCategories(newValues);
    }

    useEffect(() => {
        if(response !== null ){
            console.log({response});
            setCategories(response);
        }
      }, [response]);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

  return (
    <section>
      <h1>Kategorie praw jazdy:</h1>

         {categories?.map((category) => (
            <CategoryCard category={category} updateCategories={updateCategories}/>
        ))}

      <Fab color="primary" aria-label="add" sx={{position: 'fixed', bottom: 16, right: 16}} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>

      <DialogContext.Provider value={[open, setOpen]}>
        <AddCategory updateCategories={updateCategories}/>
      </DialogContext.Provider>
    </section>
  );
};

export default CategoriesPage;
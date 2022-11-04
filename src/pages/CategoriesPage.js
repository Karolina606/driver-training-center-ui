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
    const { response, loading, error } = useAxios({
        method: 'get',
        url: 'driving_license_categories'
    });

    useEffect(() => {
        if(response !== null ){
            console.log({response});
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
      <h1>You are on category page!</h1>

         {response?.map((category) => (
            <CategoryCard category={category}/>
        ))}

      <Fab color="primary" aria-label="add" sx={{position: 'absolute', bottom: 16, right: 16}} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>

      <DialogContext.Provider value={[open, setOpen]}>
        <AddCategory/>
      </DialogContext.Provider>
    </section>
  );
};

export default CategoriesPage;
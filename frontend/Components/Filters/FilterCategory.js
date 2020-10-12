import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

export default function FilterCategory(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [categories, setCategories] = useState([])

    
    const handleChange = (event) => {
        /*
        let newArr = addedFilters
        newArr.push(event.target.value)
        for(let i = 0; i < newArr.length - 1; i++){
            if(newArr[i] === event.target.value) {newArr.pop(); newArr.splice(i,1)}
        }
        setAddedFilters(newArr)
        let newUrlString = ""
        for(let i = 0; i < newArr.length; i++){
            newUrlString += newArr[i] + ','
        }
        props.setUrl(newUrlString)
        */
      
    };
    
    

    

    return(
        <div>
            <FormControl>
                <FormLabel>Velg kategori</FormLabel>
                <FormGroup >
                    <br/>
                    {categories.map((category) => 
                        <FormControlLabel control={<Checkbox value={category[1]} onChange={handleChange} name={category[0]} />} 
                        label={category[0]} 
                    />)}
                    
                </FormGroup>
            </FormControl>
        </div>
    )
}

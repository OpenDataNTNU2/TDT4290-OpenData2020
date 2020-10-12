import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import GetApi from '../ApiCalls/GetApi'

export default function FilterCategory(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [categories, setCategories] = useState([])

    const [res, setRes] = useState({})
    
    const handleChange = (event) => {
        
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
        
      
    };
    
    useEffect(() => {
        GetApi('https://localhost:5001/api/categories', setRes)

        let pub = []
        for(let i = 0; i < res.length; i++){
            pub.push([res[i].name.split(" ")[0], res[i].id, false, i]);
        }
        setCategories(pub)
    },[props])

    

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

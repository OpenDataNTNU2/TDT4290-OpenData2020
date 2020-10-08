import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

export default function FilterTag(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [tags, setTags] = useState([])

    
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
                <FormLabel>Velg tags</FormLabel>
                <FormGroup >
                    <br/>
                    {tags.map((tag) => 
                        <FormControlLabel control={<Checkbox value={tag[1]} onChange={handleChange} name={tag[0]} />} 
                        label={tag[0]} 
                    />)}
                    
                </FormGroup>
            </FormControl>
        </div>
    )
}

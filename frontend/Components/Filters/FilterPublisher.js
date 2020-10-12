import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import GetApi from '../ApiCalls/GetApi'

export default function FilterPublisher(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [publishers, setPublishers] = useState([])
    const [showItems, setShowItems] = useState(5)

    const [res, setRes] = useState({})
    
    const handleChange = (event) => {
        props.setChanged(true)
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
        GetApi('https://localhost:5001/api/publishers', setRes)

        let pub = []
        for(let i = 0; i < res.length; i++){
            pub.push([res[i].name.split(" ")[0], res[i].id, false, i, res[i].datasets.length]);
        }
        setPublishers(pub)
        if(res.length < 5){setShowItems(res.length)}
    },[props])

    const items = publishers.slice(0, showItems).map(pub => 
        <FormControlLabel control={<Checkbox value={pub[1]} onChange={handleChange} name={pub[0]} />} 
        label={pub[0] + " (" + pub[4] + ")"} 
    />)
    

    return(
        <div>
            <FormControl>
                <FormLabel>Velg kommune</FormLabel>
                <FormGroup >
                    <br/>
                    {items}
                    {showItems === 5
                    ? <ExpandMoreIcon style={{cursor:'pointer'}} onClick={() => setShowItems(publishers.length)} fontSize="large"/> 
                    : publishers.length > 5 
                    ? <ExpandLessIcon style={{cursor:'pointer'}} onClick={() => setShowItems(5)} fontSize="large" />
                    : null
                    }
                    
                </FormGroup>
            </FormControl>
        </div>
    )
}

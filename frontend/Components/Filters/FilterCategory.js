import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import GetApi from '../ApiCalls/GetApi'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

// NB: de ulike filter funksjonene er veldig like atm, dette blir kanskje endret, mtp at vi skal ha under kategorier og slikt
// så ikke slå de sammen. Vi tar heller en vurdering på det senere.
export default function FilterCategory(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [categories, setCategories] = useState([])
    const [showItems, setShowItems] = useState(5)

    const [cat, setCat] = useState('')

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
        

        
    }
        
        
      
    
    
    useEffect(() => {
        GetApi('https://localhost:5001/api/categories', setRes)

        let pub = []
        for(let i = 0; i < res.length; i++){
            pub.push([res[i].name.split(" ")[0], res[i].id, false, i,  res[i].datasetsCount]);
        }
        setCategories(pub)
        if(res.length < 5){setShowItems(res.length)}
    },[props])

    const items = categories.slice(0, showItems).map(category => 
        <FormControlLabel control={<Checkbox value={category[1]} onChange={handleChange} name={category[0]} />} 
        label={category[0] + " (" + category[4] + ")"} 
    />)

    return(
        <div>
            <FormControl>
                <FormLabel>Velg kategori</FormLabel>
                <FormGroup >
                    <br/>
                    {items}
                    {showItems === 5
                    ? <ExpandMoreIcon style={{cursor:'pointer'}} onClick={() => setShowItems(categories.length)} fontSize="large"/> 
                    : categories.length > 5 
                    ? <ExpandLessIcon style={{cursor:'pointer'}} onClick={() => setShowItems(5)} fontSize="large" />
                    : null
                    }
                    
                </FormGroup>
            </FormControl>
        </div>
    )
}

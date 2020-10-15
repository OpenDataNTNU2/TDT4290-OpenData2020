import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import GetApi from '../ApiCalls/GetApi'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import CheckboxInput from '../Forms/CheckboxInput'


// NB: de ulike filter funksjonene er veldig like atm, dette blir kanskje endret, mtp at vi skal ha under kategorier og slikt
// så ikke slå de sammen. Vi tar heller en vurdering på det senere.
export default function FilterCategory(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [categories, setCategories] = useState([])
    const [showItems, setShowItems] = useState(5)
    const [shownSubItems, setShownSubItems] = useState({});
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
        
    // fetches the categories and places all the top level categories into a list. 
    useEffect(() => {
        
        GetApi('https://localhost:5001/api/categories', setRes)
        let pub = []
        for(let i = 0; i < res.length; i++){
            if(res[i].broader === null) pub.push(res[i])
        }
        setCategories(pub)
        console.log(pub.length)
        
    },[props])

   

    // toggles the sub categories true/false
    const toggleShownSubItems = id => {
        setShownSubItems(prevShownSubItems => ({
        ...prevShownSubItems,
        [id]: !prevShownSubItems[id]
        }));
    };

    
    // maps all the categories in the list sent in, 
    // then checks if an element in the list have elements in the narrower field
    // if that is true, it runs this function again, but with the narrower list instead. 
    
    const items = (cats) => cats.map((category) => (
        <div>
            { category.datasetsCount > 0 ?
                category.narrower.length === 0 ? 
                    <CheckboxInput handleChange={handleChange} id={category.id} name={category.name + " (" + category.datasetsCount + ")"} />
                
                :   <div>
                        <CheckboxInput handleChange={handleChange} id={category.id} name={category.name + " (" + category.datasetsCount + ")"} />
                        {!shownSubItems[category.id] ? 
                            <ExpandMoreIcon style={{cursor:'pointer'}} fontSize="small" onClick={() => toggleShownSubItems(category.id)} />
                        :   <ExpandLessIcon style={{cursor:'pointer'}} fontSize="small" onClick={() => toggleShownSubItems(category.id)} />
                        }
                        
                        <div style={{marginLeft: "2vh"}} hidden={!shownSubItems[category.id]} id={category.id} >
                            {items(category.narrower)}
                        </div>
                        
                    </div>
            : null } 
            </div>
        )
    )
        
    return(
        <div>
            <FormControl>
                <FormLabel>Velg kategori</FormLabel>
                <FormGroup >
                    <br/>

                    {items(categories.slice(0, showItems))}
                    
                    {showItems === 5 && categories.length > 5
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

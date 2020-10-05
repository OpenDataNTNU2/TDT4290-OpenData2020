import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

export default function Filter(props){

    const [addedFilters, setAddedFilters] = useState([])
    const [publishers, setPublishers] = useState([])

    
    const handleChange = (event) => {
        let newArr = addedFilters
        newArr.push(event.target.value)
        for(let i = 0; i < newArr.length - 1; i++){
            if(newArr[i] === event.target.value) {newArr.pop(); newArr.splice(i,1)}
        }
        setAddedFilters(newArr)
        console.log(newArr)
        let newUrlString = ""
        for(let i = 0; i < newArr.length; i++){
            newUrlString += newArr[i] + ','
        }
        console.log(newUrlString)
        props.setUrl(newUrlString)
      
    };
    
    useEffect(() => {
        getPublishers()
    },[props])

    const getPublishers = async () => {
        try{
            fetch('https://localhost:5001/api/publishers', {
                method: 'GET',    
            })
            .then(response => response.json())
            .then(response => {
                let pub = []

                for(let i = 0; i < 2; i++){
                    pub.push([response[i].name.split(" ")[0], response[i].id, false, i]);
                }
                setPublishers(pub)
                console.log(publishers)
            })
        }
        catch(_){
            console.log("failed to fetch publishers")
        }
    }

    

    return(
        <div>
            <FormControl>
            <FormLabel>Velg kommune</FormLabel>
            <FormGroup >
                <p>Publishers from backend</p>
                {publishers.map((pub) => 
                    <FormControlLabel control={<Checkbox value={pub[1]} onChange={handleChange} name={pub[0]} />} 
                    label={pub[0]} 
                />)}
                <p>Dummy Data</p>
                <FormControlLabel
                control={<Checkbox   name="oslo"/>}
                label="Oslo"
                />
                <FormControlLabel
                control={<Checkbox  name="trondheim"/>}
                label="Trondheim"
                />
                <FormControlLabel
                control={<Checkbox  name="bodo"/>}
                label="Bodø"
                />
                <FormControlLabel
                control={<Checkbox name="gjesdal"/>}
                label="Gjesdal"
                />
                <FormControlLabel
                control={<Checkbox name="kristiansand"/>}
                label="Kristiansand"
                />
            </FormGroup>
            </FormControl>
        </div>
    )
}

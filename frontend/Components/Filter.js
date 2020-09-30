import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@material-ui/core';
import React, { useState } from 'react';

export default function Filter(){

    // When we get all muni's maybe map over a list from backend?
    const [state, setState] = useState({
        oslo: true,
        trondheim: true,
        bodo: false,
        gjesdal: false,
        kristiansand: true
    })
    
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };
    
    const { oslo, trondheim, bodo, gjesdal, kristiansand } = state;

    return(
        <div>
            <FormControl>
            <FormLabel>Velg kommune</FormLabel>
            <FormGroup >
                <FormControlLabel
                control={<Checkbox checked={oslo} onChange={handleChange} name="oslo"/>}
                label="Oslo"
                />
                <FormControlLabel
                control={<Checkbox checked={trondheim} onChange={handleChange} name="trondheim"/>}
                label="Trondheim"
                />
                <FormControlLabel
                control={<Checkbox checked={bodo} onChange={handleChange} name="bodo"/>}
                label="Bodø"
                />
                <FormControlLabel
                control={<Checkbox checked={gjesdal} onChange={handleChange} name="gjesdal"/>}
                label="Gjesdal"
                />
                <FormControlLabel
                control={<Checkbox checked={kristiansand} onChange={handleChange} name="kristiansand"/>}
                label="Kristiansand"
                />
            </FormGroup>
            </FormControl>
        </div>
    )
}
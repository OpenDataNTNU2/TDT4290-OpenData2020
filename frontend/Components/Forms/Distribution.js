import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'

import { useState } from "react";

export default function Distribution(props) {
    
    
    const handleChange = (arr, func, index, event, newValue) => {
        let newArr = [...arr]
        newArr[index] = event.target.value;
        func(newArr);
    };

    

    return (
        <div style={{padding: "3vh"}}>

            
            <div>
                <form noValidate autoComplete="off" style={{width: "30vh", display: "inline-block", marginRight: "1vh"}}>
                    <TextField 
                        id="outlined-basic" 
                        label="Tittel" 
                        size="large" 
                        variant="outlined" 
                        fullWidth="true" 
                        value={props.title[props.number]} 
                        onChange={(e) => handleChange(props.title, props.setTitle, props.number, e, props.title[props.number])}
                        
                    />
                </form>
                <FormControl variant="outlined" style={{width: "19vh"}}>
                    <InputLabel htmlFor="outlined-age-native-simple">Fil format</InputLabel>
                    <Select
                        native
                        label="Fil format"
                        inputProps={{
                            name: 'type',
                            id: 'outlined-age-native-simple',
                        }}
                        value={props.fileFormat[props.number]}
                        onChange={(e) => handleChange(props.fileFormat, props.setFileFormat, props.number, e, props.fileFormat[props.number])}
                        
                        >
                        <option value={1}>JSON</option>
                        <option value={2}>XML</option>
                        <option value={3}>Annet</option>
                    </Select>
                </FormControl>


            </div>
            <br/>
            <form noValidate autoComplete="off" style={{width: "50vh"}}>
                <TextField 
                    id="outlined-basic" 
                    label="uri" 
                    size="large" 
                    variant="outlined" 
                    fullWidth="true" 
                    value={props.uri[props.number]} 
                    onChange={(e) => handleChange(props.uri, props.setUri, props.number, e, props.uri[props.number])}
                    
                />
            </form>
            

        </div>
    )
}
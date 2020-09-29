import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { useState } from "react";

export default function AddNewDataset(){
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    

    const handleChange = async () => {
        
        const data = {
            "identifier": "stringeling",
            "title": title,
            "description": description
        }
        
        try{
            fetch('https://localhost:5000/api/datasets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => console.log(data))
            
        }
        catch(_){
            alert("failed")
            console.log("failed")
        }
        
    }

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            style={{ minHeight: '70vh', minWidth: '90vh'}}
        >
            <h1 style={{fontWeight: "normal"}}>Legg til nytt datasett</h1>
            <form noValidate autoComplete="off" style={{width: "50vh"}}>
                <TextField 
                    id="outlined-basic" 
                    label="Tittel" 
                    size="large" 
                    variant="outlined" 
                    fullWidth="true" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    
                />
            </form><br/>

            <form noValidate autoComplete="off" style={{width: "50vh"}}>
                <TextField 
                    id="outlined-multiline"
                    multiline
                    rows={4} 
                    label="Beskrivelse" 
                    size="large" 
                    variant="outlined" 
                    fullWidth="true" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    
                />
            </form><br/>

            <Button variant="contained" color="primary" onClick={handleChange}>Send inn</Button>

            <p>For testing....</p>
            <p>Title: {title}</p>
            <p>Description: {description}</p>

        </Grid>
    )
}
 


import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { useState } from "react";

export default function AddNewDataset(){
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    // denne vil være enten "published" eller "not published"
    const [published, setPublished] = useState("not published");
    

    const handleChange = async () => {
        
        const data = {
            "identifier": "stringeling",
            "title": title,
            "description": description
        }
        
        try{
            fetch('https://localhost:5001/api/datasets', {
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
            justify="center"
            alignItems="center"
            style={{ minHeight: '70vh', minWidth: '90vh'}}
        >
            <Grid><h1 style={{fontWeight: "normal"}}>Legg til nytt datasett</h1></Grid>

            <Grid>
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
                </form>
            </Grid>


            

            <Grid>
                <br/>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Status for publisering</FormLabel>
                    <RadioGroup value={published} onChange={(e) => setPublished(e.target.value)}>
                        <FormControlLabel value="published" control={<Radio />} label="Publisert" />
                        <FormControlLabel value="not published" control={<Radio />} label="Ikke publisert" />
                    </RadioGroup>
                    {published === "not published" ? 
                    <div style={{marginLeft: "5vh"}}>
                        <RadioGroup>
                            <FormControlLabel value="1" control={<Radio style={{backgroundColor: "green"}} size="small"/>} label="skal publiseres"/>
                            <FormControlLabel value="2" control={<Radio style={{backgroundColor: "yellow"}} size="small"/>} label="under vurdering"/>
                            <FormControlLabel value="3" control={<Radio style={{backgroundColor: "red"}} size="small"/>} label="kan ikke publiseres"/>
                        </RadioGroup>
                    </div>
                : null }
                </FormControl>
               
                
            </Grid>

            <Grid>
                <br/>
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
                </form>
            </Grid>

            
            
            <Grid> 
                <br/>
                <Button variant="contained" color="primary" onClick={handleChange}>Send inn</Button>
            </Grid>


        </Grid>
    )
}
 


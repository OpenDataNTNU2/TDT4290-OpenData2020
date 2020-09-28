import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'

import { useState } from "react";

export default function AddNewDataset(){
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [published, setPublished] = useState("not published");
    const [publishedStatus, setPublishedStatus] = useState("")
    
    /*
    const [status, setStatus] = useState({
        published: false,
        notPublished: {
            willBePublished: false,
            underEvaluation: false,
            cannotPublish: false
        }
    });
    */

    

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
                    
                    {published !== "published" ? 
                    <div style={{marginLeft: "5vh"}}>
                        <RadioGroup value={publishedStatus} onChange={(e) => setPublishedStatus(e.target.value)}>
                            <FormControlLabel value="willBePublished" control={<Radio size="small"/>} label="Skal publiseres" />
                            <FormControlLabel value="underEvaluation" control={<Radio size="small"/>} label="Under vurdering"/>
                            <FormControlLabel value="cannotPublish" control={<Radio size="small"/>} label="Kan ikke publiseres"/>
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

            
            
           
        
            <Grid><br/>
                <FormControl variant="outlined" style={{width: "50vh"}}>
                    <InputLabel htmlFor="outlined-age-native-simple">Type</InputLabel>
                    <Select
                        native
                        label="Type"
                        inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple',
                        }}
                        
                        >
                        <option aria-label="None" value="" />
                        <option value={10}>Option 1</option>
                        <option value={20}>Option 2</option>
                        <option value={30}>Option 3</option>
                    </Select>
                </FormControl>
            </Grid>


            <Grid><br/>
                <FormControl variant="outlined" style={{width: "50vh"}}>
                    <InputLabel htmlFor="outlined-age-native-simple">Kategori</InputLabel>
                    <Select
                        native
                        label="Type"
                        inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple',
                        }}
                        
                        >
                        <option aria-label="None" value="" />
                        <option value={10}>Option 1</option>
                        <option value={20}>Option 2</option>
                        <option value={30}>Option 3</option>
                    </Select>
                </FormControl>
            </Grid>

            <Grid><br/>
                <form noValidate autoComplete="off" style={{width: "50vh"}}>
                    <TextField 
                        id="outlined-basic" 
                        label="Tags" 
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
                <Button variant="contained" color="primary" onClick={handleChange}>Send inn</Button>
            </Grid>
        <p>{published}</p>
        <p>{publishedStatus}</p>

        </Grid>
    )
}
 


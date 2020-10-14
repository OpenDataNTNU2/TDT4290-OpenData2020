import { Grid, Button, FormControl, FormLabel, Divider, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'

import PostApi from '../ApiCalls/PostApi'
import GetApi from '../ApiCalls/GetApi'

import SelectInput from '../Forms/SelectInput'
import Input from '../Forms/Input'

import { useState, useEffect } from 'react'
import RadioInput from '../Forms/RadioInput';



// TODO: Fikse feedback hvis en ugyldig link blir benyttet, ellers funker det :)
export default function CreateCoordination(props){
    
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const [addDataset, setAddDataset] = useState("0")
    const [datasets, setDatasets] = useState([])

    const handleChange = () => {
        const data = {
            "title": title,
            "description": description,
            "publisherId": props.publisherId
        }
        PostApi('https://localhost:5001/api/coordinations', data, submitPostReq)
        console.log(props.publisherId)
    }


    const submitPostReq = (id) => {
        console.log("imported dataset from: https://localhost:5001/api/coordinations")
        setOpen(true)
        setTitle("")
        setDescription("")
    }


    return(
        <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            style={{ minHeight: '70vh', minWidth: '60vh', marginTop: "5vh"}}
        >
            <Input 
                id="titleCoordination" 
                multiline={false} 
                label="Tittel på samordningen" 
                value={title} 
                handleChange={setTitle} 
            /><br/>

            <Input
                id="descriptionCoordination"
                multiline={true} 
                label="Beskrivelse på samordningen" 
                value={description} 
                handleChange={setDescription} 
            /><br/>

            <FormControl component="fieldset" style={{minWidth: "50vh"}}>
                <FormLabel component="legend">Legg til dataset</FormLabel>
                <RadioInput 
                    id="addDatasetToCoordination"
                    mainValue={addDataset}
                    handleChange={setAddDataset}
                    value={["1", "2", "3"]}
                    label={["Legg til eksisterende", "Opprett nytt dataset", "Ikke legg til dataset enda"]}
                    color={["normal", "normal", "normal"]}
                />
            </FormControl><br/>

            
                {addDataset === "1" ? 
                    <div>select bar here</div>
                : addDataset === "2" ?
                    <div>add new dataset here</div>
                :   <Button variant="contained" color="primary" onClick={handleChange}>Opprett</Button>
                }

            <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert elevation={1} severity="success">Samordning opprettet</Alert>
            </Snackbar>
        </Grid>
    )

}



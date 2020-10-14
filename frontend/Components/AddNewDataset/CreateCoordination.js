import { Grid, Button, FormControl, FormLabel, Divider, Snackbar, MenuItem, InputLabel, Select  } from '@material-ui/core';
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

    const [datasetOption, setDatasetOption] = useState("0")
    const [datasets, setDatasets] = useState([])

    // dataset to add to coordination
    const [selectedDataset, setSelectedDataset] = useState({})

    const handleChange = () => {
        // make don't have datasets like this, should only be here if selectedDataset !== {}
        // not sure if this is how its done either
        const data = {
            "title": title,
            "description": description,
            "publisherId": props.publisherId,
            "datasets": selectedDataset
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

    // this should be fetched when clicking the radiobutton for choose existing
    useEffect(() => {
        GetApi('https://localhost:5001/api/datasets?PublisherIds=' + props.publisherId, setDatasets)
    },[props])

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
                    mainValue={datasetOption}
                    handleChange={setDatasetOption}
                    value={["1", "2", "3"]}
                    label={["Legg til eksisterende", "Opprett nytt dataset", "Ikke legg til dataset enda"]}
                    color={["normal", "normal", "normal"]}
                />
            </FormControl><br/>

            
                {datasetOption === "1" ? 
                    
                    <div>
                        {/* Midlertidig funk for å teste */}
                        <FormControl variant="outlined" style={{width: "50vh"}}>
                            <InputLabel id="demo-simple-select-label">Velg dataset</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                label="Velg dataset"
                                id="demo-simple-select"
                                value={selectedDataset}
                                onChange={(event) => setSelectedDataset(event.target.value)}

                            >
                            {Object.values(datasets.items).map((dataset) => (
                                <MenuItem value={dataset}>{dataset.title}</MenuItem>
                            ))}
                            
                            
                            </Select>
                        </FormControl>

                        
                    </div>
                : datasetOption === "2" ?
                    <div>add new dataset here</div>
                :   null
                }
                <Button variant="contained" color="primary" onClick={handleChange}>Opprett</Button>

            <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert elevation={1} severity="success">Samordning opprettet</Alert>
            </Snackbar>
        </Grid>
    )

}



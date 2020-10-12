import { Grid, Button, FormControl, FormLabel, Divider, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'

import PostApi from '../ApiCalls/PostApi'

import Input from '../Forms/Input'

import { useState } from 'react'



// TODO: Fikse feedback hvis en ugyldig link blir benyttet, ellers funker det :)
export default function CreateDataset(){

    const [importUrl, setImportUrl] = useState("");
    const [numberOfDatasets, setNumberOfDatasets] = useState(10);
    const [open, setOpen] = useState(false)

    const handleChange = (event) => {
        PostApi('https://localhost:5001/api/datasets/import?url=' + importUrl, {"url": importUrl}, importPostReq)
    }
    const populateSite = (event) => {
        PostApi('https://localhost:5001/api/datasets/populate?numberOfDatasets=' + numberOfDatasets, {"numberOfDatasets": numberOfDatasets}, importPostReq)
    }

    const importPostReq = (id) => {
        console.log("imported dataset from: " + importUrl)
        setOpen(true)
        setImportUrl("")
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
                id="importUrl"
                label="Url som importeres fra"
                value={importUrl}
                handleChange={setImportUrl}
                multiline={false}
            /><br/>
            <Button variant="contained" color="primary" onClick={handleChange}>Send inn</Button><br/>
            
            <Alert elevation={1} severity="info">Kopier inn en link for å importere, eks: 
            <br/> https://fellesdatakatalog.digdir.no/api/datasets/8e994595-423b-4dcb-ab83-271989b0d9f0
            </Alert><br/><br/>

            <Input 
                id="populateNumberOfDatasets"
                label="Antall datasett"
                value={numberOfDatasets}
                handleChange={setNumberOfDatasets}
                multiline={false}
            /><br/>
            <Button variant="contained" color="primary" onClick={populateSite}>Populer</Button><br/>

            <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert elevation={1} severity="success">Datasett importert</Alert>
            </Snackbar>
        </Grid>
    )

}



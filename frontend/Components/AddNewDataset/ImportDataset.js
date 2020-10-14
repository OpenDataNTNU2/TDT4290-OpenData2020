import { Grid, Button, FormControl, FormLabel, Divider, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'

import PostApi from '../ApiCalls/PostApi'
import GetApi from '../ApiCalls/GetApi'

import SelectInput from '../Forms/SelectInput'
import Input from '../Forms/Input'

import { useState, useEffect } from 'react'



// TODO: Fikse feedback hvis en ugyldig link blir benyttet, ellers funker det :)
export default function CreateDataset(){

    const [importUrl, setImportUrl] = useState("");
    const [numberOfDatasets, setNumberOfDatasets] = useState(10);
    const [open, setOpen] = useState(false)

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(() => {
        GetApi('https://localhost:5001/api/categories', setCategories)
    }, [])

    const importDataset = (event) => {
        let category = selectedCategory ? '&categoryId=' + selectedCategory : ""
        PostApi('https://localhost:5001/api/datasets/import?url=' + importUrl + category, {"url": importUrl}, importPostReq)
    }
    const populateSite = (event) => {
        PostApi('https://localhost:5001/api/datasets/populate?numberOfDatasets=' + numberOfDatasets, {"numberOfDatasets": numberOfDatasets}, importPostReq)
    }
    const importCategories = (event) => {
        PostApi('https://localhost:5001/api/categories/import?url=' + importUrl, {"url": importUrl}, importPostReq)
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
            <SelectInput 
                id="category"
                mainLabel="Kategori"
                value={categories}
                setSelectedCategory={setSelectedCategory}
                selected={selectedCategory}
            /><br/>

            <Grid 
                container 
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}>
                <Button variant="contained" color="primary" onClick={importDataset}>Importer datasett</Button><br/>
                <Button variant="contained" color="primary" onClick={importCategories}>Importer kategorier</Button><br/>
            </Grid>
            
            <Alert elevation={1} severity="info">Kopier inn en link for å importere, eks: 
            <br/> Datset: https://fellesdatakatalog.digdir.no/api/datasets/8e994595-423b-4dcb-ab83-271989b0d9f0
            <br/> Kategorier: https://psi.norge.no/los/tema/arbeid
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



import { Grid, Button, FormControl, FormLabel, Divider, Snackbar } from '@material-ui/core';

import Input from '../Forms/Input'

import { useState } from 'react'

export default function CreateDataset(){

    const [importUrl, setImportUrl] = useState("");

    const handleChange = (event) => {
        console.log("clicked")
        // kjør post request til Components/ApiCalls/PostApi her
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

        </Grid>
    )

}



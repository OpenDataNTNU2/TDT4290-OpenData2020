import React from 'react';
import { Grid, Button } from '@material-ui/core';


const RequestButtonComp = () => {

    return (  
        <Grid>
            <p><i>Er du interessert i dette datasettet?</i></p>
            <Button variant="contained" color="primary"  onClick={() => console.log("Datasett etterspurt!")}>Etterspør datasett</Button>
        </Grid>
    )
}

export default RequestButtonComp;
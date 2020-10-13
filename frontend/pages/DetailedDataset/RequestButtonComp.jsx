import React from 'react';
import { Grid, Button } from '@material-ui/core';


const RequestButtonComp = (props) => {

    return (  
        <Grid>
            <p><i>Er du interessert i dette datasettet?</i></p>
            <Button 
            variant="contained" 
            color="primary" 
            disabled = {props.disabled}
            onClick={props.handleChange}>
                Etterspør datasett
            </Button>
        </Grid>
    )
}

export default RequestButtonComp;
import React from 'react';
import { Grid, Paper, Box } from '@material-ui/core';

const DistributionCard = (props) => {

    return (  
        <Paper 
        variant='elevation' 
        elevation ={3}
        spacing={2}
        style={{ backgroundColor: '#e6ffee', padding: '1%', marginBottom: '2%' }}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  alignItems="stretch">
                    <Grid item xs={6}>
                        <p><b>ID: </b>{props.id}</p>
                        <p><b>Filformat: </b>{props.fileFormat}</p>
                        <p><b>URI: </b>{props.uri}</p>
                    </Grid>
                </Grid>
              </Paper>
    )
}

export default DistributionCard;
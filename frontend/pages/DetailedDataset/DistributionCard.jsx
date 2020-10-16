import React from 'react';
import { Grid, Paper, Box, Link } from '@material-ui/core';

const DistributionCard = (props) => {

    return (  
        <Paper 
        variant='elevation' 
        elevation={3}
        spacing={2}
        style={{ backgroundColor: '#e6ffee', padding: '1%', marginBottom: '2%' }}>
                <Grid
                  container
                  direction="row"
                  alignItems="stretch">
                    <Grid item xs={6}>
                        <p><b>{props.title}</b></p>
                        <p><b>Filformat: </b>{props.fileFormat}</p>
                        <Link target="_blank" rel="noopener" color="inherit" href={props.uri}><b>URI: </b>{props.uri}</Link>
                    </Grid>
                </Grid>
              </Paper>
    )
}

export default DistributionCard;
import React from 'react';
import { Grid, Button } from '@material-ui/core';

const DistributionCard = (props) => {

    return (  
        <Grid>
            <p><i>Placeholder for distributionCard</i></p>
            <p><b>ID: </b>{data.distributions.map(distributions => { return (<a key={distributions.id}>{distributions.id} </a> )})}</p>
            <p><b>Filformat: </b>{data.distributions.map(distributions => { return (<a key={distributions.fileFormat}>{distributions.fileFormat} </a> )})}</p>
            <p><b>URI: </b>{data.distributions.map(distributions => { return (<a key={distributions.uri}>{distributions.uri} </a> )})}</p>
        </Grid>
    )
}

export default DistributionCard;
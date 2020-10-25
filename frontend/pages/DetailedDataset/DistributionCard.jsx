import React from 'react';
import { Grid, Paper, Link, Button } from '@material-ui/core';
import DeleteApi from '../../Components/ApiCalls/DeleteApi';

const DistributionCard = (props) => {

  const removeDistribution = () => {
    // få inn en måte å oppdatere siden på slik at bruker slipper å refreshe for å se at distribusjonen er borte.
    DeleteApi('https://localhost:5001/api/distributions/' + props.id)
  }

  return (
    <Paper
      variant="elevation"
      elevation={3}
      spacing={2}
      style={{ backgroundColor: 'white', padding: '1%', marginBottom: '2%' }}
    >
      <Grid container direction="row" alignItems="stretch">
        <Grid item xs={9}>
          <p>
            <b>{props.title}</b>
          </p>
          <p>
            <b>Filformat: </b>
            {props.fileFormat}
          </p>
          <Link target="_blank" rel="noopener" color="inherit" href={props.uri}>
            <b>URI: </b>
            {props.uri}
          </Link>
        </Grid>
        {props.canEdit && <Grid item xs={3} alignContent="flex-end">
          <Button variant="contained" color="secondary" onClick={removeDistribution}>Fjern denne distribusjonen</Button>
        </Grid>}
      </Grid>
    </Paper>
  );
};

export default DistributionCard;

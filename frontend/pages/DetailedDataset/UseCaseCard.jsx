import React from 'react';
import { Grid, Paper, Link } from '@material-ui/core';

const UseCaseCard = (props) => {
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
            <b>{props.useCaseDescription}</b>
          </p>
          <Link target="_blank" rel="noopener" color="inherit" href={props.uri}>
            <b>URL til usecase: </b>
            {props.url}
          </Link>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UseCaseCard;

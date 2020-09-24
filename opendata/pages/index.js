import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';


// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home({data}) {

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-start"
        style={{width: '80%', margin: '50px 0 0 50px' }}
      >
        <Grid item>
          <Paper style={{width: '100px', height: '400px', backgroundColor: 'lightBlue'}}>
              <p>Filter</p>
          </Paper>
        </Grid>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          style={{width: '80%'}}
        >
          {
          Object.values(data).map(dataset => (
            <Grid item key={dataset.id}>
              <Paper style={{width: '100%', height: '100px', margin: '0 0 0 50px', backgroundColor: 'lightBlue'}}>
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
              </Paper>
            </Grid>
          ))
          }
        </Grid>
    </Grid> 
    </div>
  )
}

// ALERT: This ships HTTPS validation and should not be used when we are handling personal information and authentication etc.
function createRequestOptions(skipHttpsValidation) {
  const isNode = typeof window === 'undefined';
  if (isNode) {
      var Agent = (require('https')).Agent;
      return {
          agent: new Agent({ rejectUnauthorized: !skipHttpsValidation })
      };
  }
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const uri = 'https://localhost:5001/api/datasets';
  const res = await fetch(uri, createRequestOptions(true))
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

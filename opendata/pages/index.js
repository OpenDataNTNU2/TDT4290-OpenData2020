import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';


// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {

  const uri = 'https://localhost:5001/api/datasets';
  const [datasets, setDatasets] = useState("empty");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if(!isLoaded){
      getDatasets();
    }
    console.log(datasets);
  });

  function getDatasets() {
    fetch(uri)
      .then(response => response.json())
      .then((data) => {
        setIsLoaded(true);
        setDatasets(data);
      })
      .catch(error => console.error('Unable to get datasets.', error));
  }


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
          {!isLoaded ? <p>Loading...</p> : 
          Object.values(datasets).map(dataset => (
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

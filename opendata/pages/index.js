import React from 'react';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import Filter from '../Components/Filter'


// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home({ data }) {

  return (
    <div className='datakatalog'>
      <Grid
        container
        style={{ padding: '3%' }}
        justify='space-evenly'
      >
        <Grid item xs={2} >
          <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '7%' }}>
            <Filter />
          </Paper>
        </Grid>
        <Grid
          container
          direction="column"
          xs={8}
          spacing={3}
        >
          {
            Object.values(data).map(dataset => (
              <Grid item key={dataset.id}>
                <Paper variant='outlined' style={{ height: '15vh', padding: '1%' }}>
                  <Grid container alignItems='center'>
                    <Grid item xs={9}>
                      <h3>{dataset.title}</h3>
                      <p>{dataset.description}</p>
                    </Grid>
                    <Grid item xs={2}>
                      <Paper elevation={0} style={{ backgroundColor: '#D6FFD2', textAlign: 'center', padding: '3%', marginBottom: '3%' }}>Publisert</Paper>
                      <Paper elevation={0} style={{ backgroundColor: '#EBE4FF', textAlign: 'center', padding: '3%' }}>Samordna</Paper>
                    </Grid>
                  </Grid>

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
  // Should be changed to host link when this is done, not localhost.
  const uri = 'https://localhost:5001/api/datasets';
  const res = await fetch(uri, createRequestOptions(true))
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

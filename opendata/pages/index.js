import React from 'react';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';


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
          <Paper style={{ backgroundColor: 'lightBlue', height: "100%" }}>
            <p>Filter</p>
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
                  <Grid container>
                    <Grid item xs={9}>
                      <h3>{dataset.title}</h3>
                      <p>{dataset.description}</p>
                    </Grid>
                    <Grid item xs={2}>
                      <div>
                        Tag
                      </div>
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

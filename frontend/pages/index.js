import React from 'react';
import { Grid, Paper } from '@material-ui/core'
import Filter from '../Components/Filter'
import DatasetCard from '../Components/DatasetCard';
import { useRouter } from 'next/router'
import { parseCookies } from '../utils/parseCookies'

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home({ data, prevLoggedIn = false, prevLoggedUsername = "", prevPublisherId = "-1", prevUserId = "-1" }) {
  const router = useRouter();

  const onClick = (id) => { router.push('/DetailedDataset/' + id) }
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
          item
          xs={8}
        >
          {
            Object.values(data).map(dataset => (
              <DatasetCard key={dataset.id} dataset={dataset} onClick={() => onClick(dataset.id)} />
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
export async function getServerSideProps({ req }) {
  // Fetch data from external API
  // Should be changed to host link when this is done, not localhost.
  const uri = 'https://localhost:5001/api/datasets';
  const res = await fetch(uri, createRequestOptions(true))
  const data = await res.json()

  const cookies = parseCookies(req);

  let propsData = { props: { data } }

  if (JSON.stringify(cookies) !== "{}") {
    propsData = {
      props: {
        data,
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
      }
    }
  }
  console.log(cookies)

  return propsData


}

  // Pass data to the page via props



import React from 'react';
import { Grid, Paper } from '@material-ui/core'

import DatasetCard from '../Components/DatasetCard';
import Search from '../Components/Search'

// import filters
import FilterPublisher from '../Components/Filters/FilterPublisher'
import FilterCategory from '../Components/Filters/FilterCategory'
import FilterTag from '../Components/Filters/FilterTag'

import { useRouter } from 'next/router'
import {PageRender} from './api/serverSideProps';

import {useState,useEffect} from 'react'

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {
  const router = useRouter();


  const url = 'https://localhost:5001/api/datasets'
  const sUrl = '?Search='
  const fUrl = '&PublisherIds='
  const [filterPublishersUrl, setFilterPublishersUrl] = useState("")

  
  const [searchUrl, setSearchUrl] = useState("")

  const [datasets, setDatasets] = useState({})

  const getDatasets = async () => {
    try{
        fetch(url + sUrl + searchUrl + fUrl + filterPublishersUrl, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(response => {
            setDatasets(response.items);
            console.log("fetched")
        })
    }
    catch(_){
        console.log("failed to fetch datasets")
    }
    
}

  useEffect(() => {
    getDatasets()
  }, [filterPublishersUrl])

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
            <FilterPublisher url={filterPublishersUrl} setUrl={setFilterPublishersUrl} />
          </Paper>
          <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '7%', marginTop: "7%" }}>
            <FilterCategory  />
          </Paper>
          <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '7%', marginTop: "7%" }}>
            <FilterTag  />
          </Paper>
        </Grid>
        <Grid
          item
          xs={8}
        >
          
          <Search setSearchUrl={setSearchUrl} searchUrl={searchUrl} getDatasets={getDatasets} />

          {
            Object.values(datasets).map(d => (
              <DatasetCard key={d.id} dataset={d} onClick={() => onClick(d.id)} />
            ))
          }
          
          
        </Grid>
      </Grid>
    </div>
  )
}



// This gets called on every request
export async function getServerSideProps(context) {
  const propsData = PageRender("index", context)
  return propsData


}

  // Pass data to the page via props



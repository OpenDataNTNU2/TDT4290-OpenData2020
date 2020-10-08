import React from 'react';
import { Grid, Paper } from '@material-ui/core'

import DatasetCard from '../Components/DatasetCard';
import Search from '../Components/Search'

// import filters
import FilterPublisher from '../Components/Filters/FilterPublisher'
import FilterCategory from '../Components/Filters/FilterCategory'
import FilterTag from '../Components/Filters/FilterTag'

import { useRouter } from 'next/router'
import { parseCookies } from '../utils/parseCookies'

import {useState,useEffect} from 'react'

import InfiniteScroll from "react-infinite-scroll-component";

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home({ data, prevLoggedIn = false, prevLoggedUsername = "", prevPublisherId = "-1", prevUserId = "-1" }) {
  const router = useRouter();


  const url = 'https://localhost:5001/api/datasets'
  const sUrl = '?Search='
  const fUrl = '&PublisherIds='
  const pUrl = '&Page='
  const items = '&ItemsPerPage=10'

  const [searchUrl, setSearchUrl] = useState("")
  const [filterPublishersUrl, setFilterPublishersUrl] = useState("")

  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [changedFilter, setChangedFilter] = useState(false)

  const [datasets, setDatasets] = useState([])

  const getDatasets = async () => {
    if(changedFilter) setPage(1)
    
    try{
        fetch(url + sUrl + searchUrl + fUrl + filterPublishersUrl + pUrl + page + items, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(response => {
            if(totalItems > 10 && datasets.length !== 0 && !changedFilter && searchUrl === ""){
              let newArr = datasets
              for(let i = 0; i < 10; i++){
                newArr.push(response.items[i])
              }
              setDatasets(newArr)
              
            }
            else{
              setDatasets(response.items);
              setChangedFilter(false)
              setHasMore(true)
              console.log("fetched")
          }
          setTotalItems(response.totalItems)
            
        })
        console.log(url + sUrl + searchUrl + fUrl + filterPublishersUrl + pUrl + page + items)
    }
    catch(_){
        console.log("failed to fetch datasets")
        setDatasets([])
    }
    if((page) * 10 > totalItems && totalItems !== 0){ console.log("setter til false");setHasMore(false)}
   
}

  useEffect(() => {
    getDatasets()
  }, [page, prevLoggedIn, filterPublishersUrl])


  

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
            <FilterPublisher url={filterPublishersUrl} setUrl={setFilterPublishersUrl} setPage={setPage} changed={changedFilter} setChanged={setChangedFilter} update={prevLoggedIn} />
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
          
          <InfiniteScroll
            dataLength={page * 10}
            next={() => setPage(page + 1)}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >

          {
            Object.values(datasets).map(d => (
              <DatasetCard key={d.id} dataset={d} onClick={() => onClick(d.id)} />
            ))
          }
          
          </InfiniteScroll>

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



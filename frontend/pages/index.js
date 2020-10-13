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

import InfiniteScroll from "react-infinite-scroll-component";

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {
  const router = useRouter();


  const url = 'https://localhost:5001/api/datasets'
  const sUrl = '?Search='
  const fUrl = '&PublisherIds='
  const fcUrl = '&CategoryIds='
  const pUrl = '&Page='
  const items = '&ItemsPerPage=10'

  const [searchUrl, setSearchUrl] = useState("")
  const [filterPublishersUrl, setFilterPublishersUrl] = useState("")
  const [filterCategoriesUrl, setFilterCategoriesUrl] = useState("")

  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [changedFilter, setChangedFilter] = useState(false)
  

  const [datasets, setDatasets] = useState([])
  
  const [loader, setLoader] = useState('Loading...')

  
  const getDatasets = async (p = page, c = false, s = searchUrl) => {
    if(changedFilter) setPage(1)
    if(!hasMore && c) {p = 1; setPage(1); setHasMore(true)}
    try{
        fetch(url + sUrl + s + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + p + items, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(response => {
          if(response.totalItems === 0){
            setLoader('No items found')
          }
          else if(response.totalItems !== 0){
            if(loader !== 'Loading...') { setLoader('Loading...') }
            if(response.totalItems > 10) { setHasMore(true) }
            else{setHasMore(false)}
          }
          if(response.totalItems > 10 && datasets.length !== 0 && !changedFilter && !c){
            let newArr = datasets
            for(let i = 0; i < 10; i++){
              newArr.push(response.items[i])
            }
            setDatasets(newArr)
            
          }
          else{
            
            setDatasets(response.items);
            setChangedFilter(false)
          }
          setTotalItems(response.totalItems)
        })
    }
    catch(_){
        console.log("failed to fetch datasets")
    }
    if((page) * 10 > totalItems && totalItems !== 1 && hasMore){ 
      setHasMore(false)
    }
    console.log(url + sUrl + s + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + p + items)
}
  

  useEffect(() => {
    getDatasets()
  }, [page, filterPublishersUrl, filterCategoriesUrl])


  

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
            <FilterPublisher url={filterPublishersUrl} setUrl={setFilterPublishersUrl} setPage={setPage} changed={changedFilter} setChanged={setChangedFilter} />
          </Paper>
          <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '7%', marginTop: "7%" }}>
            <FilterCategory url={filterCategoriesUrl} setUrl={setFilterCategoriesUrl}  />
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
            loader={<h4>{loader}</h4>}
          >

          {
            Object.values(datasets).map(d => (
              d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick(d.id)} />
            ))
          }
          {loader === 'No items found' ? <h4>Søket ga dessverre ingen treff</h4> : null}
          </InfiniteScroll>

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



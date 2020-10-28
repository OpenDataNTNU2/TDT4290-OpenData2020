import React, { useState, useEffect } from 'react';
import { Grid, MenuItem, FormControl, InputLabel, Select, Button } from '@material-ui/core';

import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import DatasetCard from '../Components/DatasetCard';
import CoordinationCard from '../Components/CoordinationCard';
import Search from '../Components/Search';

// icons
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';

// import filters
import FilterPublisher from '../Components/Filters/FilterPublisher';
import FilterCategory from '../Components/Filters/FilterCategory';
import FilterTag from '../Components/Filters/FilterTag';

import { PageRender } from './api/serverSideProps';
import GetApi from '../Components/ApiCalls/GetApi';

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {
  const router = useRouter();

  const url = 'https://localhost:5001/api/'

  const [urlType, setUrlType] = useState('both');

  const sUrl = '?Search=';
  const fUrl = '&PublisherIds=';
  const fcUrl = '&CategoryIds=';
  const pUrl = '&Page=';
  const items = '&ItemsPerPage=10';
  const sortUrl = '&SortOrder=';

  const [searchUrl, setSearchUrl] = useState('');
  const [filterPublishersUrl, setFilterPublishersUrl] = useState('');
  const [filterCategoriesUrl, setFilterCategoriesUrl] = useState('');

  const [sortType, setSortType] = useState('title_asc');


  const [page, setPage] = useState(1);

  const [totalItemsDatasets, setTotalItemsDatasets] = useState(0);
  const [totalItemsCoordinations, setTotalItemsCoordinations] = useState(0)

  const [hasMore, setHasMore] = useState(true);

  const [changedFilter, setChangedFilter] = useState(false);

  const [datasets, setDatasets] = useState([]);
  const [coordinations, setCoordinations] = useState([]);

  const [loader, setLoader] = useState('Loading...');


  const fetchContent = async (value = searchUrl) => {
    if (value !== searchUrl) {
      setSearchUrl(value)
    }
    setPage(1)
    if (urlType === 'both') {
      GetApi(url + 'datasets' + sUrl + value + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + "1" + items + sortUrl + sortType, addDatasets)
      GetApi(url + 'coordinations' + sUrl + value + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + "1" + items + sortUrl + sortType, addCoordinations)
    }
    else {
      GetApi(url + urlType + sUrl + value + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + "1" + items + sortUrl + sortType, addToEmptyList)
    }
    console.log(url + urlType + sUrl + value + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + "1" + items + sortUrl + sortType)
  }

  const addDatasets = (response) => {
    setDatasets(response.items)
    setTotalItemsDatasets(response.totalItems)
    if (response.totalItems > response.items.length) {
      setHasMore(true)
    }
    else { setHasMore(false) }
  }

  const addCoordinations = (response) => {
    setCoordinations(response.items)
    setTotalItemsCoordinations(response.totalItems)
    if (response.totalItems > response.items.length) {
      setHasMore(true)
    }
    else { setHasMore(false) }
  }

  const addToEmptyList = (response) => {
    if (urlType === 'datasets') {
      setDatasets(response.items)
      setTotalItemsDatasets(response.totalItems)
      if (response.totalItems > response.items.length) {
        setHasMore(true)
      }
      else { setHasMore(false) }
    }
    else if (urlType === 'coordinations') {
      setCoordinations(response.items)
      setTotalItemsCoordinations(response.totalItems)
      if (response.totalItems > response.items.length) {
        setHasMore(true)
      }
      else { setHasMore(false) }
    }
  }

  const fetchNextPage = async () => {
    if (urlType === 'both') {
      if (totalItemsDatasets >= datasets.length) {
        GetApi(url + "datasets" + sUrl + searchUrl + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + page + items + sortUrl + sortType, addDatasetsToExisting)
      }
      if (totalItemsCoordinations >= coordinations.length) {
        GetApi(url + "coordinations" + sUrl + searchUrl + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + page + items + sortUrl + sortType, addCoordinationsToExisting)
      }
    }
    else if (urlType === 'datasets') {
      if (totalItemsDatasets >= datasets.length) {
        GetApi(url + urlType + sUrl + searchUrl + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + page + items + sortUrl + sortType, addDatasetsToExisting)
      }
    }
    else {
      if (totalItemsCoordinations >= coordinations.length) {
        GetApi(url + urlType + sUrl + searchUrl + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + page + items + sortUrl + sortType, addCoordinationsToExisting)
      }
    }
    console.log(url + urlType + sUrl + searchUrl + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + page + items + sortUrl + sortType)

  }

  const addCoordinationsToExisting = (response) => {
    if (totalItemsDatasets > datasets.length || totalItemsCoordinations > coordinations.length) {
      setHasMore(true)
    }
    else { setHasMore(false) }
    if (totalItemsDatasets > coordinations.length) {
      if (loader !== 'Loading...') {
        setLoader('Loading...')
      }
      if (response.totalItems > 10) {

        const newArr = coordinations;
        for (let i = 0; i < 10; i += 1) {
          newArr.push(response.items[i]);
        }
        setCoordinations(newArr);
      }
    }
    setLoader('No more items')
    setTotalItemsCoordinations(response.totalItems);
  }

  const addDatasetsToExisting = (response) => {
    if (totalItemsDatasets > datasets.length || totalItemsCoordinations > coordinations.length) {
      setHasMore(true)
    }
    else { setHasMore(false) }


    if (totalItemsDatasets > datasets.length) {
      if (loader !== 'Loading...') {
        setLoader('Loading...')
      }
      if (response.totalItems > 10) {

        const newArr = datasets;
        for (let i = 0; i < 10; i += 1) {
          newArr.push(response.items[i]);
        }
        setDatasets(newArr);

      }
    }
    setLoader('No more items')
    setTotalItemsDatasets(response.totalItems);

  }


  useEffect(() => {
    if (page !== 1 && (coordinations.length < totalItemsCoordinations || datasets.length < totalItemsDatasets)) {
      fetchNextPage()
    }
    console.log(page)
  }, [page])


  useEffect(() => {
    fetchContent()
  }, [filterPublishersUrl, filterCategoriesUrl, urlType]);

  const changeUrl = (value) => {
    switch (value) {
      case 'both': { setUrlType(value); }
      case 'datasets': { setUrlType("datasets"); }
      case 'coordinations': { setUrlType("coordinations"); }
    }

    setDatasets([]);
    setCoordinations([])

    setUrlType(value);

  };

  const onClick = (path, id) => {
    router.push(path + id);
  };

  const changeSort = (type) => {
    setDatasets([]);
    setCoordinations([])

    setSortType(type);
    setPage(1);

    fetchContent()

  };

  const getSortButtons = () => {
    switch (sortType) {
      case 'title_asc':
        return (
          <div style={{ marginLeft: '1vh' }}>
            <Button
              variant="contained"
              onClick={() => changeSort('title_desc')}
              color={'primary'}
              style={{ marginRight: '1vh' }}
            >
              <ArrowDownward />
              Sortert på tittel
            </Button>
            <Button variant="contained" onClick={() => changeSort('date_asc')}>
              Sorter på dato
            </Button>
          </div>
        );
      case 'title_desc':
        return (
          <div style={{ marginLeft: '1vh' }}>
            <Button
              variant="contained"
              onClick={() => changeSort('title_asc')}
              color={'primary'}
              style={{ marginRight: '1vh' }}
            >
              <ArrowUpward />
              Sortert på tittel
            </Button>
            <Button variant="contained" onClick={() => changeSort('date_asc')}>
              Sorter på dato
            </Button>
          </div>
        );
      case 'date_asc':
        return (
          <div style={{ marginLeft: '1vh' }}>
            <Button variant="contained" onClick={() => changeSort('title_asc')} style={{ marginRight: '1vh' }}>
              Sorter på tittel
            </Button>
            <Button variant="contained" onClick={() => changeSort('date_desc')} color={'primary'}>
              <ArrowDownward />
              Sortert på dato
            </Button>
          </div>
        );
      case 'date_desc':
        return (
          <div style={{ marginLeft: '1vh' }}>
            <Button variant="contained" onClick={() => changeSort('title_asc')} style={{ marginRight: '1vh' }}>
              Sorter på tittel
            </Button>
            <Button variant="contained" onClick={() => changeSort('date_asc')} color={'primary'}>
              <ArrowUpward />
              Sortert på dato
            </Button>
          </div>
        );

      default:
        return '';
    }
  };

  const checkIsMore = () => {
    console.log("check has more: " + totalItemsDatasets + " : " + datasets.length)
    console.log("check has more: " + totalItemsCoordinations + " : " + coordinations.length)
    if (urlType === 'both' && (totalItemsDatasets > datasets.length || totalItemsCoordinations > coordinations.length)) {
      setPage(page + 1)
    }
    else if (urlType === 'datasets' && totalItemsDatasets > datasets.length) {
      setPage(page + 1)
    }
    else if (urlType === 'coordinations' && totalItemsCoordinations > coordinations.length) {
      setPage(page + 1)
    }
  }

  return (
    <div className="datakatalog">
      <Grid container style={{ padding: '3%', marginTop: '50px' }} justify="space-evenly">
        <Grid item xs={2}>
          <FilterPublisher
            url={filterPublishersUrl}
            setUrl={setFilterPublishersUrl}

            setPage={setPage}
            changed={changedFilter}
            setChanged={setChangedFilter}
            type={urlType}
          />
          <FilterCategory
            url={filterCategoriesUrl}
            setUrl={setFilterCategoriesUrl}

            type={urlType}
          />
          <FilterTag />
        </Grid>
        <Grid item xs={8}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Search
              setSearchUrl={setSearchUrl}
              searchUrl={searchUrl}
              getDatasets={fetchContent}
              urlType={urlType}
              sortType={sortType}
              functions={[setDatasets, setCoordinations]}
            />

            {/* Midlertidig select bar, bør opprette et form */}
            <FormControl variant="outlined" style={{ width: '200px' }}>
              <InputLabel id="demo-simple-select-label">Datasett / Samordning</InputLabel>
              <Select
                labelId="chooseWhatToView"
                label="Datasett / Samordning"
                id="chooseWhatToViewId"
                value={urlType}
                onChange={(event) => changeUrl(event.target.value)}
              >
                <MenuItem value="both">Alle</MenuItem>
                <MenuItem value="datasets">Dataset</MenuItem>
                <MenuItem value="coordinations">Samordning</MenuItem>

              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2vh' }}>
            {getSortButtons()}
          </div>
          <InfiniteScroll
            dataLength={page * 10}
            next={checkIsMore}
            hasMore={hasMore}
            loader={<h4>{loader}</h4>}
          >
            {urlType === 'both' ?
              <div>
                {coordinations && coordinations != [] && <h2 style={{ marginLeft: "1.5vh", fontWeight: 'normal' }}>Samordninger: </h2>}
                {coordinations && coordinations !== [] &&
                  Object.values(coordinations).map(
                    (c) =>
                      c && (
                        <CoordinationCard
                          key={c.id}
                          id={c.id}
                          coordination={c}
                          onClick={() => onClick('/DetailedCoordination/', c.id)}
                        />
                      )
                  )}
                <br />
                {datasets && datasets != [] && <h2 style={{ marginLeft: "1.5vh", fontWeight: 'normal' }}>Datasett: </h2>}
                {datasets && datasets !== [] &&
                  Object.values(datasets).map(
                    (d) => d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
                  )}

              </div>
              : urlType === 'datasets' && datasets && datasets !== [] ?
                Object.values(datasets).map(
                  (d) => d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
                )
                : urlType === 'coordinations' && coordinations && coordinations !== [] &&
                Object.values(coordinations).map(
                  (c) =>
                    c && (
                      <CoordinationCard
                        key={c.id}
                        id={c.id}
                        coordination={c}
                        onClick={() => onClick('/DetailedCoordination/', c.id)}
                      />
                    )
                )
            }
            {/*url === 'https://localhost:5001/api/datasets' ? (
              datasets &&
              datasets !== [] &&
              Object.values(datasets).map(
                (d) => d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
              )
            ) : url === 'https://localhost:5001/api/coordinations' ? (
              datasets &&
              datasets !== [] &&
              Object.values(datasets).map(
                (c) =>
                  c && (
                    <CoordinationCard
                      key={c.id}
                      id={c.id}
                      coordination={c}
                      onClick={() => onClick('/DetailedCoordination/', c.id)}
                    />
                  )
              )
            ) : (
                  <p>laster...</p>
            )*/}
            {loader === 'No items found' ? <h4>Søket ga dessverre ingen treff</h4> : null}
          </InfiniteScroll>
        </Grid>
      </Grid>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const propsData = PageRender('index', context);
  return propsData;
}

// Pass data to the page via props

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
import FilterAccess from '../Components/Filters/FilterAccess';

import { PageRender } from './api/serverSideProps';
import GetApi from '../Components/ApiCalls/GetApi';

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {
  const router = useRouter();

  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;
  const [url] = useState(`${host}/api/`);
  const [urlType, setUrlType] = useState('both');

  const sUrl = '?Search=';
  const fUrl = '&PublisherIds=';
  const fcUrl = '&CategoryIds=';
  const fpStatus = '&PublicationStatuses=';
  const faLevel = '&AccessLevels=';
  const pUrl = '&Page=';
  const items = '&ItemsPerPage=10';
  const sortUrl = '&SortOrder=';

  const [searchUrl, setSearchUrl] = useState('');
  const [filterPublishersUrl, setFilterPublishersUrl] = useState('');
  const [filterCategoriesUrl, setFilterCategoriesUrl] = useState('');
  const [filterPublishStatus, setFilterPublishStatus] = useState('');
  const [filterAccessLevel, setFilterAccessLevel] = useState('');

  const [sortType, setSortType] = useState('title_asc');
  const [page, setPage] = useState(1);
  const [coordinationPage, setCoordinationPage] = useState(1);

  const [totalItemsDatasets, setTotalItemsDatasets] = useState(0);
  const [totalItemsCoordinations, setTotalItemsCoordinations] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [coordinationHasMore, setCoordinationHasMore] = useState(true);

  const [datasets, setDatasets] = useState([]);
  const [coordinations, setCoordinations] = useState([]);

  const [loader, setLoader] = useState('Loading...');

  const addDatasets = (response) => {
    setDatasets(response.items);
    setTotalItemsDatasets(response.totalItems);
    if (response.totalItems > response.items.length) {
      setHasMore(true);
    }
  };

  const addCoordinations = (response) => {
    setCoordinations(response.items);
    setTotalItemsCoordinations(response.totalItems);
    if (response.totalItems > response.items.length) {
      setCoordinationHasMore(true);
    }
  };

  const addToEmptyList = (response) => {
    if (urlType === 'datasets') {
      setDatasets(response.items);
      setTotalItemsDatasets(response.totalItems);
      if (response.totalItems > response.items.length) {
        setHasMore(true);
      }
    } else if (urlType === 'coordinations') {
      setCoordinations(response.items);
      setTotalItemsCoordinations(response.totalItems);
      if (response.totalItems > response.items.length) {
        setCoordinationHasMore(true);
      }
    }
  };

  const addCoordinationsToExisting = (response) => {
    if (totalItemsCoordinations > coordinations.length) {
      if (loader !== 'Loading...') {
        setLoader('Loading...');
      }
      if (response.totalItems > 10) {
        const newArr = coordinations;
        for (let i = 0; i < 10; i += 1) {
          newArr.push(response.items[i]);
        }
        setCoordinations(newArr);
      }
    }
    setLoader('No more items');
    setTotalItemsCoordinations(response.totalItems);
  };

  const addDatasetsToExisting = (response) => {
    if (totalItemsDatasets > datasets.length) {
      if (loader !== 'Loading...') {
        setLoader('Loading...');
      }
      if (response.totalItems > 10) {
        const newArr = datasets;
        for (let i = 0; i < 10; i += 1) {
          newArr.push(response.items[i]);
        }
        setDatasets(newArr);
      }
    }
    setLoader('No more items');
    setTotalItemsDatasets(response.totalItems);
  };

  const fetchContent = async (value = searchUrl) => {
    if (value !== searchUrl) {
      setSearchUrl(value);
    }
    setPage(1);
    setCoordinationPage(1);
    if (urlType === 'both') {
      GetApi(
        url +
          'datasets' +
          sUrl +
          value +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          '1' +
          items +
          sortUrl +
          sortType,
        addDatasets
      );
      GetApi(
        url +
          'coordinations' +
          sUrl +
          value +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          '1' +
          items +
          sortUrl +
          sortType,
        addCoordinations
      );
    } else {
      GetApi(
        url +
          urlType +
          sUrl +
          value +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          '1' +
          items +
          sortUrl +
          sortType,
        addToEmptyList
      );
    }
    console.log(
      'Fetching from url: ' +
        url +
        urlType +
        sUrl +
        value +
        fUrl +
        filterPublishersUrl +
        fcUrl +
        filterCategoriesUrl +
        fpStatus +
        filterPublishStatus +
        faLevel +
        filterAccessLevel +
        pUrl +
        '1' +
        items +
        sortUrl +
        sortType
    );
  };

  const fetchNextDatasetPage = async () => {
    if (totalItemsDatasets >= datasets.length) {
      GetApi(
        url +
          'datasets' +
          sUrl +
          searchUrl +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          page +
          items +
          sortUrl +
          sortType,
        addDatasetsToExisting
      );
    }
    console.log(
      'Fetching from url: ' +
        url +
        'datasets' +
        sUrl +
        searchUrl +
        fUrl +
        filterPublishersUrl +
        fcUrl +
        filterCategoriesUrl +
        fpStatus +
        filterPublishStatus +
        faLevel +
        filterAccessLevel +
        pUrl +
        page +
        items +
        sortUrl +
        sortType
    );
  };

  const fetchNextCoordinationPage = async () => {
    if (totalItemsCoordinations >= coordinations.length) {
      GetApi(
        url +
          'coordinations' +
          sUrl +
          searchUrl +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          coordinationPage +
          items +
          sortUrl +
          sortType,
        addCoordinationsToExisting
      );
      console.log(
        'Fetching from url: ' +
          url +
          'coordinations' +
          sUrl +
          searchUrl +
          fUrl +
          filterPublishersUrl +
          fcUrl +
          filterCategoriesUrl +
          fpStatus +
          filterPublishStatus +
          faLevel +
          filterAccessLevel +
          pUrl +
          coordinationPage +
          items +
          sortUrl +
          sortType
      );
    }
  };

  useEffect(() => {
    switch (urlType) {
      case 'both': {
        if (coordinations.length < totalItemsCoordinations) {
          setCoordinationHasMore(true);
          fetchNextCoordinationPage();
        } else if (datasets.length < totalItemsDatasets) {
          setHasMore(true);
          fetchNextDatasetPage();
        }
        break;
      }
      case 'datasets': {
        if (datasets.length < totalItemsDatasets) {
          setHasMore(true);
          fetchNextDatasetPage();
        }
        break;
      }
      case 'coordinations': {
        if (coordinations.length < totalItemsCoordinations) {
          setCoordinationHasMore(true);
          fetchNextCoordinationPage();
        }
        break;
      }
    }
  }, [page, coordinationPage]);

  useEffect(() => {
    setDatasets([]);
    setCoordinations([]);
    fetchContent();
  }, [filterPublishersUrl, filterCategoriesUrl, urlType, filterPublishStatus, filterAccessLevel]);

  const changeUrl = (value) => {
    switch (value) {
      case 'both': {
        setUrlType(value);
        break;
      }
      case 'datasets': {
        setUrlType('datasets');
        break;
      }
      case 'coordinations': {
        setUrlType('coordinations');
        break;
      }
    }
    setDatasets([]);
    setCoordinations([]);
    setUrlType(value);
  };

  const onClick = (path, id) => {
    router.push(path + id).then(() => window.scrollTo(0, 0));
  };

  const changeSort = (type) => {
    setDatasets([]);
    setCoordinations([]);
    setSortType(type);
    setPage(1);
    setCoordinationPage(coordinationPage + 1);
    fetchContent();
  };

  const getSortButtons = () => {
    switch (sortType) {
      case 'title_asc':
        return (
          <div>
            <Button
              variant="contained"
              onClick={() => changeSort('title_desc')}
              color={'primary'}
              style={{ marginRight: '10px' }}
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
          <div>
            <Button
              variant="contained"
              onClick={() => changeSort('title_asc')}
              color={'primary'}
              style={{ marginRight: '10px' }}
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
          <div>
            <Button variant="contained" onClick={() => changeSort('title_asc')} style={{ marginRight: '10px' }}>
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
          <div>
            <Button variant="contained" onClick={() => changeSort('title_asc')} style={{ marginRight: '10px' }}>
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
    if (urlType === 'both') {
      if (totalItemsCoordinations > coordinations.length) {
        setCoordinationPage(coordinationPage + 1);
        setCoordinationHasMore(true);
      } else if (totalItemsDatasets > datasets.length) {
        setPage(page + 1);
        setHasMore(true);
      }
    } else if (urlType === 'datasets' && totalItemsDatasets > datasets.length) {
      setPage(page + 1);
      setHasMore(true);
    } else if (urlType === 'coordinations' && totalItemsCoordinations > coordinations.length) {
      setCoordinationPage(coordinationPage + 1);
      setCoordinationHasMore(true);
    } else {
      setHasMore(false);
      setCoordinationHasMore(false);
    }
  };

  const coordinationInfiniteScroll = () => {
    return (
      <InfiniteScroll
        dataLength={coordinationPage * 10}
        next={checkIsMore}
        hasMore={coordinationHasMore}
        loader={<h4>{loader}</h4>}
      >
        <div>
          {coordinations && coordinations != [] && (
            <h2 style={{ marginLeft: '1.5vh', fontWeight: 'normal' }}>Samordninger: </h2>
          )}
          {coordinations && coordinations.length !== 0 ? (
            Object.values(coordinations).map(
              (c, index) =>
                c && (
                  <CoordinationCard
                    key={'coordinationBoth' + c.id + index}
                    id={c.id}
                    coordination={c}
                    onClick={() => onClick('/DetailedCoordination/', c.id)}
                  />
                )
            )
          ) : (
            <h3 style={{ marginLeft: '1.5vh', fontWeight: 'normal' }}>Fant ingen samordninger</h3>
          )}
        </div>
      </InfiniteScroll>
    );
  };

  const datasetInfiniteScroll = () => {
    return (
      <InfiniteScroll dataLength={page * 10} next={checkIsMore} hasMore={hasMore} loader={<h4>{loader}</h4>}>
        <div>
          <br />
          {datasets && datasets != [] && <h2 style={{ marginLeft: '1.5vh', fontWeight: 'normal' }}>Datasett: </h2>}
          {datasets && datasets.length !== 0 ? (
            Object.values(datasets).map(
              (d, index) =>
                d && (
                  <DatasetCard
                    key={'datasetBoth' + d.id + index}
                    dataset={d}
                    onClick={() => onClick('/DetailedDataset/', d.id)}
                  />
                )
            )
          ) : (
            <h3 style={{ marginLeft: '1.5vh', fontWeight: 'normal' }}>Fant ingen datasett</h3>
          )}
        </div>
      </InfiniteScroll>
    );
  };

  const bothInfiniteScroll = () => {
    return (
      <div>
        {coordinationInfiniteScroll()}
        {datasetInfiniteScroll()}
      </div>
    );
  };

  return (
    <div className="datakatalog">
      <Grid container style={{ padding: '3%', marginTop: '50px' }} justify="space-evenly">
        <Grid item xs={2}>
          <FilterPublisher url={filterPublishersUrl} setUrl={setFilterPublishersUrl} setPage={setPage} type={urlType} />
          <FilterCategory url={filterCategoriesUrl} setUrl={setFilterCategoriesUrl} type={urlType} />

          <FilterAccess setFilterPublishStatus={setFilterPublishStatus} setFilterAccessLevel={setFilterAccessLevel} />
        </Grid>
        <Grid item xs={8}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Search
              setSearchUrl={setSearchUrl}
              searchUrl={searchUrl}
              getDatasets={fetchContent}
              urlType={urlType}
              sortType={sortType}
              functions={[setDatasets, setCoordinations]}
            />

            {/* Midlertidig select bar, bør kanskje bruke en form */}
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: '20px 0 40px 10px',
            }}
          >
            {getSortButtons()}
          </div>
          {urlType === 'both'
            ? totalItemsCoordinations > coordinations.length
              ? coordinationInfiniteScroll()
              : bothInfiniteScroll()
            : urlType === 'datasets'
            ? datasetInfiniteScroll()
            : urlType === 'coordinations'
            ? coordinationInfiniteScroll()
            : 'TOMT'}
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

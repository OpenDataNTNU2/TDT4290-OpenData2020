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

// Home page, I think this can be the Data catalogue, just change the name from home to datacatalogue or something
export default function Home() {
  const router = useRouter();

  const [url, setUrl] = useState('https://localhost:5001/api/datasets');

  // const url = 'https://localhost:5001/api/datasets'
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
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [changedFilter, setChangedFilter] = useState(false);

  const [datasets, setDatasets] = useState([]);

  const [loader, setLoader] = useState('Loading...');

  const getDatasets = async (p = page, c = false, s = searchUrl, st = sortType) => {
    if (s !== searchUrl) setSearchUrl(s);
    if (st !== sortType) setSortType(st);
    if (changedFilter) {
      setPage(1);
      setDatasets([]);
    }
    if (!hasMore && c) {
      /* p = 1; */
      setPage(1);
      setHasMore(true);
    }
    try {
      fetch(
        url + sUrl + s + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + p + items + sortUrl + st,
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.totalItems === 0) {
            setLoader('No items found');
          } else if (response.totalItems !== 0) {
            if (loader !== 'Loading...') {
              setLoader('Loading...');
            }
            if (response.totalItems > 10) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          }
          if (response.totalItems > 10 && datasets.length !== 0 && !changedFilter && !c) {
            const newArr = datasets;
            for (let i = 0; i < 10; i += 1) {
              newArr.push(response.items[i]);
            }
            setDatasets(newArr);
          } else {
            setDatasets(response.items);
            setChangedFilter(false);
          }
          setTotalItems(response.totalItems);
        });
    } catch (_) {
      console.log('failed to fetch datasets');
    }
    if (page * 10 > totalItems && totalItems !== 1 && hasMore) {
      setHasMore(false);
    }

    console.log(
      url + sUrl + s + fUrl + filterPublishersUrl + fcUrl + filterCategoriesUrl + pUrl + p + items + sortUrl + st
    );
  };

  useEffect(() => {
    getDatasets();
  }, [filterPublishersUrl, filterCategoriesUrl, page, url]);

  const changeUrl = (value) => {
    setDatasets([]);
    setUrl(value);
  };

  const onClick = (path, id) => {
    router.push(path + id);
  };

  const changeSort = (type) => {
    setDatasets([]);
    setSortType(type);
    setPage(1);
    getDatasets(1, true, searchUrl, type);
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

  return (
    <div className="datakatalog">
      <Grid container style={{ padding: '3%', marginTop: '50px' }} justify="space-evenly">
        <Grid item xs={2}>
          <FilterPublisher
            url={filterPublishersUrl}
            setUrl={setFilterPublishersUrl}
            isDataset={url.includes('dataset')}
            setPage={setPage}
            changed={changedFilter}
            setChanged={setChangedFilter}
          />
          <FilterCategory
            url={filterCategoriesUrl}
            setUrl={setFilterCategoriesUrl}
            isDataset={url.includes('dataset')}
          />
          <FilterTag />
        </Grid>
        <Grid item xs={8}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Search setSearchUrl={setSearchUrl} searchUrl={searchUrl} getDatasets={getDatasets} />

            {/* Midlertidig select bar, bør opprette et form */}
            <FormControl variant="outlined" style={{ width: '200px' }}>
              <InputLabel id="demo-simple-select-label">Datasett / Samordning</InputLabel>
              <Select
                labelId="chooseWhatToView"
                label="Datasett / Samordning"
                id="chooseWhatToViewId"
                value={url}
                onChange={(event) => changeUrl(event.target.value)}
              >
                <MenuItem value="https://localhost:5001/api/datasets">Dataset</MenuItem>
                <MenuItem value="https://localhost:5001/api/coordinations">Samordning</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2vh' }}>
            {getSortButtons()}
          </div>
          <InfiniteScroll
            dataLength={page * 10}
            next={() => setPage(page + 1)}
            hasMore={hasMore}
            loader={<h4>{loader}</h4>}
          >
            {url === 'https://localhost:5001/api/datasets' ? (
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
            )}
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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from './api/serverSideProps';
import GetApi from '../Components/ApiCalls/GetApi';
import DatasetCard from '../Components/DatasetCard';
import CoordinationCard from '../Components/CoordinationCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'


export default function MyDatasets({ prevLoggedIn, prevLoggedUsername, prevPublisherId = 0 }) {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;


  // Pagination variables
  const [whatToShow, setWhatToShow] = useState('datasets');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1)
  const loader = 'Loading...'

  const [datasets, setDatasets] = useState([]);
  const [coordinations, setCoordinations] = useState([]);

  const [totalItemsDatasets, setTotalItemsDatasets] = useState(0)
  const [totalItemsCoordinations, setTotalItemsCoordinations] = useState(0)


  const setMyDatasets = (d) => {
    if (page !== 1) {
      if (totalItemsDatasets > datasets.length) {
        if (d.totalItems > 10) {
          const newArr = datasets;
          for (let i = 0; i < 10; i += 1) {
            newArr.push(d.items[i]);
          }
          setDatasets(newArr);
          if (newArr.length < d.totalItems) {
            setHasMore(true)
          }
        }
      }
      setTotalItemsDatasets(d.totalItems);
    }
    else {
      setDatasets(d.items);
      setTotalItemsDatasets(d.totalItems)
      if (d.items.length < d.totalItems) {
        setHasMore(true)
      }
    }
  };

  const setMyCoordinations = (c) => {
    if (page !== 1) {
      if (totalItemsCoordinations > coordinations.length) {
        if (d.totalItems > 10) {
          const newArr = coordinations;
          for (let i = 0; i < 10; i += 1) {
            newArr.push(c.items[i]);
          }
          setCoordinations(newArr);
          if (newArr.length < c.totalItems) {
            setHasMore(true)
          }
        }
      }
      setTotalItemsCoordinations(c.totalItems);
    }
    else {
      setCoordinations(c.items);
      setTotalItemsCoordinations(c.totalItems)
      if (c.items.length < c.totalItems) {
        setHasMore(true)
      }
    }

  };

  const fetchContent = async () => {
    if (whatToShow === 'datasets') {
      GetApi(`${host}/api/datasets?PublisherIds=${prevPublisherId}&Page=${page}`, setMyDatasets);
    }
    else if (whatToShow === 'coordinations') {
      GetApi(`${host}/api/coordinations?PublisherIds=${prevPublisherId}&Page=${page}`, setMyCoordinations);
    }
  }


  useEffect(() => {
    if (whatToShow === 'datasets' && datasets.length < totalItemsDatasets) {
      setHasMore(true)
    }
    else if (whatToShow === 'coordinations' && coordinations.length < totalItemsCoordinations) {
      setHasMore(true)
    }
    else {
      setHasMore(false)
    }
    fetchContent()
  }, [page, prevPublisherId, whatToShow, prevLoggedIn])


  const onClick = (path, id) => {
    router.push(path + id).then(() => window.scrollTo(0, 0));
  };

  const getUser = () => {
    let user = JSON.parse(prevLoggedUsername).split('_').slice(-2).join(' ');
    return user.charAt(0).toUpperCase() + user.slice(1);
  };

  const changeWhatToShow = (value) => {
    setWhatToShow(value)
    setPage(1)
    setHasMore(false)
    setDatasets([])
    setCoordinations([])
  }

  const checkIsMore = () => {
    if (whatToShow === 'datasets' && totalItemsDatasets > datasets.length) {
      setPage(page + 1);
      setHasMore(true);
    } else if (whatToShow === 'coordinations' && totalItemsCoordinations > coordinations.length) {
      setPage(page + 1);
    } else {
      setHasMore(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '50px 20vw',
      }}
    >


      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {prevLoggedIn ? (
          <h2 style={{ fontWeight: 500, margin: '30px 10px 50px 10px', fontWeight: 'normal' }}>{getUser()} sine {whatToShow === 'datasets' ? 'datasett:' : 'samordninger:'}</h2>
        ) : null}

        <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
          <FormControl variant="outlined" style={{ width: '200px' }}>
            <InputLabel id="demo-simple-select-label">Datasett / Samordning</InputLabel>
            <Select
              labelId="chooseWhatToView"
              label="Datasett / Samordning"
              id="chooseWhatToViewId"
              value={whatToShow}
              onChange={(event) => changeWhatToShow(event.target.value)}
            >
              <MenuItem value="datasets">Dataset</MenuItem>
              <MenuItem value="coordinations">Samordning</MenuItem>
            </Select>
          </FormControl>
        </div>

      </div>


      <InfiniteScroll
        dataLength={page * 10}
        next={checkIsMore}
        hasMore={hasMore}
        loader={<h4>{loader}</h4>}
      >
        {whatToShow === 'datasets' &&
          Object.values(datasets).map(
            (d) =>
              d && (
                <DatasetCard
                  key={d.id}
                  dataset={d}
                  onClick={() => onClick('/DetailedDataset/', d.id)}
                  pathName="/MyDatasets"
                />
              )
          )
        }

        {whatToShow === 'coordinations' &&
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
        {datasets.length === 0 && whatToShow === 'datasets' && <h3 style={{ fontWeight: 'normal' }}>Ingen datasett</h3>}
        {coordinations.length === 0 && whatToShow === 'coordinations' && <h3 style={{ fontWeight: 'normal' }}>Ingen samordninger</h3>}

      </InfiniteScroll>

    </div>
  );
}

MyDatasets.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    prevLoggedIn: cookies.prevLoggedIn,
    prevLoggedUsername: cookies.prevLoggedUsername,
    prevPublisherId: cookies.prevPublisherId,
    prevUserId: cookies.prevUserId,
  };
};

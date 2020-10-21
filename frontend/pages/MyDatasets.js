import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@material-ui/core';
import { parseCookies } from './api/serverSideProps';
import GetApi from '../Components/ApiCalls/GetApi';
import DatasetCard from '../Components/DatasetCard';
import CoordinationCard from '../Components/CoordinationCard';

// NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet

export default function MyDatasets({ prevLoggedIn, prevLoggedUsername, prevPublisherId = 0 }) {
  const router = useRouter();
  const [datasets, setDatasets] = useState([]);

  const [coordinations, setCoordinations] = useState([]);

  const setMyDatasets = (d) => {
    setDatasets(d.items);
  };

  const setMyCoordinations = (c) => {
    const newArr = c.items;

    setCoordinations(newArr);
  };

  // NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet
  useEffect(() => {
    GetApi(`https://localhost:5001/api/datasets?PublisherIds=${prevPublisherId}`, setMyDatasets);
    GetApi(`https://localhost:5001/api/coordinations?PublisherIds=${prevPublisherId}`, setMyCoordinations);
  }, [prevPublisherId]);

  const onClick = (path, id) => {
    router.push(path + id);
  };

  return (
    <Grid>
      <Grid container spacing={1} direction="column" alignItems="center">
        <br />
        {prevLoggedIn ? (
          <h2 style={{ fontWeight: 'normal' }}>
            {JSON.parse(prevLoggedUsername)}
            sine dataset
          </h2>
        ) : null}
        <br />
        <div style={{ minWidth: '80vh' }}>
          {Object.values(datasets).map(
            (d) =>
              d && (
                <DatasetCard
                  key={d.id}
                  dataset={d}
                  onClick={() => onClick('/DetailedDataset/', d.id)}
                  pathName="/MyDatasets"
                />
              )
          )}
          <Grid container alignItems="stretch" direction="row" />
        </div>

        <div style={{ minWidth: '80vh' }}>
          {Object.values(coordinations).map(
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
        </div>

        {datasets.length === 0 ? <h3 style={{ fontWeight: 'normal' }}>Ingen dataset</h3> : null}
      </Grid>
    </Grid>
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

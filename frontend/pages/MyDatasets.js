import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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

  const getUser = () => {
    let user = JSON.parse(prevLoggedUsername).split('_').slice(-2).join(' ');
    return user.charAt(0).toUpperCase() + user.slice(1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '50px 20vw',
      }}
    >
      {prevLoggedIn ? (
        <h1 style={{ fontWeight: 500, margin: '30px 10px 50px 10px' }}>{getUser()} sine datasett:</h1>
      ) : null}

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

      {datasets.length === 0 ? <h3 style={{ fontWeight: 'normal' }}>Ingen datasett</h3> : null}
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

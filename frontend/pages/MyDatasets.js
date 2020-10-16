
import { useEffect, useState } from 'react';
import { parseCookies } from './api/serverSideProps';
import { useRouter } from 'next/router'
import GetApi from '../Components/ApiCalls/GetApi'
import DatasetCard from '../Components/DatasetCard'
import { Paper, Grid } from '@material-ui/core';
import CoordinationCard from '../Components/CoordinationCard';
import InterestCard from '../Components/InterestCard';

// NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet

export default function MyDatasets({ prevLoggedIn, prevLoggedUsername, prevPublisherId = 0, prevUserId }) {
    const router = useRouter();
    const [datasets, setDatasets] = useState([])

    const [coordinations, setCoordinations] = useState([])
    
    let reqCounter;
    
    const setMyDatasets = (datasets) => {
            setDatasets(datasets.items)
    }

    /*const ifPublished = (pub) => {
        if (pub === "Published"){
            reqCounter = "Ingen requests på et tilgjengelig datasett, duh";
        }
        else {
            reqCounter = Object.values(datasets).map(data => { return (<InterestCard key = {data.id} interestCounter = {data.interestCounter}/>)});
        }
      }*/

    const setMyCoordinations = (coordinations) => {
        let newArr = []
        for (let i = 0; i < coordinations.items.length; i++) {
            if (coordinations.items[i].publisher.id == prevPublisherId) {
                newArr.push(coordinations.items[i])
            }
        }
        setCoordinations(newArr)
    }

    // NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet
    useEffect(() => {
        GetApi('https://localhost:5001/api/datasets?PublisherIds=101', setMyDatasets)
        GetApi('https://localhost:5001/api/coordinations', setMyCoordinations)
    }, [prevPublisherId])

    const onClick = (path, id) => { router.push(path + id) }

    return (
        <Grid>
        <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center">
            <br />
            {prevLoggedIn ? <h2 style={{ fontWeight: "normal" }}>{JSON.parse(prevLoggedUsername)} sine dataset</h2> : null}
            <br />
            <div style={{ minWidth: "80vh" }}>
                {
                    Object.values(datasets).map(d => (
                        d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
                    ))
                }
                <Grid
                container
                alignItems="stretch"
                direction="row">
                    
                </Grid>
            </div>

            <div style={{ minWidth: "80vh" }}>
                {
                    Object.values(coordinations).map(c => (
                        c && <CoordinationCard key={c.id} id={c.id} coordination={c} onClick={() => onClick('/DetailedCoordination/', c.id)} />
                    ))
                }
            </div>

            {datasets.length === 0 ? <h3 style={{ fontWeight: "normal" }}>Ingen dataset</h3> : null}
        </Grid>
        </Grid>
    )

}

MyDatasets.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req);

    return {
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
    }
}



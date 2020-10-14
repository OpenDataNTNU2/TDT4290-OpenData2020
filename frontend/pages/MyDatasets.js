
import { useEffect, useState } from 'react';
import { parseCookies } from './api/serverSideProps';
import { useRouter } from 'next/router'
import GetApi from '../Components/ApiCalls/GetApi'
import DatasetCard from '../Components/DatasetCard'
import Grid from '@material-ui/core/Grid'
import CoordinationCard from '../Components/CoordinationCard';



// NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet

export default function MyDatasets({prevLoggedIn, prevLoggedUsername, prevPublisherId = 0, prevUserId}){
    const router = useRouter();
    const [datasets, setDatasets] = useState([])

    const [coordinations, setCoordinations] = useState([])


    const setMyDatasets = (datasets) => {
        setDatasets(datasets.items)
    }

    // NB!!! The coordinations here are ALL coordinations, backend does not support fetching only one publishers coordinations yet
    useEffect(() => {
        GetApi('https://localhost:5001/api/datasets?PublisherIds=101', setMyDatasets)
        GetApi('https://localhost:5001/api/coordinations', setCoordinations)
    }, [prevPublisherId])

    const onClick = (id) => { router.push('/DetailedDataset/' + id) }
    
    return(
        <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
        >
            <br/>
            {prevLoggedIn ? <h2 style={{ fontWeight: "normal" }}>{JSON.parse(prevLoggedUsername)} sine dataset</h2> : null}
            <br/>
            <div style={{minWidth: "80vh"}}>
                {
                    Object.values(datasets).map(d => (
                    d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick(d.id)} />
                    ))
                }   
            </div>

            <div >
                {
                    Object.values(coordinations).map(c => (
                        c && <CoordinationCard id={c.id} title={c.title} description={c.description} />
                    ))
                }
            </div>
            
            {datasets.length === 0 ? <h3 style={{ fontWeight: "normal" }}>Ingen dataset</h3> : null}
        </Grid>
    )
    
}

MyDatasets.getInitialProps = ({req}) => {
    const cookies = parseCookies(req);

    return{
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
    }
}



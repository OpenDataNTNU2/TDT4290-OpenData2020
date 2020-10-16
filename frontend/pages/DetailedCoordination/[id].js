import { Paper, Grid, Snackbar, Divider, Chip, Select, FormControl, InputLabel, MenuItem, Button } from '@material-ui/core';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import Alert from '@material-ui/lab/Alert';

import { PageRender } from '../api/serverSideProps'
import PutApi from '../../Components/ApiCalls/PutApi'

import DatasetCard from '../../Components/DatasetCard'
import Input from '../../Components/Forms/Input';
import GetApi from '../../Components/ApiCalls/GetApi';

export default function DetailedCoordination({ data, uri, prevPublisherId }) {

    // variable for which dataset other municipalities will join with
    const [selectedDataset, setSelectedDataset] = useState("")
    const [joinCoordinationReason, setJoinCoordinationReason] = useState("")

    const [datasets, setDatasets] = useState([])

    const [applicationsToJoin, setApplicationsToJoin] = useState([])

    useEffect(() => {
        if (parseInt(JSON.parse(prevPublisherId)) > 99 && parseInt(prevPublisherId) !== data.publisher.id) {
            GetApi('https://localhost:5001/api/datasets?PublisherIds=' + JSON.parse(prevPublisherId), setDatasets)
        }

    }, [data])





    const onClick = (path, id) => { router.push(path + id) }

    return (
        <Grid
            container
            direction="column"
            style={{ minHeight: '70vh', minWidth: '90vh', padding: '5% 10% 5% 10%' }}
        >
            {/* Tags og overskrift */}
            <Grid style={{ padding: "3% 0 3% 0" }}>
                {data.underCoordination ?
                    <Chip label="Pågående samordning" size="medium" color="primary" style={{ width: "10vh" }} />
                    : <Chip label="Samordnet" size="medium" color="primary" style={{ width: "10vh" }} />
                }
                <h1 style={{ fontWeight: "normal" }}>{data.title}</h1>
            </Grid>


            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />

            {/* Informasjon om samordningen */}
            <Grid style={{ padding: "3% 0 3% 0" }}>
                <p><b>Beskrivelse: </b>{data.description}</p>
                <p><b>Utgiver av samordning: </b>{data.publisher.name}</p>
                <p><b>Deltakere i samordningen: </b>{data.datasets.map((dataset) => (dataset.publisher.name))}</p>
                <br /><p>Legg til mer info i samordningen og display det her...</p>

            </Grid>

            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />

            {/* Datasettene som er med i samordningen */}
            <Grid style={{ padding: "3% 0 3% 0" }}>
                <h1 style={{ fontWeight: "normal" }}>Samordnede data</h1>
                <p>Følgende datasett er med i samordningen</p>

                {data.datasets && Object.values(data.datasets).map(d => (
                    d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
                ))}

            </Grid>

            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />

            {/* Send forespørsel om å bli med i samordningen */}
            {JSON.parse(prevPublisherId) === null || parseInt(JSON.parse(prevPublisherId)) === -1 || parseInt(prevPublisherId) === data.publisher.id ?
                null
                : <Grid style={{ padding: "3% 0 3% 0" }}>
                    <h1 style={{ fontWeight: "normal" }}>Bli med i denne samordningen</h1>
                    <p>Velg hvilket datasett dere vil ha med i denne samordningen og skriv en liten begrunnelse av hvorfor dere ønsker å være med.</p><br />
                    <Input
                        id="joinCoordinationId"
                        multiline={true}
                        label="Begrunnelse for forespørsel"
                        value={joinCoordinationReason}
                        handleChange={setJoinCoordinationReason}
                    />
                    <br /><br />
                    {datasets.length !== 0 ?
                        <FormControl variant="outlined" style={{ width: "50vh" }}>
                            <InputLabel id="requestToJoinCoordinationLabel">Velg dataset</InputLabel>
                            <Select
                                labelId="requestToJoinCoordinationLabelID"
                                label="Velg dataset"
                                id="requestToJoinCoordinationID"
                                value={selectedDataset}
                                onChange={(event) => setSelectedDataset(event.target.value)}
                            >

                                {Object.values(datasets.items).map((dataset) => (
                                    dataset && <MenuItem value={dataset} key={dataset.id}>{dataset.title}</MenuItem>
                                ))}


                            </Select>
                        </FormControl>
                        : null}
                    <br /><br />
                    <Button variant="contained" color="primary" onClick={() => console.log(selectedDataset)}>Send Forespørsel</Button>



                </Grid>
            }

            {/* Forespørsler om å bli med i samordningen */}
            {parseInt(prevPublisherId) === data.publisher.id ?
                <Grid style={{ padding: "3% 0 3% 0" }}>
                    <h1 style={{ fontWeight: "normal" }}>Forespørsler om å bli med i samordningen</h1>
                    {datasets.length !== 0 ?
                        Object.values(applicationsToJoin).map((application) => (
                            applicationsToJoin && <div>
                                <p>Utgiver</p>
                                <p>Beskrivelse</p>
                                <p>datasetkort</p>
                                <Button variant="contained" color="secondary">Avslå forespørsel</Button>
                                <Button variant="contained" color="primary">Godta forespørsel</Button>
                            </div>
                        ))
                        : <p>Ingen forespørsler</p>}
                </Grid>
                : null}
        </Grid >
    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("CoordinationID", context)
    return propsData
}
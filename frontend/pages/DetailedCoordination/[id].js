import { Paper, Grid, Snackbar, Divider, Chip, Select, FormControl, InputLabel, MenuItem, Button } from '@material-ui/core';
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import Alert from '@material-ui/lab/Alert';

import { PageRender } from '../api/serverSideProps'
import PutApi from '../../Components/ApiCalls/PutApi'

import DatasetCard from '../../Components/DatasetCard'
import Input from '../../Components/Forms/Input';

export default function DetailedCoordination({ data, uri, prevPublisherId }) {

    // variable for which dataset other municipalities will join with
    const [selectedDataset, setSelectedDataset] = useState("")
    const [joinCoordinationReason, setJoinCoordinationReason] = useState("")

    const onClick = (path, id) => { router.push(path + id) }

    return (
        <Grid
            container
            direction="column"
            style={{ minHeight: '70vh', minWidth: '90vh', padding: '5% 10% 5% 10%' }}
        >
            <Grid style={{ padding: "3% 0 3% 0" }}>
                {data.underCoordination ?
                    <Chip label="Pågående samordning" size="medium" color="primary" style={{ width: "10vh" }} />
                    : <Chip label="Samordnet" size="medium" color="primary" style={{ width: "10vh" }} />
                }
                <h1 style={{ fontWeight: "normal" }}>{data.title}</h1>
            </Grid>


            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />

            <Grid style={{ padding: "3% 0 3% 0" }}>
                <p><b>Beskrivelse: </b>{data.description}</p>
                <p><b>Utgiver av samordning: </b>{data.publisher.name}</p>
                <p><b>Deltakere i samordningen: </b>{data.datasets.map((dataset) => (dataset.publisher.name))}</p>
                <br /><p>Legg til mer info i samordningen og display det her...</p>

            </Grid>

            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />

            <Grid style={{ padding: "3% 0 3% 0" }}>
                <h1 style={{ fontWeight: "normal" }}>Samordnede data</h1>
                <p>Følgende datasett er med i samordningen</p>

                {data.datasets && Object.values(data.datasets).map(d => (
                    d && <DatasetCard key={d.id} dataset={d} onClick={() => onClick('/DetailedDataset/', d.id)} />
                ))}

            </Grid>

            <Divider variant="fullWidth" style={{ border: "1px solid grey" }} /><br />
            {parseInt(prevPublisherId) === data.publisher.id ?
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
                    <FormControl variant="outlined" style={{ width: "50vh" }}>
                        <InputLabel id="demo-simple-select-label">Velg dataset</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Velg dataset"
                            id="demo-simple-select"
                            value={selectedDataset}
                            onChange={(event) => setSelectedDataset(event.target.value)}

                        >
                            {/*Object.values(datasets.items).map((dataset) => (
                                <MenuItem value={dataset}>{dataset.title}</MenuItem>
                            ))*/}
                            <MenuItem value="1">Placeholder dataset 1</MenuItem>
                            <MenuItem value="1">Placeholder dataset 1</MenuItem>
                        </Select>
                    </FormControl>
                    <br /><br />
                    <Button variant="contained" color="primary">Send Forespørsel</Button>



                </Grid>

            }

        </Grid>
    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("CoordinationID", context)
    return propsData
}
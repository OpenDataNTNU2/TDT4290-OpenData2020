import React from 'react';
import { Grid, Paper, Box } from '@material-ui/core/';

export default function DatasetCard({ dataset }) {
    const cutString = (string) => {
        if (string.length > 200) {
            return string.substr(0, 200) + "\u2026"
        }
        return string
    }

    const setPublishedColor = (publisert) => {
        if (publisert === "Published") {
            return '#D6FFD2'
        }
        return '#FFBFC3'
    }

    const setSamordnaColor = (samordna) => {
        if (samordna === "Samordna") {
            return '#EBE4FF'
        }
        return '#E8E6EF'
    }

    return (
        <div>
            <Grid item key={dataset.id}>
                <Paper variant='outlined'
                    style={{padding: '1%', marginBottom: '2%'}}>
                    <Grid container alignItems='flex-end' wrap='wrap'>
                        <Grid item xs={9}>
                            <h3>{dataset.title}</h3>
                            <p>{cutString(dataset.description)}</p>
                        </Grid>
                        <Grid item xs={2} style={{ margin: '1em' }}>
                            <Paper elevation={0}
                                style={{
                                        backgroundColor: setPublishedColor(dataset.publicationStatus),
                                        textAlign: 'center',
                                        padding: '3%',
                                        marginBottom: '3%'
                                    }}>
                                {dataset.publicationStatus}
                            </Paper>
                            <Paper elevation={0}
                                style={
                                    {//setSamordnaColor skal ikke hardkodes, venter på backend-verdi
                                    backgroundColor: setSamordnaColor("Samordna"),
                                    textAlign: 'center',
                                    padding: '3%'
                                    }}>
                                Samordna
                            </Paper>
                        </Grid>

                        {Object.values(dataset.distributions).map(dist => (
                            <Grid container key={dist.id}>
                                <Box border={1} borderRadius="borderRadius" borderColor="grey.500" padding='0.5%'>
                                    {(dist.fileFormat).toUpperCase()}
                                </Box>
                            </Grid>))} 
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}

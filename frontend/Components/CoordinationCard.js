import { Grid, Paper, Box } from '@material-ui/core/';

export default function CoordinationCard(props) {

    const cutString = (string) => {
        if (string != null && string.length > 200) {
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

    const setSamordnaColor = (underCoordination) => {
        if (!underCoordination) {
            return '#aba4eb'
        }
        return '#cccccc'
    }


    return (
        <div key={props.id * 2} onClick={props.onClick} >
            <Paper variant='outlined' style={{ backgroundColor: "#dedcf7", padding: '1%', marginBottom: '2%', cursor: "pointer" }}>
                <Grid container wrap='wrap'>
                    <Grid item xs={9}>
                        <h3>{props.coordination.title}</h3>
                        <p><b>Utgiver: </b>{props.coordination.publisher.name}</p>
                        <p>{cutString(props.coordination.description)}</p>
                    </Grid>
                    <Grid item xs={2} style={{ margin: '1em' }}>

                        <Paper elevation={0}
                            style={
                                {//setSamordnaColor skal ikke hardkodes, venter på backend-verdi
                                    backgroundColor: setSamordnaColor(props.coordination.underCoordination),
                                    textAlign: 'center',
                                    padding: '3%'
                                }}>
                            {props.coordination.underCoordination ? "Under samordning" : "Samordnet"}
                        </Paper>
                    </Grid>
                    <Grid container direction="row">
                        <p><strong>Deltagende kommuner:</strong>{props.coordination.datasets.length !== 0 ?
                            props.coordination.datasets.map((dataset) => (dataset.publisher.name + ", "))
                            : <i> Ingen deltagende kommuner</i>}</p>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}
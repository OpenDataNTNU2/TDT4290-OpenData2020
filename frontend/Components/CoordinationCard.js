import { Grid, Paper, Box } from '@material-ui/core/';

export default function CoordinationCard(props){

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

    const setSamordnaColor = (samordna) => {
        if (samordna === "Samordna") {
            return '#aba4eb'
        }
        return '#E8E6EF'
    }


    return(
        <div key={props.id*2} >
            <Paper variant='outlined' style={{ maxWidth: "80vh", backgroundColor: "#dedcf7", padding: '1%', marginBottom: '2%', cursor: "pointer" }}>
                <Grid container wrap='wrap'>
                    <Grid item xs={9}>
                        <h3>{props.title}</h3>
                        <p>{cutString(props.description)}</p>
                    </Grid>
                    <Grid item xs={2} style={{ margin: '1em' }}>
                        <Paper elevation={0}
                            style={{
                                backgroundColor: setPublishedColor("Published"),
                                textAlign: 'center',
                                padding: '3%',
                                marginBottom: '3%'
                            }}>
                            Placeholder
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
                    <Grid container direction="row">
                        <p><strong>Kommuner:</strong> Trondheim, Oslo og Placeholder og mer</p>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}
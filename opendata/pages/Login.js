import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const Login = () => (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '70vh', minWidth: '90vh'}}
    >
                <h2 style={{fontWeight: "normal"}}>Logg inn</h2>
                <form noValidate autoComplete="off" style={{width: "50vh"}}>
                    <TextField id="outlined-basic" label="Brukernavn" size="large" variant="outlined" fullWidth="true"/>
                </form><br/>
                <Button variant="contained" color="primary">Logg inn</Button><br/>
                <p>For å logge inn med kommune, velg et brukernavn på formen [Ditt navn]_kommune </p>
    </Grid> 
)

export default Login;
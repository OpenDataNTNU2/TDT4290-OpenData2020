import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar';

import { useState } from "react";


export default function Login(){

    // setter initial states, er garra en bedre måte å gjøre dette på, fremdeles et tidlig utkast
    // sjekker etter bedre løsninger på local states og/eller global states med next atm (Håkon)
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [loggedUsername, setLoggedUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false)
    const [notEligUsername, setNotEligUsername] = useState(false)
    const [userId, setUserId] = useState(-1)


    // Når brukere trykker login, endres statesene, dette skjer kun i login atm, så hvis man refresher/bytter page, blir man logget ut. 
    const handleLoginClick = async () => {
        if(!loggedIn){
            if(checkUsernameElig(username)){
                var success = await sendLoginRequest()
                if (success){
                    setLoggedUsername(username);
                    setLoggedIn(true);
                    setOpen(true);
                    setNotEligUsername(false);
                }
            }
            else setNotEligUsername(true); 
        }
    }

    const sendLoginRequest = async () => {
        const data = {
            "username": username,
        }
        try{
            await fetch('https://localhost:5001/api/users/'+username, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {console.log(data);setUserId(data.id)})
            return true
        }
        catch(_){
            alert("failed")
            console.log("failed")
            return false
        }
    }

    // resetter alle statsene når bruker trykker på logg ut
    const handleLogoutClick = () => {
        setLoggedUsername("");
        setUsername("");
        setOpen(false);
        setLoggedIn(false);
    }

    // sjekker elig av brukernavn, må nok adde at den sjekker etter kommune bruker o.l, men vi kan vente litt med det.
    const checkUsernameElig = (username) => {
        if(username.length === 0){
            return false
        }
        return true
    }

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '70vh', minWidth: '90vh'}}
        >
            
            {loggedIn ? 
                <h2 style={{fontWeight: "normal"}}>Logget inn som {loggedUsername}</h2> 
            :   <h2 style={{fontWeight: "normal"}}>Logg inn</h2>
            }
                
            {loggedIn ? 
                null 
            :   <form noValidate autoComplete="off" style={{width: "50vh"}}>
                    <TextField 
                        id="outlined-basic" 
                        label="Brukernavn" 
                        size="large" 
                        variant="outlined" 
                        fullWidth="true" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </form>
            }
            <br/>
            {loggedIn ? 
                <Button variant="contained" color="secondary" onClick={handleLogoutClick}>Logg ut</Button>
            :   <Button variant="contained" color="primary" onClick={handleLoginClick}>Logg inn</Button>
            }
            <br/>
                
            {loggedIn ? 
                null 
            :   <Alert elevation={1} severity="info">For å logge inn med kommune, velg et brukernavn på formen [Ditt navn]_[Din kommune]_kommune</Alert>
            }
            <br/>
            <Alert elevation={1} severity="info">UserId: {userId}</Alert>

            <Snackbar open={notEligUsername} autoHideDuration={6000}>
                <Alert elevation={1} severity="error">Ikke gyldig brukernavn (sjekker bare om det er noe skrevet eller ikke atm){loggedUsername}</Alert>
            </Snackbar>

            <Snackbar open={open} autoHideDuration={6000}>
                <Alert elevation={1} severity="success">Innlogging vellykket, velkommen {loggedUsername}</Alert>
            </Snackbar>
                  
            
        </Grid> 
    )
}


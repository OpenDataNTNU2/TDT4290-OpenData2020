import { Grid, TextField, Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Router from 'next/router';
import Cookie from 'js-cookie';
import { useState, useEffect } from 'react';
import { parseCookies } from './api/serverSideProps';

export default function Login({
    prevLoggedIn = false,
    prevLoggedUsername = false,
    prevPublisherId = '-1',
    prevUserId = '-1',
}) {
    // setter initial states, er garra en bedre måte å gjøre dette på, fremdeles et tidlig utkast
    // sjekker etter bedre løsninger på local states og/eller global states med next atm (Håkon)

    const [loggedIn, setLoggedIn] = useState(() => JSON.parse(prevLoggedIn));
    const [loggedUsername, setLoggedUsername] = useState(() => JSON.parse(prevLoggedUsername));
    const [publisherId, setPublisherId] = useState(() => JSON.parse(prevPublisherId));
    const [userId, setUserId] = useState(() => JSON.parse(prevUserId));

    const [username, setUsername] = useState('');

    const [open, setOpen] = useState(false);

    const [notEligUsername, setNotEligUsername] = useState(false);

    // updates cookies
    useEffect(() => {
        Cookie.set('prevLoggedIn', JSON.stringify(loggedIn));
        Cookie.set('prevLoggedUsername', JSON.stringify(loggedUsername));
        Cookie.set('prevPublisherId', JSON.stringify(publisherId));
        Cookie.set('prevUserId', JSON.stringify(userId));
    }, [loggedIn, loggedUsername, publisherId, userId]);

    // refresh website when loggedIn changes, aka user logs in or out
    useEffect(() => {
        Router.push('/Login');
    }, [loggedIn]);

    // sjekker elig av brukernavn, må nok adde at den sjekker etter kommune bruker o.l, men vi kan vente litt med det.
    const checkUsernameElig = (u) => {
        if (u.length === 0) {
            return false;
        }
        return true;
    };

    const sendLoginRequest = async () => {
        const data = {
            username,
        };
        try {
            await fetch(`https://localhost:5001/api/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((resData) => {
                    console.log(resData);
                    setUserId(resData.id);
                    setPublisherId(resData.publisherId);
                });
            return true;
        } catch (_) {
            alert('failed');
            console.log('failed');
            return false;
        }
    };

    // Når brukere trykker login, endres statesene, dette skjer kun i login atm, så hvis man refresher/bytter page, blir man logget ut.
    const handleLoginClick = async () => {
        if (!loggedIn) {
            if (checkUsernameElig(username)) {
                const success = await sendLoginRequest();
                if (success) {
                    setLoggedUsername(username);
                    setLoggedIn(true);
                    setOpen(true);
                    setNotEligUsername(false);
                }
            } else setNotEligUsername(true);
        }
    };

    // resetter alle statsene når bruker trykker på logg ut
    const handleLogoutClick = () => {
        setLoggedUsername('');
        setUserId('-1');
        setPublisherId('-1');
        setLoggedIn(false);
        setUsername('');
        setOpen(false);
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '70vh', minWidth: '90vh' }}
        >
            {loggedIn ? (
                <h2 style={{ fontWeight: 'normal' }}>
                    Logget inn som
                    {loggedUsername}
                </h2>
            ) : (
                <h2 style={{ fontWeight: 'normal' }}>Logg inn</h2>
            )}
            {loggedIn ? null : (
                <form noValidate autoComplete="off" style={{ width: '50vh' }}>
                    <TextField
                        id="username"
                        label="Brukernavn"
                        size="medium"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </form>
            )}
            <br />
            {loggedIn ? (
                <Button variant="contained" color="secondary" onClick={handleLogoutClick}>
                    Logg ut
                </Button>
            ) : (
                <Button variant="contained" color="primary" onClick={handleLoginClick}>
                    Logg inn
                </Button>
            )}
            <br />

            {loggedIn ? null : (
                <Alert elevation={1} severity="info">
                    For å logge inn med kommune, velg et brukernavn på formen [Ditt navn]_[Din kommune]_kommune
                </Alert>
            )}
            <br />
            <Alert elevation={1} severity="info">
                UserId:
                {userId}
            </Alert>

            <Snackbar open={notEligUsername} autoHideDuration={6000}>
                <Alert elevation={1} severity="error">
                    Ikke gyldig brukernavn (sjekker bare om det er noe skrevet eller ikke atm)
                    {loggedUsername}
                </Alert>
            </Snackbar>

            <Snackbar open={open} autoHideDuration={6000}>
                <Alert elevation={1} severity="success">
                    Innlogging vellykket, velkommen
                    {loggedUsername}
                </Alert>
            </Snackbar>
        </Grid>
    );
}

Login.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req);

    return {
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId,
    };
};

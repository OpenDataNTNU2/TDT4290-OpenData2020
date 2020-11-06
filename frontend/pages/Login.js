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
  prevUserHaveRequested = false,
}) {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  // sets initial states from cookies
  const [loggedIn, setLoggedIn] = useState(() => JSON.parse(prevLoggedIn));
  const [loggedUsername, setLoggedUsername] = useState(() => JSON.parse(prevLoggedUsername));
  const [publisherId, setPublisherId] = useState(() => JSON.parse(prevPublisherId));
  const [userId, setUserId] = useState(() => JSON.parse(prevUserId));
  const [userHaveRequested, setUserHaveRequested] = useState(prevUserHaveRequested);

  const [username, setUsername] = useState('');

  const [open, setOpen] = useState(false);

  const [notEligUsername, setNotEligUsername] = useState(false);

  // updates cookies
  useEffect(() => {
    Cookie.set('prevLoggedIn', JSON.stringify(loggedIn));
    Cookie.set('prevLoggedUsername', JSON.stringify(loggedUsername));
    Cookie.set('prevPublisherId', JSON.stringify(publisherId));
    Cookie.set('prevUserId', JSON.stringify(userId));
  }, [loggedIn, loggedUsername, publisherId, userId, userHaveRequested]);

  // refresh website when loggedIn changes, aka user logs in or out
  useEffect(() => {
    Router.push('/Login').then(() => window.scrollTo(0, 0));
  }, [loggedIn]);

  // checks if the username is valid
  const checkUsernameElig = (u) => {
    if (u.length === 0) {
      return false;
    }
    return true;
  };

  // sends a put request with username. if the username is new, it will just create a new user
  const sendLoginRequest = async () => {
    const data = {
      username,
    };
    try {
      await fetch(`${host}/api/users/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(
          (response) => response.json(),
          (reject) => console.log('Error: ', reject)
        )
        .then((resData) => {
          console.log('resData', resData);
          setUserId(resData.id);
          setPublisherId(resData.publisherId);
        })
        .catch(function (error) {
          console.log('hallo', error);
        });
      return true;
    } catch (_) {
      alert('failed');
      console.log('failed');
      return false;
    }
  };

  // Update states when user logs in.
  const handleLoginClick = async () => {
    if (!loggedIn) {
      if (checkUsernameElig(username)) {
        const success = await sendLoginRequest();
        if (success) {
          setLoggedUsername(username);
          setLoggedIn(true);
          setOpen(true);
          setNotEligUsername(false);
          setUserHaveRequested(false);
          Cookie.set('userHaveRequested', false);
        }
      } else setNotEligUsername(true);
    }
  };

  // resets states when user logs out.
  const handleLogoutClick = () => {
    setLoggedUsername(false);
    setUserId('-1');
    setPublisherId('-1');
    setLoggedIn(false);
    setUsername('');
    setOpen(false);
    Cookie.set('userHaveRequested', false);
  };

  function enterClick(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleLoginClick();
    }
  }

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
        <h2 style={{ fontWeight: 'normal' }}>Logget inn som {loggedUsername}</h2>
      ) : (
          <h2 style={{ fontWeight: 'normal' }}>Logg inn</h2>
        )}
      {loggedIn ? null : (
        <form noValidate autoComplete="off" style={{ width: '50vw' }}>
          <TextField
            id="username"
            label="Brukernavn"
            size="medium"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => enterClick(e)}
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
    prevUserHaveRequested: cookies.userHaveRequested,
  };
};

import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { useRouter } from 'next/router'
import { useState } from "react";

import Cookie from "js-cookie";
import { parseCookies } from '../utils/parseCookies'

export default function Header({prevLoggedIn, prevLoggedUsername, prevPublisherId, prevUserId}) {
    const router = useRouter();
    const [value, setValue] = useState("/");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        router.push(newValue);
        console.log(prevLoggedIn)
    };

    return (
        <div >
            <Grid
                container
                alignItems="center"
                style={{  backgroundColor:'#90C7EF' }}
            >
                <Grid item xs={10} >
                    <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered >
                        <Tab label={<h3 style={{ fontWeight: "normal" }}>Home</h3>} value="/" />
                        <Tab label={<h3 style={{ fontWeight: "normal" }}>Datakatalog</h3>} value="/" />
                        
                        {JSON.parse(prevPublisherId) <= 99 ? null : <Tab label={<h3 style={{ fontWeight: "normal" }}>Mine datasett</h3>} value="/MyDatasets" />}
                        {JSON.parse(prevPublisherId) <= 99 ? null : <Tab label={<h3 style={{ fontWeight: "normal" }}>Legg til nytt datasett</h3>} value="/AddNewDataset" />}
                        
                    </Tabs>
                    <p>id: {prevPublisherId}</p>
                </Grid>
                <Grid item xs>
                    {prevLoggedIn ? 
                        <Button variant="outlined" color="primary" onClick={() => router.push("/Login")}>Logg ut</Button>
                        : <Button variant="outlined" color="primary" onClick={() => router.push("/Login")}>Logg inn</Button>
                    }
                   
                </Grid>
                
            </Grid>
        </div>
    )
}

Header.getInitialProps = ({req}) => {
    const cookies = parseCookies(req);

    return{
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
    }
}
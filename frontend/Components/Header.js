import { Tabs, Tab, Button, Grid, Chip } from '@material-ui/core'

import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

import { useRouter } from 'next/router'
import { useState } from "react";
import { parseCookies } from '../pages/api/serverSideProps';

import styles from "../styles/header.module.css";

export default function Header({ prevLoggedIn = false, prevLoggedUsername = "", prevPublisherId = "-1" }) {
    const router = useRouter();
    const [value, setValue] = useState("/");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        router.push(newValue);

    };

    return (
        <div className={styles.header} >
            <div className={styles.tabContainer} >
                <Tabs value={value} onChange={handleChange} centered >
                    <Tab disableFocusRipple disableRipple label="Datakatalog" value="/" />

                    {JSON.parse(prevPublisherId) <= 99 ? null : <Tab disableFocusRipple disableRipple label="Mine datasett" value="/MyDatasets" />}
                    {JSON.parse(prevPublisherId) <= 99 ? null : <Tab disableFocusRipple disableRipple label="Legg til nytt datasett" value="/AddNewDataset" />}

                </Tabs>
            </div>
            <div className={styles.loginContainer} >
                {prevLoggedUsername && JSON.parse(prevLoggedUsername) !== "" && <Chip
                    icon={<FaceIcon />}
                    label={JSON.parse(prevLoggedUsername)}
                    color="primary"
                />}
                {/* {JSON.parse(prevLoggedIn) ? <p>Logget inn som: {JSON.parse(prevLoggedUsername)}</p> : null } */}
                <div className={styles.logInButton} onClick={() => router.push("/Login")} >
                    LOGG {JSON.parse(prevLoggedIn) ? "UT" : "INN"}
                </div>
            </div>
        </div>
    )
}

Header.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req);

    return {
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
    }
}
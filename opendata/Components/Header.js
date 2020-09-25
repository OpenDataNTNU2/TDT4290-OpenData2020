import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { useRouter } from 'next/router'
import { useState } from "react";

export default function Header() {
    const router = useRouter();
    const [value, setValue] = useState("/");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        router.push(newValue);
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
                        <Tab label={<h3 style={{ fontWeight: "normal" }}>Mine datasett</h3>} value="/MyDatasets" />
                        <Tab label={<h3 style={{ fontWeight: "normal" }}>Legg til nytt datasett</h3>} value="/AddNewDataset" />
                    </Tabs>
                </Grid>
                <Grid item xs>
                    <Button variant="outlined" color="primary" onClick={() => router.push("/Login")}>Logg inn</Button>
                </Grid>
            </Grid>
        </div>
    )
}
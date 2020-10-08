import { Grid, AppBar, Tab } from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab'

import { parseCookies } from '../utils/parseCookies'
import { useState } from "react";

// imports for what is displayed in the TabPanels
import CreateDataset from '../Components/AddNewDataset/CreateDataset'
import ImportDataset from '../Components/AddNewDataset/ImportDataset'

export default function AddNewDataset({ prevLoggedIn, prevLoggedUsername, prevPublisherId, prevUserId  }){
    
    const [page, setPage] = useState("1")

    const handleChange = (event, newValue) => {
        setPage(newValue);
    }

    return(
        <Grid>
            {JSON.parse(prevPublisherId) <= 99 ? <div><p>No access, please log into a municipality user</p></div> : 
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    alignItems="center"
                    style={{ minHeight: '70vh', minWidth: '60vh', marginTop: "5vh"}}
                >
                    <div>
                        <TabContext value={page}  >
                            <AppBar position="static" style={{  backgroundColor:'#90C7EF' }} >
                                <TabList 
                                    onChange={handleChange} 
                                    centered 
                                    indicatorColor="primary" 
                                    textColor="primary"
                                >
                                    <Tab value="1" label="Legg til dataset"  />
                                    <Tab value="2" label="Importer dataset" />
                                </TabList>
                            </AppBar>

                            <TabPanel value="1">
                                <CreateDataset 
                                    prevPublisherId={JSON.parse(prevPublisherId)} 
                                    prevLoggedIn={prevLoggedIn} 
                                />
                            </TabPanel>

                            <TabPanel value="2">
                                <ImportDataset />
                            </TabPanel>

                        </TabContext>
                    </div>
                </Grid>
           }
           </Grid>
    )
}

AddNewDataset.getInitialProps = ({req}) => {
    const cookies = parseCookies(req);

    return{
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId
    }
}
 


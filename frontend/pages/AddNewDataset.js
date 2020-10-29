import { Grid, AppBar, Tab } from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';

import { useState } from 'react';
import { parseCookies } from './api/serverSideProps';

// imports for what is displayed in the TabPanels
import CreateDataset from '../Components/AddNewDataset/CreateDataset';
import ImportDataset from '../Components/AddNewDataset/ImportDataset';
import CreateCoordination from '../Components/AddNewDataset/CreateCoordination';

export default function AddNewDataset({ prevLoggedIn, prevPublisherId }) {
  const [page, setPage] = useState('1');

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  return (
    <Grid>
      {JSON.parse(prevPublisherId) <= 0 ? (
        <div>
          <p>No access, please log into a municipality user</p>
        </div>
      ) : (
        <Grid
          container
          spacing={1}
          direction="column"
          alignItems="center"
          style={{ minHeight: '70vh', minWidth: '60vh', marginTop: '5vh' }}
        >
          <div>
            <TabContext value={page}>
              <AppBar position="static" style={{ backgroundColor: '#90C7EF' }}>
                <TabList onChange={handleChange} centered indicatorColor="primary" textColor="primary">
                  <Tab value="1" label={<h3 style={{ fontWeight: 'normal' }}>Legg til dataset</h3>} />
                  <Tab value="2" label={<h3 style={{ fontWeight: 'normal' }}>Importer dataset</h3>} />
                  <Tab value="3" label={<h3 style={{ fontWeight: 'normal' }}>Opprett samordning</h3>} />
                </TabList>
              </AppBar>

              <TabPanel value="1">
                <CreateDataset prevPublisherId={JSON.parse(prevPublisherId)} prevLoggedIn={prevLoggedIn} />
              </TabPanel>

              <TabPanel value="2">
                <ImportDataset />
              </TabPanel>

              <TabPanel value="3">
                <CreateCoordination publisherId={prevPublisherId} />
              </TabPanel>
            </TabContext>
          </div>
        </Grid>
      )}
    </Grid>
  );
}

AddNewDataset.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    prevLoggedIn: cookies.prevLoggedIn,
    prevLoggedUsername: cookies.prevLoggedUsername,
    prevPublisherId: cookies.prevPublisherId,
    prevUserId: cookies.prevUserId,
  };
};

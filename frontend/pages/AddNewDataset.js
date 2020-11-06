import { Tab } from '@material-ui/core';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';

import { useState } from 'react';
import { parseCookies } from './api/serverSideProps';

// imports for what is displayed in the TabPanels
import CreateDataset from '../Components/AddNewDataset/CreateDataset';
import ImportDataset from '../Components/AddNewDataset/ImportDataset';
import CreateCoordination from '../Components/AddNewDataset/CreateCoordination';

import styles from '../styles/AddNew.module.css';

export default function AddNewDataset({ prevLoggedIn, prevPublisherId }) {
  const [page, setPage] = useState('1');

  const handleChange = (event, newValue) => {
    setPage(newValue);
  };

  return (
    <div>
      {JSON.parse(prevPublisherId) <= 0 ? (
        <div>
          <p>No access, please log into a municipality user</p>
        </div>
      ) : (
        <div className={styles.container}>
          <TabContext value={page}>
            <div className={styles.tabsContainer}>
              <TabList onChange={handleChange} centered indicatorColor="primary">
                <Tab value="1" label="Legg til datasett" disableFocusRipple disableRipple />
                <Tab value="2" label="Legg til samordning" disableFocusRipple disableRipple />
                <Tab value="3" label="Importer datasett" disableFocusRipple disableRipple />
              </TabList>
            </div>

            <TabPanel value="1">
              <CreateDataset prevPublisherId={JSON.parse(prevPublisherId)} prevLoggedIn={prevLoggedIn} />
            </TabPanel>

            <TabPanel value="2">
              <CreateCoordination publisherId={prevPublisherId} />
            </TabPanel>

            <TabPanel value="3">
              <ImportDataset />
            </TabPanel>
          </TabContext>
        </div>
      )}
    </div>
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

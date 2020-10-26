import { Tabs, Tab, Chip } from '@material-ui/core';

import { Face, Notifications, NotificationsActive } from '@material-ui/icons';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { parseCookies } from '../pages/api/serverSideProps';

import styles from '../styles/Header.module.css';
import GetApi from './ApiCalls/GetApi';
import NotificationCard from './NotificationCard';

export default function Header({
  prevLoggedIn = false,
  prevLoggedUsername = '',
  prevPublisherId = '-1',
  prevUserId = '-1',
}) {
  const router = useRouter();
  const [value, setValue] = useState('/');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
  };

  const [toggleShowNotifications, setToggleShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (prevLoggedIn === 'false') setNotifications([]);
    if (JSON.parse(prevUserId) > 0)
      GetApi(`https://localhost:5001/api/users/${JSON.parse(prevLoggedUsername)}`, getUserNotifications);
  }, [prevUserId, prevLoggedUsername, prevLoggedIn]);

  function getUserNotifications(response) {
    if (response.notifications.length !== 0) {
      setNotifications(response.notifications);
    }
  }

  return (
    <div className={styles.header}>
      <div className={styles.tabContainer}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab disableFocusRipple disableRipple label="Datakatalog" value="/" />
          {JSON.parse(prevPublisherId) <= 99 ? null : (
            <Tab disableFocusRipple disableRipple label="Mine datasett" value="/MyDatasets" />
          )}
          {JSON.parse(prevPublisherId) <= 99 ? null : (
            <Tab disableFocusRipple disableRipple label="Legg til nytt datasett" value="/AddNewDataset" />
          )}
        </Tabs>
      </div>
      <div className={styles.loginContainer}>
        {prevLoggedUsername && JSON.parse(prevLoggedUsername) !== '' && (
          <Chip icon={<Face />} label={JSON.parse(prevLoggedUsername)} color="primary" />
        )}
        {/* Notifications */}
        {prevLoggedUsername && JSON.parse(prevLoggedUsername) !== '' && JSON.parse(prevLoggedIn) ? (
          notifications.length > 0 ? (
            <NotificationsActive
              className={styles.notificationBell}
              color={toggleShowNotifications ? 'action' : 'secondary'}
              fontSize="large"
              onClick={() => setToggleShowNotifications(!toggleShowNotifications)}
            />
          ) : (
            <Notifications
              className={styles.notificationBell}
              color={toggleShowNotifications ? 'action' : 'inherit'}
              fontSize="large"
              onClick={() => setToggleShowNotifications(!toggleShowNotifications)}
            />
          )
        ) : null}

        <div className={styles.logInButton} onClick={() => router.push('/Login')}>
          LOGG {JSON.parse(prevLoggedIn) ? 'UT' : 'INN'}
        </div>
      </div>
      {toggleShowNotifications ? <NotificationCard notifications={notifications} /> : null}
    </div>
  );
}

Header.getInitialProps = ({ req }) => {
  const cookies = parseCookies(req);

  return {
    prevLoggedIn: cookies.prevLoggedIn,
    prevLoggedUsername: cookies.prevLoggedUsername,
    prevPublisherId: cookies.prevPublisherId,
    prevUserId: cookies.prevUserId,
  };
};

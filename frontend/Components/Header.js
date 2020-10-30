import { Tabs, Tab, Chip, Popover } from '@material-ui/core';

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
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;
  const [value, setValue] = useState('/');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
  };

  const [notifications, setNotifications] = useState([]);

  // Handle open/close notifications
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openNotificationCard = Boolean(anchorEl);

  useEffect(() => {
    if (prevLoggedIn === 'false') setNotifications([]);
    if (JSON.parse(prevUserId) > 0) GetApi(`${host}/api/users/${JSON.parse(prevLoggedUsername)}`, getUserNotifications);
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
          {JSON.parse(prevPublisherId) <= 0 ? null : (
            <Tab disableFocusRipple disableRipple label="Mine datasett" value="/MyDatasets" />
          )}
          {JSON.parse(prevPublisherId) <= 0 ? null : (
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
              color={openNotificationCard ? 'action' : 'secondary'}
              fontSize="large"
              onClick={handleClick}
            />
          ) : (
            <Notifications
              className={styles.notificationBell}
              color={openNotificationCard ? 'action' : 'inherit'}
              fontSize="large"
              onClick={handleClick}
            />
          )
        ) : null}

        <div className={styles.logInButton} onClick={() => router.push('/Login')}>
          LOGG {JSON.parse(prevLoggedIn) ? 'UT' : 'INN'}
        </div>
      </div>
      <Popover
        open={openNotificationCard}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{ marginTop: '30px' }}
      >
        <NotificationCard notifications={notifications} />
      </Popover>
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

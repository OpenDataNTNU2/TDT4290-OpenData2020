import React from 'react';
import styles from '../styles/NotificationCard.module.css';
import { useRouter } from 'next/router';

export default function NotificationCard(props) {
  const router = useRouter();

  function getDate(dateString) {
    let notificationDate = new Date(dateString);
    let now = new Date(Date.now());
    if (now - notificationDate < 1000 * 60) {
      return 'Nå';
    } else if (now - notificationDate < 1000 * 60 * 60) {
      return new Date(now - notificationDate).getMinutes() + ' minutter siden';
    } else if (now - notificationDate < 1000 * 60 * 60 * 24) {
      return new Date(now - notificationDate).getHours() + ' timer siden';
    } else if (now - notificationDate < 1000 * 60 * 60 * 24 * 2) {
      return 'I går kl: ' + notificationDate.toLocaleTimeString();
    } else {
      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let result = notificationDate.toLocaleDateString('no', options);
      return result.substr(0, 1).toUpperCase() + result.substr(1);
    }
  }

  function openCatalougeItem(item) {
    if (parseInt(item.datasetId) !== 0) {
      router.push('/DetailedDataset/' + item.datasetId);
    } else if (parseInt(item.coordinationId) !== 0) {
      router.push('/DetailedCoordination/' + item.coordinationId);
    }
    return;
  }

  return (
    <div className={styles.cardContainer}>
      <h2>Varsler</h2>
      <hr />
      {props.notifications && props.notifications.length > 0 ? (
        props.notifications.map((notification) => (
          <div
            onClick={() => {
              openCatalougeItem(notification);
            }}
            className={styles.notification}
            key={notification.id}
          >
            <p>
              <b>{notification.title}</b>
            </p>
            <p>{notification.description}</p>
            <p>{getDate(notification.timeOfCreation)}</p>
          </div>
        ))
      ) : (
        <p>Ingen varsler</p>
      )}
    </div>
  );
}

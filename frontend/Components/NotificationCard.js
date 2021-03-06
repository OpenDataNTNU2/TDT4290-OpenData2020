import React from 'react';
import styles from '../styles/NotificationCard.module.css';
import { useRouter } from 'next/router';

export default function NotificationCard(props) {
  const router = useRouter();

  /**
   * calculates how long since the notification was created
   * Returns a easy to read string for when how long since creation 
   * @param {date} dateString - date for the creation of the notification
   */
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

  // routes to dataset or coordination depenting on what the notification is about.
  function openCatalougeItem(item) {
    if (parseInt(item.datasetId) !== 0) {
      router.push('/DetailedDataset/' + item.datasetId).then(() => window.scrollTo(0, 0));
    } else if (parseInt(item.coordinationId) !== 0) {
      router.push('/DetailedCoordination/' + item.coordinationId).then(() => window.scrollTo(0, 0));
    }
    return;
  }

  return (
    <div className={styles.cardContainer}>
      <h2>Varsler</h2>
      <hr />
      {props.notifications && props.notifications.length > 0 ? (
        props.notifications
          .sort((a, b) => (a.timeOfCreation > b.timeOfCreation ? -1 : 1))
          .map((notification) => (
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

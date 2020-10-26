import React from 'react';
import styles from '../styles/NotificationCard.module.css';

export default function NotificationCard(props) {
  // vet ikke helt hva som bør være med her, men tenker kanskje noe slikt? ish.. ? :)
  /*   const dummyNotifications = [
    {
      id: 1,
      title: 'Notification 1 - Oslo kommune',
      change: 'This is what changed in the dataset',
      timeOfChange: 'DD.MM.YYYY',
    },
    {
      id: 2,
      title: 'Notification 2',
      change: 'This is what changed in the dataset',
      timeOfChange: 'DD.MM.YYYY',
    },
    {
      id: 3,
      title: 'Notification 3',
      change: 'This is what changed in the coordination',
      timeOfChange: 'DD.MM.YYYY',
    },
    {
      id: 4,
      title: 'Notification 4',
      change: 'This is what changed in the coordination',
      timeOfChange: 'DD.MM.YYYY',
    },
  ]; */

  // tenker kanskje at vi kan bruke switch case på hva som er endret, og da vise det som er relevant.
  // eks at samordning har litt andre ting som bør vises kontra dataset hvis en endring er gjort.

  return (
    <div className={styles.cardContainer}>
      <h2>Varsler</h2>
      {props.notifications && props.notifications.length > 0 ? (
        props.notifications.map((notification) => (
          <div className={styles.notification} key={notification.id}>
            <p>
              <b>{notification.title}</b>
            </p>
            <p>{notification.description}</p>
            <p>Endret: {notification.timeOfCreation}</p>
          </div>
        ))
      ) : (
        <p>Ingen varsler</p>
      )}
    </div>
  );
}

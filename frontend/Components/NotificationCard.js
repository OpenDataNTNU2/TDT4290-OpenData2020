import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@material-ui/core/';
import styles from '../styles/NotificationCard.module.css';
import GetApi from './ApiCalls/GetApi';


export default function NotificationCard(props) {

    const [notifications, setNotifications] = useState([])

    /*
    // fetch notifications here
    useEffect(() => {
        GetApi("URL", setNotifications)
    }, [props])
    */

    // vet ikke helt hva som bør være med her, men tenker kanskje noe slikt? ish.. ? :)
    const dummyNotifications = [
        {
            id: 1,
            title: "Notification 1",
            change: "This is what changed in the dataset",
            timeOfChange: "DD.MM.YYYY"
        },
        {
            id: 2,
            title: "Notification 2",
            change: "This is what changed in the dataset",
            timeOfChange: "DD.MM.YYYY"
        },
        {
            id: 3,
            title: "Notification 3",
            change: "This is what changed in the coordination",
            timeOfChange: "DD.MM.YYYY"
        },
        {
            id: 4,
            title: "Notification 4",
            change: "This is what changed in the coordination",
            timeOfChange: "DD.MM.YYYY"
        }
    ]

    // tenker kanskje at vi kan bruke switch case på hva som er endret, og da vise det som er relevant.
    // eks at samordning har litt andre ting som bør vises kontra dataset hvis en endring er gjort.

    return (
        <div className={styles.cardContainer}>
            <h2>Varsler</h2>
            {dummyNotifications.map(notification => (
                <div className={styles.notification}>
                    <p><b>{notification.title}</b></p>
                    <p>{notification.change}</p>
                    <p>Endret: {notification.timeOfChange}</p>
                </div>
            ))}
        </div>
    )
}



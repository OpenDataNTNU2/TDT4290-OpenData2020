import React, { useState } from 'react';
import { Button, Divider } from '@material-ui/core';
import Input from '../../Components/Forms/Input'

const SubscribeComp = (props) => {
    const [subsciptionUrl, setSubscriptionUrl] = useState("")
    const [subscribeDescription, setSubscribeDescription] = useState("")

    return (
        props.subscribed ?
            <div style={{ margin: '25px 0' }}>
                <Divider variant="fullWidth" />
                <br />
                <h2 style={{ fontWeight: 'normal' }}>Du abonnerer på dette datasettet</h2>

            </div>

            : <div style={{ margin: '25px 0' }}>
                <Divider variant="fullWidth" />
                <br />
                <h1 style={{ fontWeight: 'normal' }}>Abonner på endringer</h1>
                <p>Abonner på endringer i datasettet, gjerne legg ved link og beskrivelse til hva du bruker datasettet til. Dette vil hjelpe oss å forstå nytteverdien til datasettet og kan være en inspirasjon til andre som også vil ta datasettet i bruk.</p>
                <br />
                <Input id="" multiline={false} label="Link til hva datasettet brukes til (valgfritt)" value={subsciptionUrl} handleChange={setSubscriptionUrl} />
                <br /><br />
                <Input id="" multiline={true} label="Beskriv hva du bruker datasettet til (valgfritt)" value={subscribeDescription} handleChange={setSubscribeDescription} />
                <br /><br />
                <Button variant="contained" color="primary" disabled={false} onClick={() => props.onClick(subsciptionUrl, subscribeDescription)}>
                    Abonner
                </Button>
            </div>
    );
};

export default SubscribeComp;

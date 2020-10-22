import React from 'react';
import { Button, Divider } from '@material-ui/core';
import Input from '../../Components/Forms/Input'

const SubscribeComp = (props) => {
    return (
        <div style={{ margin: '25px 0' }}>
            <Divider variant="fullWidth" />
            <br />
            <p>
                <i>Abonner på endringer</i>
            </p>
            <Input id="" multiline={false} label="Link til hva datasettet brukes til..." value="" handleChange={() => console.log("2")} />
            <br /><br />
            <Input id="" multiline={true} label="Beskriv hva du bruker datasettet til" value="" handleChange={() => console.log("2")} />
            <br /><br />
            <Button variant="contained" color="primary" disabled={false} onClick={props.onClick}>
                Abonner
      </Button>
        </div>
    );
};

export default SubscribeComp;

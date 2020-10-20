import React from 'react';
import { Button, Divider } from '@material-ui/core';

const RequestButtonComp = (props) => {
  return (
    <div style={{ margin: '25px 0' }}>
      <Divider variant="fullWidth" />
      <br />
      <p>
        <i>Er du interessert i dette datasettet?</i>
      </p>
      <Button variant="contained" color="primary" disabled={props.disabled} onClick={props.handleChange}>
        Etterspør datasett
      </Button>
    </div>
  );
};

export default RequestButtonComp;

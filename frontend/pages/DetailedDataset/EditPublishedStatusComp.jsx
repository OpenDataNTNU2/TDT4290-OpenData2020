import React, { useState } from 'react';
import { Button, FormControl, FormLabel } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

import RadioInput from '../../Components/Forms/RadioInput';

const EditPublishedStatusComp = (props) => {
  const [editBool, setEditBool] = useState(false);
  const [editText, setEditText] = useState(props.value);

  const [radioValue, setRadioValue] = useState('');

  const updateDataset = () => {
    switch (radioValue) {
      case '1': {
        setEditText('Publisert');
        break;
      }
      case '2': {
        setEditText('Ikke publisert');
        break;
      }
      case '3': {
        setEditText('Ikke publisert');
        break;
      }
    }
    props.updateDataset(radioValue, props.path);
    setEditBool(false);
  };

  return props.canEdit ? (
    editBool ? (
      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Status for publisering</FormLabel>
        <RadioInput
          id="publishStatus"
          mainValue={radioValue}
          handleChange={setRadioValue}
          value={['1', '2', '3']}
          label={['Publisert', 'Publisering planlagt', 'Ikke publisert']}
          color={['normal', 'normal', 'normal']}
        />
        <Button variant="contained" color="primary" onClick={updateDataset}>
          Lagre endring
        </Button>
      </FormControl>
    ) : (
      <p className={props.styles}>
        <span>Publiseringsstatus: </span>
        {editText} <EditIcon fontSize="small" onClick={() => setEditBool(true)} />
      </p>
    )
  ) : (
    <p className={props.styles}>
      <span>Publiseringsstatus: </span>
      {editText}{' '}
    </p>
  );
};

export default EditPublishedStatusComp;

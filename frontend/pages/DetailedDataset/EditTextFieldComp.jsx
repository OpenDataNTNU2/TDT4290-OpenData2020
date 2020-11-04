import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import Input from '../../Components/Forms/Input';

import styles from '../../styles/Detailed.module.css';

const EditComp = (props) => {
  const [editBool, setEditBool] = useState(false);
  const [editText, setEditText] = useState(props.value);

  const getHtmlTag = (type) => {
    switch (type) {
      case 'title':
        return (
          <h1 className={props.styles}>
            {editText} <EditIcon className={styles.editIcon} onClick={() => setEditBool(true)} />
          </h1>
        );
      case 'span':
        return (
          <p className={props.styles}>
            <span>{props.staticText}</span>
            {editText}
            <EditIcon className={styles.editIcon} fontSize="small" onClick={() => setEditBool(true)} />
          </p>
        );
      default:
        return '';
    }
  };

  const getHtmlTagNotEdit = (type) => {
    switch (type) {
      case 'title':
        return <h1 className={props.styles}>{editText}</h1>;
      case 'span':
        return (
          <p className={props.styles}>
            <span>{props.staticText}</span>
            {editText}
          </p>
        );
      default:
        return '';
    }
  };

  const updateDataset = () => {
    if (editText !== props.value) {
      props.updateDataset(editText, props.path);
      setEditBool(false);
    } else {
      setEditBool(false);
      console.log('Ingen endring');
    }
  };

  return props.canEdit ? (
    editBool ? (
      <Grid style={{ margin: '14px 0' }}>
        <Input id="edit" multiline={props.multiline} label="Endre" value={editText} handleChange={setEditText} />
        <Button variant="contained" color="primary" onClick={updateDataset}>
          Lagre endring
        </Button>
      </Grid>
    ) : (
      getHtmlTag(props.type)
    )
  ) : (
    getHtmlTagNotEdit(props.type)
  );
};

export default EditComp;

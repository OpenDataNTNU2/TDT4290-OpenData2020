import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import SelectTags from '../../Components/Forms/SelectTags';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';

import styles from '../../styles/Detailed.module.css';

const AddTagsComp = (props) => {
  const [editBool, setEditBool] = useState(false);
  const [editText] = useState(props.value ? props.value : []);

  // variables/states for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [newTags, setNewTags] = useState([]);

  useEffect(() => {
    GetApi('https://localhost:5001/api/tags', setTags);
  }, [props]);

  const submitTags = () => {
    console.log(selectedTags);
    if (newTags.length !== 0) {
      addNewTags();
    }
    props.updateDataset(selectedTags, props.path);
    setEditBool(false);
  };

  function addNewTags() {
    newTags?.map((tag) => PostApi('https://localhost:5001/api/tags', { name: tag.name }, postTagsInfo));
  }

  function postTagsInfo() {
    console.log('added new tags');
  }

  return props.canEdit ? (
    editBool ? (
      <div>
        <SelectTags
          mainLabel="Tags"
          tags={tags}
          setTags={setTags}
          onChange={setSelectedTags}
          selectedTags={selectedTags}
          newTags={newTags}
          setNewTags={setNewTags}
        />
        <Button variant="contained" color="primary" onClick={submitTags}>
          Oppdater søkeord
        </Button>
      </div>
    ) : (
      <p className={props.styles}>
        <span>Søkeord: </span>
        {editText.map((tag) => tag && `${tag.tags.name}, `)} {editText.length === 0 ? 'Ingen søkeord lagt til' : null}
        <EditIcon className={styles.editIcon} fontSize="small" onClick={() => setEditBool(true)} />
      </p>
    )
  ) : (
    <p className={props.styles}>
      <span>Søkeord: </span>
      {editText.map((tag) => tag && `${tag.tags.name}, `)} {editText.length === 0 ? 'Ingen søkeord lagt til' : null}
    </p>
  );
};

export default AddTagsComp;

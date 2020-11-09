import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import SelectTags from '../../Components/Forms/SelectTags';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';

import styles from '../../styles/Detailed.module.css';

const AddTagsComp = (props) => {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  const [editBool, setEditBool] = useState(false);
  const [editText, setEditText] = useState(
    props.value ? props.value.map((tag) => tag && tag.tags.name.toLowerCase()).join(', ') : []
  );

  // variables/states for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    props.value ? props.value.map((tag) => tag && tag.tags.id).join(',') : ''
  );
  const [newTags, setNewTags] = useState([]);

  useEffect(() => {
    console.log(tags.filter((t) => selectedTags.split(',').includes('' + t.id)));
    console.log(selectedTags.split(','));
    GetApi(`${host}/api/tags`, setTags);
  }, [props]);

  const submitTags = () => {
    if (newTags.length !== 0) {
      addNewTags();
    }
    props.updateDataset(selectedTags, props.path);
    setEditBool(false);
  };

  function addNewTags() {
    newTags?.map((tag) => PostApi(`${host}/api/tags`, { name: tag.name }, postTagsInfo));
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
          default={tags.filter((t) => selectedTags.split(',').includes('' + t.id))}
          setTags={setTags}
          onChange={setSelectedTags}
          onChangeText={setEditText}
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
        {editText}
        {editText.length === 0 ? 'Ingen søkeord lagt til' : null}
        <EditIcon className={styles.editIcon} fontSize="small" onClick={() => setEditBool(true)} />
      </p>
    )
  ) : (
    <p className={props.styles}>
      <span>Søkeord: </span>
      {editText}
      {editText.length === 0 ? 'Ingen søkeord lagt til' : null}
    </p>
  );
};

export default AddTagsComp;

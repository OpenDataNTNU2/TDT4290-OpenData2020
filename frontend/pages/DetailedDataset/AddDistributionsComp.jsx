import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Distribution from '../../Components/Forms/Distribution';
import PostApi from '../../Components/ApiCalls/PostApi';

const AddDistributionsComp = (props) => {
  const [editBool, setEditBool] = useState(false);
  const [distTitle, setDistTitle] = useState(['']);
  const [distUri, setDistUri] = useState(['']);
  const [distFileFormat, setDistFileFormat] = useState(['1']);

  const updateDataset = () => {
    props.updatePage();
  };

  const addDistribution = () => {
    if (distTitle === '' || distUri === '') {
      // ikke fylt inn riktig
    } else {
      const data2 = {
        title: distTitle[0],
        uri: distUri[0],
        fileFormat: parseInt(distFileFormat[0]),
        datasetId: props.dataId,
      };
      try {
        PostApi('https://localhost:5001/api/distributions', data2, updateDataset);
      } catch (_) {
        alert('failed to post dataset');
      }
    }
    setEditBool(false);
  };

  return props.canEdit ? (
    editBool ? (
      <div>
        <Distribution
          title={distTitle}
          setTitle={setDistTitle}
          uri={distUri}
          setUri={setDistUri}
          fileFormat={distFileFormat}
          setFileFormat={setDistFileFormat}
          number={0}
        />
        <Button variant="contained" color="primary" onClick={addDistribution}>
          Legg til
        </Button>
      </div>
    ) : (
      <Button variant="contained" color="primary" onClick={() => setEditBool(true)}>
        Legg til ny distribusjon
      </Button>
    )
  ) : null;
};

export default AddDistributionsComp;

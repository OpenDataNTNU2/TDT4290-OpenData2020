import { Grid, Button, FormControl, FormLabel, Snackbar, MenuItem, InputLabel, Select } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useState, useEffect } from 'react';
import PostApi from '../ApiCalls/PostApi';
import GetApi from '../ApiCalls/GetApi';
import PatchApi from '../ApiCalls/PatchApi';

import Input from '../Forms/Input';
import SelectCategory from '../Forms/SelectCategory';
import SelectTags from '../Forms/SelectTags';

import RadioInput from '../Forms/RadioInput';


export default function CreateCoordination(props) {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;


  const [openSuccessFeedback, setOpenSuccessFeedback] = useState(false);
  const [openFailedFeedback, setOpenFailedFeedback] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // radiobuttons, value can be "1" or "2"
  const [datasetOption, setDatasetOption] = useState('2');

  // radiobuttons for coordination status, true for ongoing and false for coordinated (samordnet)
  const [coordinationStatus, setCoordinationStatus] = useState('false');

  // description of the coordination status
  const [statusDescription, setStatusDescription] = useState('');

  // All datasets the logged in user have/own
  const [datasets, setDatasets] = useState([]);

  // dataset to add to coordination
  const [selectedDataset, setSelectedDataset] = useState('');

  // variables/states for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // variables/states for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [newTags, setNewTags] = useState([]);

  // accesslevel, can be "1", "2" or "3"
  const [accessLevel, setAccessLevel] = useState('1');

  /**
   * Patch the dataset with the new coordination, then resets the states
   * @param {int} id - The id for added coordination
   */
  const submitPostReq = (id) => {
    const data = [
      {
        value: id,
        path: '/coordinationId',
        op: 'replace',
      },
    ];
    if (datasetOption === '1') PatchApi(`${host}/api/datasets/${selectedDataset.id}`, data);
    console.log(`Posted coordination to: ${host}/api/coordinations`);

    setOpenSuccessFeedback(true);
    setTitle('');
    setDescription('');
    setDatasetOption('0');
    setCoordinationStatus('true');
    setStatusDescription('');
    setSelectedDataset('');
  };

  const addTags = () => {
    newTags.map((tag) => PostApi(`${host}/api/tags`, { name: tag.name }));
  };

  /**
   * Post the new coordination with @const {Object} data, then adds the new tags to the database
   */
  const handleChange = () => {
    const data = {
      title,
      description,
      publisherId: props.publisherId,
      categoryId: selectedCategory,
      tagsIds: selectedTags,
      statusDescription: coordinationStatus === 'true' ? statusDescription : '',
      underCoordination: coordinationStatus !== 'false',
      accessLevel: parseInt(accessLevel),
    };
    if (title !== '' && description !== '') {
      PostApi(`${host}/api/coordinations`, data, submitPostReq, '/DetailedCoordination/');
    } else {
      setOpenFailedFeedback(true);
    }
    addTags();
  };


  /**
   * runs when the components mounts, fetches datasets, categories and tags
   */
  useEffect(() => {
    GetApi(`${host}/api/datasets?PublisherIds=${props.publisherId}`, setDatasets);
    GetApi(`${host}/api/categories`, setCategories);
    GetApi(`${host}/api/tags`, setTags);
  }, [props]);

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      style={{ minHeight: '70vh', minWidth: '60vh', marginTop: '5vh' }}
    >
      <Input
        id="titleCoordination"
        multiline={false}
        label="Tittel på samordning*"
        value={title}
        handleChange={setTitle}
      />
      <br />
      <Input
        id="descriptionCoordination"
        multiline
        label="Beskrivelse av samordning*"
        value={description}
        handleChange={setDescription}
      />
      <br />

      <SelectCategory
        id="category"
        mainLabel="Kategori*"
        value={categories}
        setSelectedCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <br />

      <SelectTags
        mainLabel="Tags"
        tags={tags}
        setTags={setTags}
        onChange={setSelectedTags}
        selectedTags={selectedTags}
        newTags={newTags}
        setNewTags={setNewTags}
      />
      <br />
      <br />

      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Tilgangsnivå*</FormLabel>
        <RadioInput
          id="accessLevel"
          mainValue={accessLevel}
          handleChange={setAccessLevel}
          value={['1', '2', '3']}
          label={['Kan deles offentlig', 'Begrenset offentlighet', 'Unntatt offentlighet']}
          color={['green', 'yellow', 'red']}
        />
      </FormControl>
      <br />
      <br />

      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Status for samordning*</FormLabel>
        <RadioInput
          id="statusForCoordination"
          mainValue={coordinationStatus}
          handleChange={setCoordinationStatus}
          value={['false', 'true']}
          label={['Samordning', 'Pågående samordning']}
          color={['normal', 'normal']}
        />
      </FormControl>
      <br />

      {coordinationStatus === 'true' ? (
        <div>
          <Input
            id="coordinationStatusId"
            multiline
            label="Nåværende status for samordning"
            value={statusDescription}
            handleChange={setStatusDescription}
          />
          <br />
          <br />
          <br />
        </div>
      ) : null}

      <br />
      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Legg til datasett*</FormLabel>
        <RadioInput
          id="addDatasetToCoordination"
          mainValue={datasetOption}
          handleChange={setDatasetOption}
          value={['2', '1']}
          label={['Ikke legg til datasett', 'Legg til datasett']}
          color={['normal', 'normal']}
        />
      </FormControl>
      <br />

      {datasetOption === '1' ? (
        <div>
          <FormControl variant="outlined" style={{ width: '50vh' }}>
            <InputLabel id="demo-simple-select-label">Velg datasett</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Velg dataset"
              id="demo-simple-select"
              value={selectedDataset}
              onChange={(event) => setSelectedDataset(event.target.value)}
            >
              {Object.values(datasets.items).map(
                (dataset) =>
                  dataset && (
                    <MenuItem value={dataset} key={dataset.id}>
                      {dataset.title}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>
          <br />
          <br />
          <br />
        </div>
      ) : null}

      <br />
      <Button variant="contained" size="large" color="primary" onClick={handleChange} fullWidth>
        Opprett samordning
      </Button>

      <Snackbar open={openFailedFeedback} autoHideDuration={5000} onClose={() => setOpenFailedFeedback(false)}>
        <Alert elevation={1} severity="error">
          Obs, du må fylle inn alle punktene
        </Alert>
      </Snackbar>

      <Snackbar open={openSuccessFeedback} autoHideDuration={5000} onClose={() => setOpenSuccessFeedback(false)}>
        <Alert elevation={1} severity="success">
          Samordning opprettet
        </Alert>
      </Snackbar>
    </Grid>
  );
}

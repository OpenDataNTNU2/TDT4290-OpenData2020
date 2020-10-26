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

// TODO: Fikse feedback hvis en ugyldig link blir benyttet, ellers funker det :)
export default function CreateCoordination(props) {
  // feedback til bruker, setter snackbars i bunn til true/false
  const [openSuccessFeedback, setOpenSuccessFeedback] = useState(false);
  const [openFailedFeedback, setOpenFailedFeedback] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // radioknapper, settes til verdier "1", "2" osv
  const [datasetOption, setDatasetOption] = useState('0');

  // radio knapper for coordination status, true for ongoing and false for coordinated (samordnet)
  const [coordinationStatus, setCoordinationStatus] = useState('true');

  // beskrivelse av hvor i samordningsprossessen man er
  const [statusDescription, setStatusDescription] = useState('');

  // hvis bruker trykker på legg til dataset, kommer datasettene de "eier" inn her
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

  // accesslevel
  const [accessLevel, setAccessLevel] = useState('1');

  // resetter alle feltene etter en submit, sender også inn coordination til det valgte datasettet hvis datasetOption = "1"
  const submitPostReq = (id) => {
    const data = [
      {
        value: id,
        path: '/coordinationId',
        op: 'replace',
      },
    ];
    if (datasetOption === '1') PatchApi(`https://localhost:5001/api/datasets/${selectedDataset.id}`, data);
    console.log('Posted coordination to: https://localhost:5001/api/coordinations');

    setOpenSuccessFeedback(true);
    setTitle('');
    setDescription('');
    setDatasetOption('0');
    setCoordinationStatus('true');
    setStatusDescription('');
    setSelectedDataset('');
  };

  const addTags = () => {
    newTags.map((tag) => PostApi('https://localhost:5001/api/tags', { name: tag.name }));
  };

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
      PostApi('https://localhost:5001/api/coordinations', data, submitPostReq);
    } else {
      setOpenFailedFeedback(true);
    }
    addTags();
  };

  // this should be fetched when clicking the radiobutton for choose existing
  useEffect(() => {
    GetApi(`https://localhost:5001/api/datasets?PublisherIds=${props.publisherId}`, setDatasets);
    GetApi('https://localhost:5001/api/categories', setCategories);
    GetApi('https://localhost:5001/api/tags', setTags);
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
        label="Tittel på samordningen"
        value={title}
        handleChange={setTitle}
      />
      <br />

      <Input
        id="descriptionCoordination"
        multiline
        label="Beskrivelse på samordningen"
        value={description}
        handleChange={setDescription}
      />
      <br />

      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Status for samordning</FormLabel>
        <RadioInput
          id="statusForCoordination"
          mainValue={coordinationStatus}
          handleChange={setCoordinationStatus}
          value={['true', 'false']}
          label={['Pågående samordning', 'Samordnet']}
          color={['normal', 'normal']}
        />
      </FormControl>

      {coordinationStatus === 'true' ? (
        <Input
          id="coordinationStatusId"
          multiline
          label="Nåværende status for samordningen"
          value={statusDescription}
          handleChange={setStatusDescription}
        />
      ) : null}
      <br />

      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Legg til dataset</FormLabel>
        <RadioInput
          id="addDatasetToCoordination"
          mainValue={datasetOption}
          handleChange={setDatasetOption}
          value={['1', '2']}
          label={['Legg til dataset', 'Ikke legg til dataset']}
          color={['normal', 'normal']}
        />
      </FormControl>
      <br />

      {datasetOption === '1' ? (
        <div>
          {/* Midlertidig funk for å teste */}
          <FormControl variant="outlined" style={{ width: '50vh' }}>
            <InputLabel id="demo-simple-select-label">Velg dataset</InputLabel>
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
        </div>
      ) : null}
      <br />
      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Tilgangsnivå</FormLabel>
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
      <SelectCategory
        id="category"
        mainLabel="Kategori"
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
      <Button variant="contained" color="primary" onClick={handleChange}>
        Opprett
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

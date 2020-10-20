import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Snackbar,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useEffect, useState } from 'react';

// import forms
import Distribution from '../Forms/Distribution';
import Input from '../Forms/Input';
import RadioInput from '../Forms/RadioInput';
import SelectCategory from '../Forms/SelectCategory';
import SelectTags from '../Forms/SelectTags';

import GetApi from '../ApiCalls/GetApi';
import PostApi from '../ApiCalls/PostApi';

export default function CreateDataset(props) {
  // variables/states for "main data", will add more here
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState('1');

  // accesslevel
  const [accessLevel, setAccessLevel] = useState('1');

  const date = new Date();

  function fixDate(fixingDate) {
    const dd = fixingDate.getDate() < 10 ? `0${fixingDate.getDate()}` : fixingDate.getDate();
    let mm = fixingDate.getMonth() < 10 ? `0${fixingDate.getMonth()}` : fixingDate.getMonth();
    // month is from 0-11 in javascript but 1-12 in html:)
    mm = parseInt(mm, 10) + 1;
    const yyyy = fixingDate.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  const [startDate, setStartDate] = useState(fixDate(date));

  // variables/states for the distribution
  const [distribution, setDistribution] = useState(0);
  const [distTitle, setDistTitle] = useState(['']);
  const [distUri, setDistUri] = useState(['']);
  const [distFileFormat, setDistFileFormat] = useState(['1']);

  // variables/states for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState('');
  const [newTags, setNewTags] = useState([]);

  // variables/states for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // show / not show snackbar with successfull submit message
  const [open, setOpen] = useState(false);
  const [feedbackRequired, setFeedbackRequired] = useState(false);

  // variables/states for sending request to join coordination
  const [wantToRequestCoordination, setWantToRequestCoordination] = useState('1');
  const [joinCoordinationReason, setJoinCoordinationReason] = useState('');
  const [coordinations, setCoordinations] = useState([]);
  const [selectedCoordination, setSelectedCoordination] = useState('');

  // data sent to PostApi when posting new dataset
  const data = {
    identifier: 'denne bør settes i backend',
    title,
    description,
    publisherId: props.prevPublisherId,
    publicationStatus: parseInt(published),
    accessLevel: parseInt(accessLevel),
    categoryId: selectedCategory,
    tagsIds: selectedTags,
  };

  // this is run inside of PostApi in distribution, clear states after added distributions
  const postDistributions = () => {
    setOpen(true);
    clearStates();
  };

  const setPublishedStatus = (value) => {
    setPublished(value);
    if (value === '1') setStartDate('2020-10-12');
    else if (value === '2') {
      return null;
    } else {
      setStartDate('2020-10-12');
    }
  };

  // this is run inside of PostApi for datasets, adds distributions
  const addDistributions = (dataId) => {
    for (let i = 0; i < distribution; i += 1) {
      const data2 = {
        title: distTitle[i],
        uri: distUri[i],
        fileFormat: parseInt(distFileFormat[i]),
        datasetId: dataId,
      };
      try {
        PostApi('https://localhost:5001/api/distributions', data2, postDistributions);
      } catch (_) {
        alert('failed to post dataset');
      }
    }
    if (published === '1' && accessLevel === '1') {
      submitApplicationToJoinCoordination(dataId);
    }

    if (distribution === 0) {
      setOpen(true);
      clearStates();
    }
  };

  const addTags = () => {
    newTags.map((tag) => PostApi('https://localhost:5001/api/tags', { name: tag.name }, postDistributions));
  };

  // posts data into the api with datasets
  // and if successfull runs addDistributions
  const handleChange = async () => {
    console.log(`data: ${data}`);
    console.log(data);
    if (checkRequiredVariables()) {
      PostApi('https://localhost:5001/api/datasets', data, addDistributions);
      addTags();
    } else {
      setFeedbackRequired(true);
    }
  };

  function checkRequiredVariables() {
    if (title !== '' && description !== '' && selectedCategory !== '') {
      if (wantToRequestCoordination === '2' && selectedCoordination !== '' && joinCoordinationReason !== '') {
        return true;
      }
      if (wantToRequestCoordination !== '2') {
        return true;
      }
    }
    return false;
  }

  // every time prevLoggedIn changes / aka the page refreshes, it fetches tags, categories and coordinations
  useEffect(() => {
    GetApi('https://localhost:5001/api/tags', setTags);
    GetApi('https://localhost:5001/api/categories', setCategories);
    GetApi('https://localhost:5001/api/coordinations', setCoordinations);
  }, [props.prevLoggedIn]);

  function submitApplicationToJoinCoordination(id) {
    const d = {
      reason: joinCoordinationReason,
      coordinationId: selectedCoordination,
      datasetId: id,
    };
    PostApi('https://localhost:5001/api/applications', d, successfullySentApplication);
  }

  function successfullySentApplication() {
    console.log('application sent to: https://localhost:5001/api/applications');
    setSelectedCoordination('');
    setJoinCoordinationReason('');
  }

  // updates the distribution states when adding more distributions
  const addNewMoreDistributions = () => {
    setDistribution(distribution + 1);
    setDistTitle([...distTitle, '']);
    setDistUri([...distUri, '']);
    setDistFileFormat([...distFileFormat, 1]);
  };

  // removes last distribution from states when removing a distribution
  const removeDistribution = () => {
    setDistTitle(distTitle.splice(-1, 1));
    setDistUri(distUri.splice(-1, 1));
    setDistFileFormat(distFileFormat.splice(-1, 1));
    setDistribution(distribution - 1);
  };

  // resets all the states, this is executed after successfully submitting a dataset
  // it is no restrictions for input fields missing etc, so in theory, it is successfull no matter what now..
  function clearStates() {
    setTitle('');
    setDescription('');
    setPublished('1');

    setDistTitle(['']);
    setDistUri(['']);
    setDistFileFormat([0]);
    setDistribution(0);

    setSelectedTags('');
    setNewTags([]);
    setAccessLevel('1');
    setSelectedCategory('');
  }

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      style={{ minHeight: '70vh', minWidth: '60vh', marginTop: '5vh' }}
    >
      <Input id="title" label="Tittel (*)" value={title} handleChange={setTitle} multiline={false} />
      <br />
      {/* Denne er basert på kundemail */}
      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Status for publisering</FormLabel>
        <RadioInput
          id="publishStatus"
          mainValue={published}
          handleChange={setPublishedStatus}
          value={['1', '2', '3']}
          label={['Publisert', 'Publisering planlagt', 'Ikke publisert']}
          color={['normal', 'normal', 'normal']}
        />
      </FormControl>
      <br />
      {/* Dette feltet skal være valgfritt å ha med, og skal kun sendes med hvis status er "publisering planlagt" */}
      {published === '2' ? (
        <FormControl variant="outlined" style={{ width: '50vh' }}>
          <TextField
            variant="outlined"
            size="medium"
            id="dateForPublish"
            label="Planlagt publisering (valgfri)"
            type="date"
            defaultValue={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      ) : null}

      <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
        <FormLabel component="legend">Tilgangsnivå</FormLabel>
        <RadioInput
          id="accessLevel"
          mainValue={accessLevel}
          handleChange={setAccessLevel}
          value={['1', '2', '3']}
          label={['Offentlig', 'Begrenset offentlighet', 'Unntatt offentlighet']}
          color={['green', 'yellow', 'red']}
        />
      </FormControl>

      <br />
      <Input id="description" label="Beskrivelse (*)" value={description} handleChange={setDescription} multiline />
      <br />
      <SelectCategory
        id="category"
        mainLabel="Kategori (*)"
        value={categories}
        setSelectedCategory={setSelectedCategory}
        selected={selectedCategory}
        label={['Option 1', 'Option 2', 'Option 3']}
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
      {published === '1' && accessLevel === '1' ? (
        <FormControl component="fieldset" style={{ minWidth: '50vh' }}>
          <FormLabel component="legend">Forespørsel om å bli med i samordning</FormLabel>
          <RadioInput
            id="joinCoordination"
            mainValue={wantToRequestCoordination}
            handleChange={setWantToRequestCoordination}
            value={['1', '2']}
            label={['Ikke bli med i samordning', 'Bli med i en samordning']}
            color={['normal', 'normal']}
          />
        </FormControl>
      ) : null}
      {/* Send forespørsel om å bli med i samordningen */}

      {wantToRequestCoordination === '2' && published === '1' && accessLevel === '1' ? (
        <FormControl variant="outlined" style={{ width: '50vh' }}>
          <InputLabel id="requestToJoinCoordinationLabel">Velg samordning (*)</InputLabel>
          <Select
            labelId="requestToJoinCoordinationLabelID"
            label="Velg samordning (*)"
            id="requestToJoinCoordinationID"
            value={selectedCoordination}
            onChange={(event) => setSelectedCoordination(event.target.value)}
          >
            {coordinations.items &&
              Object.values(coordinations.items).map((coordination) =>
                coordination.publisher.id !== parseInt(props.prevPublisherId) ? (
                  <MenuItem value={coordination.id} key={coordination.id}>
                    {coordination.title} -{coordination.publisher.name}
                  </MenuItem>
                ) : null
              )}
          </Select>
        </FormControl>
      ) : null}
      <br />

      {wantToRequestCoordination === '2' && published === '1' && accessLevel === '1' ? (
        <Input
          id="joinCoordinationId"
          multiline
          label="Begrunnelse for forespørsel (*)"
          value={joinCoordinationReason}
          handleChange={setJoinCoordinationReason}
        />
      ) : null}
      <br />

      {published === '1' && distribution === 0 ? (
        <Button variant="contained" color="primary" onClick={() => setDistribution(1)}>
          Legg til distribusjon
        </Button>
      ) : null}
      {distribution === 0 ? null : (
        <Grid>
          <br />
          <h1 style={{ fontWeight: 'normal', textAlign: 'center' }}>Legg til distribusjon</h1>
          {Array.from(Array(distribution), (e, i) => {
            return (
              <div key={`dist${i.toString()}`}>
                <Divider variant="middle" />
                <Distribution
                  title={distTitle}
                  setTitle={setDistTitle}
                  uri={distUri}
                  setUri={setDistUri}
                  fileFormat={distFileFormat}
                  setFileFormat={setDistFileFormat}
                  number={i}
                />
              </div>
            );
          })}
        </Grid>
      )}
      {distribution !== 0 && published === '1' ? (
        <div>
          <Button variant="contained" color="secondary" onClick={removeDistribution}>
            Fjern
          </Button>
          <Button variant="contained" color="primary" onClick={addNewMoreDistributions}>
            Legg til
          </Button>
        </div>
      ) : null}
      <br />
      <Button variant="contained" color="primary" onClick={handleChange}>
        Send inn
      </Button>
      <br />
      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert elevation={1} severity="success">
          Datasett publisert
        </Alert>
      </Snackbar>
      <Snackbar open={feedbackRequired} autoHideDuration={5000} onClose={() => setFeedbackRequired(false)}>
        <Alert elevation={1} severity="error">
          Husk å fylle inn alle feltene som kreves (*)
        </Alert>
      </Snackbar>
    </Grid>
  );
}

import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Divider,
  Snackbar,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import { useEffect, useState } from "react";

// import forms
import Distribution from "../Forms/Distribution";
import Input from "../Forms/Input";
import RadioInput from "../Forms/RadioInput";
import SelectInput from "../Forms/SelectInput";
import SelectTags from "../Forms/SelectTags";

// import api functions
import GetApi from "../ApiCalls/GetApi";
import PostApi from "../ApiCalls/PostApi";

export default function CreateDataset(props) {
  // variables/states for "main data", will add more here
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState("0");

  // accesslevel
  const [accessLevel, setAccessLevel] = useState("0");

  const [startDate, setStartDate] = useState("2020-10-12");

  // variables/states for the distribution
  const [distribution, setDistribution] = useState(0);
  const [distTitle, setDistTitle] = useState([""]);
  const [distUri, setDistUri] = useState([""]);
  const [distFileFormat, setDistFileFormat] = useState(["1"]);

  // variables/states for tags
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState("");
  const [newTags, setNewTags] = useState([]);

  // variables/states for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // show / not show snackbar with successfull submit message
  const [open, setOpen] = useState(false);

  // data sent to PostApi when posting new dataset
  const data = {
    identifier: "denne bør settes i backend",
    title: title,
    description: description,
    publisherId: props.prevPublisherId,
    publicationStatus: parseInt(published),
    detailedPublicationStatus: 0,
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
    if (value === "1") setStartDate("2020-10-12");
    else if (value === "2") setAccessLevel("0");
    else {
      setStartDate("2020-10-12");
      setAccessLevel("0");
    }
  };

  // this is run inside of PostApi for datasets, adds distributions
  const addDistributions = (dataId) => {
    for (let i = 0; i < distribution; i++) {
      const data2 = {
        title: distTitle[i],
        uri: distUri[i],
        fileFormat: parseInt(distFileFormat[i]),
        datasetId: dataId,
      };
      try {
        PostApi(
          "https://localhost:5001/api/distributions",
          data2,
          postDistributions
        );
      } catch (_) {
        alert("failed to post dataset");
      }
    }
    if (distribution === 0) {
      setOpen(true);
      clearStates();
    }
  };

  const addTags = () => {
    newTags.map((tag) =>
      PostApi(
        "https://localhost:5001/api/tags",
        { name: tag.name },
        postDistributions
      )
    );
  };

  // posts data into the api with datasets
  // and if successfull runs addDistributions
  const handleChange = async () => {
    console.log("Vi har postet med denne data:", data);
    PostApi("https://localhost:5001/api/datasets", data, addDistributions);
    addTags();
  };

  // every time prevLoggedIn changes / aka the page refreshes, it fetches tags and categories
  useEffect(() => {
    GetApi("https://localhost:5001/api/tags", setTags);
    GetApi("https://localhost:5001/api/categories", setCategories);
  }, [props.prevLoggedIn]);

  // updates the distribution states when adding more distributions
  const addNewMoreDistributions = () => {
    setDistribution(distribution + 1);
    setDistTitle([...distTitle, ""]);
    setDistUri([...distUri, ""]);
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
  const clearStates = () => {
    setTitle("");
    setDescription("");
    setPublished("1");
    setPublishedStatus("0");

    setDistTitle([""]);
    setDistUri([""]);
    setDistFileFormat([0]);
    setDistribution(0);

    setSelectedTags("");

    setSelectedCategory("");
  };

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      style={{ minHeight: "70vh", minWidth: "60vh", marginTop: "5vh" }}
    >
      <Input
        id="title"
        label="Tittel"
        value={title}
        handleChange={setTitle}
        multiline={false}
      />
      <br />
      {/* Denne er basert på kundemail */}
      <FormControl component="fieldset" style={{ minWidth: "50vh" }}>
        <FormLabel component="legend">Status for publisering</FormLabel>
        <RadioInput
          id="publishStatus"
          mainValue={published}
          handleChange={setPublishedStatus}
          value={["1", "2", "3"]}
          label={["Publisert", "Publisering planlagt", "Ikke publisert"]}
          color={["normal", "normal", "normal"]}
        />
      </FormControl>
      <br />
      {/* Dette feltet skal være valgfritt å ha med, og skal kun sendes med hvis status er "publisering planlagt" */}
      {published === "2" ? (
        <FormControl variant="outlined" style={{ width: "50vh" }}>
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
      {published === "1" ? (
        <FormControl component="fieldset" style={{ minWidth: "50vh" }}>
          <FormLabel component="legend">Tilgangsnivå</FormLabel>
          <RadioInput
            id="accessLevel"
            mainValue={accessLevel}
            handleChange={setAccessLevel}
            value={["1", "2", "3"]}
            label={[
              "Offentlig",
              "Begrenset offentlighet",
              "Unntatt offentlighet",
            ]}
            color={["green", "yellow", "red"]}
          />
        </FormControl>
      ) : null}{" "}
      <br />
      <Input
        id="description"
        label="Beskrivelse"
        value={description}
        handleChange={setDescription}
        multiline={true}
      />
      <br />
      <SelectInput
        id="category"
        mainLabel="Kategori: Not relevant yet"
        value={categories}
        setSelectedCategory={setSelectedCategory}
        selected={selectedCategory}
        label={["Option 1", "Option 2", "Option 3"]}
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
      {published === "1" && distribution === 0 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDistribution(1)}
        >
          Legg til distribusjon
        </Button>
      ) : null}
      {distribution === 0 ? null : (
        <Grid>
          <br />
          <h1 style={{ fontWeight: "normal", textAlign: "center" }}>
            Legg til distribusjon
          </h1>
          {Array.from(Array(distribution), (e, i) => {
            return (
              <div key={"dist" + i.toString()}>
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
      /* Dette feltet skal være valgfritt å ha med, og skal kun sendes med hvis
      status er "publisering planlagt" */
      {published === "2" ? (
        <FormControl variant="outlined" style={{ width: "50vh" }}>
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
      {published === "1" ? (
        <FormControl component="fieldset" style={{ minWidth: "50vh" }}>
          <FormLabel component="legend">Tilgangsnivå</FormLabel>
          <RadioInput
            id="accessLevel"
            mainValue={accessLevel}
            handleChange={setAccessLevel}
            value={["1", "2", "3"]}
            label={[
              "Offentlig",
              "Begrenset offentlighet",
              "Unntatt offentlighet",
            ]}
            color={["green", "yellow", "red"]}
          />
        </FormControl>
      ) : null}{" "}
      <br />
      {published === "1" && distribution === 0 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDistribution(1)}
        >
          Legg til distribusjon
        </Button>
      ) : null}
      {distribution === 0 ? null : (
        <Grid>
          <br />
          <h1 style={{ fontWeight: "normal", textAlign: "center" }}>
            Legg til distribusjon
          </h1>
          {Array.from(Array(distribution), (e, i) => {
            return (
              <div key={"dist" + i.toString()}>
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
      {distribution !== 0 && published === "1" ? (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={removeDistribution}
          >
            Fjern
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={addNewMoreDistributions}
          >
            Legg til
          </Button>
        </div>
      ) : null}
      <br />
      <Button variant="contained" color="primary" onClick={handleChange}>
        Send inn
      </Button>
      <br />
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert elevation={1} severity="success">
          Datasett publisert
        </Alert>
      </Snackbar>
    </Grid>
  );
}

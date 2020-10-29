import { Grid, Button, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useState, useEffect } from 'react';
import PostApi from '../ApiCalls/PostApi';
import GetApi from '../ApiCalls/GetApi';

import SelectCategory from '../Forms/SelectCategory';
import Input from '../Forms/Input';

// TODO: Fikse feedback hvis en ugyldig link blir benyttet, ellers funker det :)
export default function CreateDataset() {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  const [importUrl, setImportUrl] = useState('');
  const [numberOfDatasets, setNumberOfDatasets] = useState(10);
  const [open, setOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    GetApi(`${host}/api/categories`, setCategories);
  }, []);

  const importDataset = () => {
    const category = selectedCategory ? `&categoryId=${selectedCategory}` : '';
    PostApi(`${host}/api/datasets/import?url=${importUrl}${category}`, { url: importUrl }, importPostReq);
  };
  const populateSite = () => {
    PostApi(`${host}/api/datasets/populate?numberOfDatasets=${numberOfDatasets}`, { numberOfDatasets }, importPostReq);
  };
  const importCategories = () => {
    PostApi(`${host}/api/categories/import?url=${importUrl}`, { url: importUrl }, importPostReq);
  };

  function importPostReq() {
    console.log(`imported dataset from: ${importUrl}`);
    setOpen(true);
    setImportUrl('');
  }

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      style={{ minHeight: '70vh', minWidth: '60vh', marginTop: '5vh' }}
    >
      <Input
        id="importUrl"
        label="Url som importeres fra"
        value={importUrl}
        handleChange={setImportUrl}
        multiline={false}
      />
      <br />
      <SelectCategory
        id="category"
        mainLabel="Kategori"
        value={categories}
        setSelectedCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <br />

      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <Button variant="contained" color="primary" onClick={importDataset}>
          Importer datasett
        </Button>
        <br />
        <Button variant="contained" color="primary" onClick={importCategories}>
          Importer kategorier
        </Button>
        <br />
      </Grid>

      <Alert elevation={1} severity="info">
        Kopier inn en link for å importere, eks:
        <br /> Datset: https://data.norge.no/datasets/fff3a365-cd82-448e-97a2-05aade8f6cf1
        <br /> Kategorier: https://psi.norge.no/los/tema/arbeid
      </Alert>
      <br />
      <br />

      <Input
        id="populateNumberOfDatasets"
        label="Antall datasett"
        value={numberOfDatasets}
        handleChange={setNumberOfDatasets}
        multiline={false}
      />
      <br />
      <Button variant="contained" color="primary" onClick={populateSite}>
        Populer
      </Button>
      <br />

      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert elevation={1} severity="success">
          Datasett importert
        </Alert>
      </Snackbar>
    </Grid>
  );
}

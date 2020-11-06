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
  const [open, setOpen] = useState(false);
  const [required, setRequired] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    GetApi(`${host}/api/categories`, setCategories);
  }, []);

  const importDataset = () => {
    if (selectedCategory === '' || importUrl === '') {
      setRequired(true);
      return;
    }
    const category = selectedCategory ? `&categoryId=${selectedCategory}` : '';
    PostApi(`${host}/api/datasets/import?url=${importUrl}${category}`, { url: importUrl }, importPostReq);
  };

  function importPostReq(id) {
    if (id == null) {
      setInvalid(true);
    } else {
      setOpen(true);
      setImportUrl('');
    }
  }

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      alignItems="center"
      style={{ minHeight: '70vh', minWidth: '60vh', marginTop: '5vh' }}
    >
      <Input id="importUrl" label="Url*" value={importUrl} handleChange={setImportUrl} multiline={false} />
      <br />
      <SelectCategory
        id="category"
        mainLabel="Kategori*"
        value={categories}
        setSelectedCategory={setSelectedCategory}
        selected={selectedCategory}
      />
      <br />
      <br />
      <br />

      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <Button variant="contained" color="primary" onClick={importDataset} fullWidth>
          Importer datasett
        </Button>
        <br />
      </Grid>
      <br />
      <br />
      <br />
      <Alert elevation={1} severity="info">
        Skriv inn en link du vil importere fra, f. eks:
        <br /> https://data.norge.no/datasets/fff3a365-cd82-448e-97a2-05aade8f6cf1
      </Alert>
      <br />
      <br />

      <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert elevation={1} severity="success">
          Datasett importert
        </Alert>
      </Snackbar>
      <Snackbar open={required} autoHideDuration={5000} onClose={() => setRequired(false)}>
        <Alert elevation={1} severity="error">
          Husk å fylle inn alle feltene som kreves
        </Alert>
      </Snackbar>
      <Snackbar open={invalid} autoHideDuration={5000} onClose={() => setInvalid(false)}>
        <Alert elevation={1} severity="error">
          Ugyldig link
        </Alert>
      </Snackbar>
    </Grid>
  );
}

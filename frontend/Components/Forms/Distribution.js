import { TextField, FormControl, InputLabel, Select } from '@material-ui/core';

export default function Distribution(props) {
  const handleChange = (arr, func, index, event) => {
    const newArr = [...arr];
    newArr[index] = event.target.value;
    func(newArr);
  };

  return (
    <div style={{ padding: '3vh' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <form noValidate autoComplete="off" style={{ width: '30vh', marginRight: '6px' }}>
          <TextField
            id={`title${props.number.toString()}`}
            label="Tittel"
            size="medium"
            variant="outlined"
            fullWidth
            value={props.title[props.number]}
            onChange={(e) => handleChange(props.title, props.setTitle, props.number, e, props.title[props.number])}
          />
        </form>
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Filformat</InputLabel>
            <Select
              native
              style={{ width: '20vh' }}
              id={`select${props.number.toString()}`}
              label="Fil format"
              inputProps={{
                name: 'type',
                id: 'outlined-age-native-simple',
              }}
              value={props.fileFormat[props.number]}
              onChange={(e) =>
                handleChange(props.fileFormat, props.setFileFormat, props.number, e, props.fileFormat[props.number])
              }
            >
              <option value={1}>JSON</option>
              <option value={2}>XML</option>
              <option value={3}>Annet</option>
            </Select>
          </FormControl>
        </div>
      </div>
      <br />
      <form noValidate autoComplete="off">
        <TextField
          id={`uri${props.number.toString()}`}
          label="uri"
          size="medium"
          variant="outlined"
          fullWidth
          value={props.uri[props.number]}
          onChange={(e) => handleChange(props.uri, props.setUri, props.number, e, props.uri[props.number])}
        />
      </form>
    </div>
  );
}

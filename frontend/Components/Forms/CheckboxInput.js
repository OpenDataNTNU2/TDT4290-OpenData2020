import { Checkbox, FormControlLabel } from '@material-ui/core';

const CheckboxInput = (props) => {
  const handleChange = (event) => {
    props.handleChange(event);
  };

  return (
    <FormControlLabel
      key={props.id}
      control={<Checkbox value={props.id} onClick={handleChange} name={props.name} />}
      label={props.name}
      style={{ width: '80%' }}
    />
  );
};

export default CheckboxInput;

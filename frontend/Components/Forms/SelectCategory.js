import { FormControl, InputLabel, Select, MenuItem, ListItemText } from '@material-ui/core';

const SelectCategory = (props) => {
  const handleChange = (event) => {
    props.setSelectedCategory(event.target.value);
    console.log(`test value: ${event.target.value}`);
  };

  const getCategories = (categories, margin) => {
    const result = [];
    categories.map((category) => {
      result.push(
        <MenuItem style={{ marginLeft: `${margin}px` }} key={category.id} value={category.id}>
          <ListItemText primary={category.name} />
        </MenuItem>
      );
      result.push.apply(result, getCategories(category.narrower, margin + 15));
    });
    return result;
  };
  return (
    <FormControl variant="outlined" style={{ width: '50vh' }}>
      <InputLabel htmlFor="outlined-age-native-simple">{props.mainLabel}</InputLabel>
      <Select id={props.id} label={props.mainLabel} value={props.selected} onChange={handleChange}>
        {getCategories(props.value, 5)}
      </Select>
    </FormControl>
  );
};

export default SelectCategory;

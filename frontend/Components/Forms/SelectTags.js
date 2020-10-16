import { TextField, makeStyles } from "@material-ui/core";

import PostApi from "../ApiCalls/PostApi";

import { Autocomplete, createFilterOptions } from "@material-ui/lab";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const SelectTags = (props) => {
  const classes = useStyles();

  const handleSubmit = (newTag) => {
    PostApi("https://localhost:5001/api/tags", { name: newTag }, addTags);
    const newId = props.tags[props.tags.length - 1].id + 1;
    props.setTags([...props.tags, { id: newId, name: newTag }]);
    if (!props.selectedTags.includes(newId)) {
      props.onChange(props.selectedTags + newId + ", ");
    }
  };

  const handleChange = (value) => {
    if (!props.selectedTags.includes(value.id)) {
      props.onChange(props.selectedTags + value.id + ", ");
    }
  };

  const addTags = () => {
    console.log("added tags to 'https://localhost:5001/api/tags'");
  };

  return (
    <div style={{ display: "inline-block", width: "50vh" }}>
      <Autocomplete
        multiple
        onChange={(event, newValue) => {
          const lastAdded = newValue[newValue.length - 1];
          if (lastAdded.name.includes("Add")) {
            let newTag = lastAdded.name.split('"')[1];
            handleSubmit(newTag);
          } else {
            handleChange(lastAdded);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              id: props.tags[props.tags.length - 1].id + 1,
              name: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={props.tags}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(option) => option.name}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            placeholder=""
          />
        )}
      />
    </div>
  );
};

export default SelectTags;

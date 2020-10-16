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
    if (!props.tags[newTag.newTagId] || !props.newTags[newTag.newTagName]) {
      /* PostApi(
        "https://localhost:5001/api/tags",
        { name: newTag.newTagName },
        addTags
      ); */
      props.setNewTags([
        ...props.newTags,
        { id: newTag.newTagId, name: newTag.newTagName },
      ]);
      props.setTags([
        ...props.tags,
        { id: newTag.newTagId, name: newTag.newTagName },
      ]);
    }
  };

  const removeNewTag = (idList) => {
    props.newTags.map((tagObject) => {
      if (!idList.includes(tagObject.id) || !idList) {
        props.setNewTags(
          props.newTags.filter((tag) => tag.id !== tagObject.id)
        );
        props.setTags(props.tags.filter((tag) => tag.id !== tagObject.id));
      }
    });
  };

  const handleChange = (value) => {
    let tagId = "";
    value.map((tag) => {
      tagId += tag.id + ", ";
    });
    props.onChange(tagId);
    removeNewTag(tagId);
  };

  return (
    <div style={{ display: "inline-block", width: "50vh" }}>
      <Autocomplete
        multiple
        onChange={(event, newValue) => {
          const lastAdded =
            newValue.length >= 1 ? newValue[newValue.length - 1] : null;
          if (
            lastAdded?.inputValue &&
            !props.selectedTags.includes(lastAdded?.id)
          ) {
            handleSubmit({
              newTagId: lastAdded.id,
              newTagName: lastAdded.inputValue,
            });
          }
          handleChange(newValue);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              id: props.tags[props.tags.length - 1].id + 1,
              name: `Legg til "${params.inputValue}" som en ny tag`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={props.tags}
        getOptionLabel={(option) => {
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
            placeholder="Skriv for å søke"
          />
        )}
      />
    </div>
  );
};

export default SelectTags;

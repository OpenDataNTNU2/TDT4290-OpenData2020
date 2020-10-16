import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { useState } from "react";

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

  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    props.setCreateTag("");
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({ name: "" });

  const handleSubmit = (event) => {
    //event.preventDefault();
    PostApi(
      "https://localhost:5001/api/tags",
      { name: props.createTag },
      addTags
    );
    props.setTags([
      ...props.tags,
      { id: props.tags[props.tags.length - 1].id + 1, name: props.createTag },
    ]);
    props.setCreateTag("");
    handleClose();
  };

  const handleChange = (value) => {
    let tagId = "";
    value.map((tag) => {
      tagId += tag.id + ", ";
    });
    props.onChange(tagId);
  };

  const addTags = () => {
    console.log("added tags to 'https://localhost:5001/api/tags'");
  };

  return (
    <div style={{ display: "inline-block", width: "50vh" }}>
      <Autocomplete
        onChange={(event, value) => {
          if (typeof value === "string") {
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue(value);
            });
          } else if (value && value.inputValue) {
            toggleOpen(true);
            setDialogValue(value.inputValue);
          }
          handleChange(value);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        multiple
        id="tags-outlined"
        options={props.tags}
        getOptionLabel={(option) => option.name}
        defaultValue={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            placeholder=""
          />
        )}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Legg til en ny tag</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fant du ikke en passende tag? Legg til en ny!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setCreateTag({ ...dialogValue, name: event.target.value })
              }
              label="title"
              type="text"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default SelectTags;

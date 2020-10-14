import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  ListItemText,
  Button,
  TextField,
} from "@material-ui/core";

import PostApi from "../ApiCalls/PostApi";

import InputForm from "../Forms/Input";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectTags = (props) => {
  const classes = useStyles();

  // garra en bedre måte å legge til dette på...
  const handleChange = (event) => {
    props.setCheckedTags(event.target.value);
    let name = event.target.value;
    let newString = "";
    for (let i = 0; i < props.tags.length; i++) {
      for (let j = 0; j < name.length; j++) {
        if (name[j] === props.tags[i].name) {
          newString += props.tags[i].id.toString() + ", ";
        }
      }
    }
    props.onChange(newString);
  };

  const addTags = () => {
    console.log("added tags to 'https://localhost:5001/api/tags'");
  };

  const submitNewTag = (event) => {
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
  };

  return (
    <FormControl variant="outlined" style={{ width: "50vh" }}>
      <div style={{ display: "inline-block" }}>
        <Autocomplete
          multiple
          id="tags-outlined"
          options={tags}
          getOptionLabel={(option) => option.name}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              {...console.log(params)}
              variant="outlined"
              label="Tags"
              placeholder="Favorites"
              onChange={(e) => props.setCreateTag(e.target.value)}
            />
          )}
        />
      </div>

      {/* {props.tags.map((tag) => (
          <MenuItem key={tag.name} value={tag.name}>
            <Checkbox checked={props.checkedTags.indexOf(tag.name) > -1} />
            <ListItemText primary={tag.name} />
          </MenuItem>
        ))} */}
      {/* </Select> */}
    </FormControl>
  );
};

const tags = [
  {
    id: 100,
    name: "Culture",
  },
  {
    id: 101,
    name: "Bicycle",
  },
  {
    id: 102,
    name: "fstg",
  },
  {
    id: 103,
    name: "teater",
  },
  {
    id: 104,
    name: "førerkort",
  },
  {
    id: 105,
    name: "kjøretøy",
  },
  {
    id: 106,
    name: "bil",
  },
  {
    id: 107,
    name: "Arealplan",
  },
  {
    id: 108,
    name: "Arealformål",
  },
  {
    id: 109,
    name: "fellesDatakatalog",
  },
  {
    id: 110,
    name: "Kommune",
  },
  {
    id: 111,
    name: "Plandata",
  },
  {
    id: 112,
    name: "Planområde",
  },
  {
    id: 113,
    name: "Plan",
  },
  {
    id: 114,
    name: "Planregister",
  },
  {
    id: 115,
    name: "Kommuneplan",
  },
  {
    id: 116,
    name: "Norge digitalt",
  },
  {
    id: 117,
    name: "Norges fastland",
  },
  {
    id: 118,
    name: "Arealbruk",
  },
  {
    id: 119,
    name: "Kommunedelplan",
  },
  {
    id: 120,
    name: "Land use",
  },
  {
    id: 121,
    name: "regionale enheter",
  },
  {
    id: 122,
    name: "standard",
  },
  {
    id: 123,
    name: "kommunenummer",
  },
  {
    id: 124,
    name: "kommuner",
  },
  {
    id: 125,
    name: "kommunenummerliste",
  },
  {
    id: 126,
    name: "Kommuneinndeling",
  },
  {
    id: 127,
    name: "kommunekodeliste",
  },
  {
    id: 128,
    name: "Idrett",
  },
  {
    id: 129,
    name: "idrettslokaler",
  },
  {
    id: 130,
    name: "valg",
  },
  {
    id: 131,
    name: "kommunestyre",
  },
  {
    id: 132,
    name: "Budsjett",
  },
  {
    id: 133,
    name: "idrettsavdelingen",
  },
  {
    id: 134,
    name: "regnskapsresultat",
  },
  {
    id: 135,
    name: "Regnskap",
  },
  {
    id: 136,
    name: "2017",
  },
];

export default SelectTags;

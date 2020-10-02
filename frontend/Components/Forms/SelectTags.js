import { FormControl, InputLabel, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import InputForm from '../Forms/Input'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
    
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
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
    const [personName, setPersonName] = useState(props.tags);

 

    const [checked, setChecked] = useState([false, false, false])
    
    

   
    // garra en bedre måte å legge til dette på...
    const handleChange = (event) => {
        setPersonName(event.target.value)
        let name = event.target.value
        let newArr = []
        for(let i = 0; i < props.tags.length; i++){
            for(let j = 0; j < name.length; j++){
                if(name[j] === props.tags[i].name){
                    newArr.push(props.tags[i])
                }
            }
        }
        props.onChange(newArr)
    }

    return (  
        <FormControl variant="outlined" style={{width: "50vh"}}>
            <InputLabel htmlFor="outlined-age-native-simple">Tag</InputLabel>
            <Select
                labelId="demo-mutiple-checkbox-label"
                id="outlined-age-native-simple"
                multiple
                value={personName}
                onChange={handleChange}
                input={<Input />}
                renderValue={(selected) => (
                    <div className={classes.chips}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} className={classes.chip} />
                    ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                <div style={{display: "inline"}}>
                <InputForm 
                    id="outlined-basic"
                    label="Lag dine egne tags"
                    value={props.createTag}
                    handleChange={props.setCreateTag}
                    multiline={false}
                />
                <Button onClick={props.submitted(true)}>Legg til</Button>
                </div>
            {props.tags.map((tag) => (
                <MenuItem key={tag.name} value={tag.name}>
                    <Checkbox checked={personName.indexOf(tag.name) > -1} />
                    <ListItemText primary={tag.name} />
                </MenuItem>
            ))}
            </Select>
      </FormControl>
)
}

export default SelectTags;


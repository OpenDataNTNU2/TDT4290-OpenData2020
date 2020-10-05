import { FormControl, InputLabel, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'


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

   
    // garra en bedre måte å legge til dette på...
    const handleChange = (event) => {
        props.setPersonName(event.target.value)
        let name = event.target.value
        let newString = ""
        for(let i = 0; i < props.tags.length; i++){
            for(let j = 0; j < name.length; j++){
                if(name[j] === props.tags[i].name){
                    newString += (props.tags[i].id.toString() + ", ")
                    console.log(newString)
                }
            }
        }
        props.onChange(newString)
        
    }

    const submitNewTag = (event) => {
        
        props.addTags(props.createTag)
        props.setCreateTag("")
        
        
        
    }


    return (  
        <FormControl variant="outlined" style={{width: "50vh"}}>
            <InputLabel htmlFor="outlined-age-native-simple">Tags</InputLabel>
            <Select
                id="selectTags"
                multiple
                value={props.personName}
                onChange={handleChange}
                label="Tags"
                renderValue={(selected) => (
                    <div >
                    {selected.map((value, index) => (
                        <Chip key={value + index} label={value} className={classes.chip} />
                    ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                <div style={{display: "inline-block"}}>
                    <form noValidate autoComplete="off" style={{width: "32vh", display: "inline-block", margin: "0 1vh 0 1vh", padding: "0"}}>
                        <TextField 
                            id='tags' 
                            label="Egendefinerte tags"
                            size="medium" 
                            variant="outlined" 
                            fullWidth={true}
                            value={props.createTag} 
                            onChange={(e) => props.setCreateTag(e.target.value)}
                        />
                    </form>
                    <Button size="large" variant="contained" color="primary" onClick={submitNewTag} style={{marginTop: "3vh", height: "5.5vh"}}>Lag ny tag</Button>
                </div>

                
            {props.tags.map((tag) => (
                <MenuItem key={tag.name} value={tag.name}>
                    <Checkbox checked={props.personName.indexOf(tag.name) > -1} />
                    <ListItemText primary={tag.name} />
                </MenuItem>
            ))}
            </Select>
      </FormControl>
)
}

export default SelectTags;


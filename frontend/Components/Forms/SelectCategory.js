import { FormControl, InputLabel, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';

const SelectCategory = (props) => {
    
    const handleChange = (event) => {
        props.setSelectedCategory(event.target.value)
        console.log("test value: " + event.target.value)
    }

    const getCategories = (categories, margin) => {
        let result = [];
        categories.map(category => {
            result.push(
                <MenuItem style={{marginLeft: margin + "px"}}key={category.id} value={category.id}>
                    <ListItemText primary={category.name} />
                </MenuItem>)
            result.push.apply(result, getCategories(category.narrower, margin + 15))
        });
        return result;
    }
    return (  
        <FormControl variant="outlined" style={{width: "50vh"}}>
            <InputLabel htmlFor="outlined-age-native-simple">
                {props.mainLabel}
            </InputLabel>
            <Select
                id={props.id}
                label={props.mainLabel}
                value={props.selected}
                onChange={handleChange}
            >
                {getCategories(props.value, 5)}
                
            </Select>
        </FormControl>
)
}

export default SelectCategory;


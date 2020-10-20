import { FormControl, InputLabel, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const SelectInput = (props) => {
    
    const handleChange = (event) => {
        props.setSelectedCategory(event.target.value)
        console.log("test value: " + event.target.value)
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
                {props.value.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        <ListItemText primary={category.name} />
                    </MenuItem>
                ))}
                
            </Select>
        </FormControl>
)
}

export default SelectInput;


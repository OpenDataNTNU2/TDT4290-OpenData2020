import { FormControl, InputLabel, Select } from '@material-ui/core'


const SelectInput = (props) => {
    return (  
        <FormControl variant="outlined" style={{width: "50vh"}}>
            <InputLabel htmlFor="outlined-age-native-simple">
                {props.mainLabel}
            </InputLabel>
            <Select
                id={props.id}
                native
                label={props.mainLabel}
            >
                <option aria-label="None" value="" />
                {Array.from(Array(props.value.length), (e,i) => {
                    return <option value={props.value[i]} key={props.value[i].toString()}>{props.label[i]}</option>
            })}
            </Select>
        </FormControl>
)
}

export default SelectInput;


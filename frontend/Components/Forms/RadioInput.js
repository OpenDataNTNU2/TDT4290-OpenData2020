import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'


const RadioInput = (props) => {
    return (  
        <RadioGroup value={props.mainValue} onChange={(e) => props.handleChange(e.target.value)}>
            {Array.from(Array(props.value.length), (e,i) => {
                return <FormControlLabel 
                            id={props.id + i.toString()}
                            key={props.id + i.toString()}
                            value={props.value[i]}
                            control={<Radio />}
                            label={props.label[i]}
                        />
            })}
        </RadioGroup>
)
}

export default RadioInput;


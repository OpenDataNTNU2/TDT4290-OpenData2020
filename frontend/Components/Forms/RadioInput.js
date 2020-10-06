import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core/styles';
import { green, orange, red } from '@material-ui/core/colors';



const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />)

  const YellowRadio = withStyles({
    root: {
      color: orange[400],
      '&$checked': {
        color: orange[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />)

  const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />)

const RadioInput = (props) => {
    return (  
        <RadioGroup value={props.mainValue} onChange={(e) => props.handleChange(e.target.value)}>
            {Array.from(Array(props.value.length), (e,i) => {
                return <FormControlLabel 
                            id={props.id + i.toString()}
                            key={props.id + i.toString()}
                            value={props.value[i]}
                            control={
                                props.color[i] === "green" 
                                ? <GreenRadio /> 
                                : props.color[i] === "red" 
                                ? <RedRadio /> 
                                : props.color[i] === "yellow" 
                                ? <YellowRadio /> 
                                : <Radio />}
                            label={props.label[i]}
                        />
            })}
        </RadioGroup>
)
}

export default RadioInput;


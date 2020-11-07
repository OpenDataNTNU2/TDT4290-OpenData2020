import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { green, grey, orange, red, blue } from '@material-ui/core/colors';

const GreenRadio = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: green[400],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const YellowRadio = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: orange[600],
    },
  },
  checked: {},
})((props) => <Radio color="primary" {...props} />);

const RedRadio = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: red[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const DefaultRadio = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: blue[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const RadioInput = (props) => {
  return (
    <RadioGroup
      value={props.mainValue}
      onChange={(e) => props.handleChange(e.target.value)}
      style={{ margin: '12px 0 0 12px' }}
    >
      {Array.from(Array(props.value.length), (e, i) => {
        return (
          <FormControlLabel
            id={props.id + i.toString()}
            key={props.id + i.toString()}
            value={props.value[i]}
            control={
              props.color[i] === 'green' ? (
                <GreenRadio />
              ) : props.color[i] === 'red' ? (
                <RedRadio />
              ) : props.color[i] === 'yellow' ? (
                <YellowRadio />
              ) : (
                <DefaultRadio />
              )
            }
            label={props.label[i]}
          />
        );
      })}
    </RadioGroup>
  );
};

export default RadioInput;

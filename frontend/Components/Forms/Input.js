import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const Input = (props) => {
    return (
        <FormControl variant="outlined" style={{ width: '50vh' }}>
            <TextField
                id={props.id}
                multiline={props.multiline}
                rows={4}
                label={props.label}
                size="medium"
                variant="outlined"
                fullWidth
                value={props.value}
                onChange={(e) => props.handleChange(e.target.value)}
            />
        </FormControl>
    );
};

export default Input;

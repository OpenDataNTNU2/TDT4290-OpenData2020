import TextField from '@material-ui/core/TextField'


const Input = (props) => {
    return (  
        <form noValidate autoComplete="off" style={{width: "50vh"}}>
            <TextField 
                id={props.id}
                multiline={props.multiline}
                rows={4} 
                label={props.label}
                size="large" 
                variant="outlined" 
                fullWidth={true} 
                value={props.value} 
                onChange={(e) => props.handleChange(e.target.value)}
            />
        </form>
)
}

export default Input;
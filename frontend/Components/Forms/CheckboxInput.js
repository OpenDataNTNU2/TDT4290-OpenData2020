
import { Checkbox, FormControlLabel } from '@material-ui/core';

import { useState } from 'react'

const CheckboxInput = (props) => {

    const handleChange = (event) => {
        props.handleChange(event)
    }

    return (
        <FormControlLabel key={props.id} control={<Checkbox value={props.id} onClick={handleChange} name={props.name} />}
            label={props.name} />
    )
}

export default CheckboxInput;
import { FormControl, TextField } from '@material-ui/core';

import _ from 'lodash';

export default function Search(props){


    // en feil med denne akkurat nå, søker man etter Oslo, får den kun opp Osl, og tar man alt vekk vil O stå igjen.
    // altså, den henger ett trykk etter hele tiden... skjønner ikke helt hvorfor :'( Tipper det er pga useState bruker litt lang tid

    // _debounce (_ kommer fra import 'lodash') gjør slik at den kjører et søk til databasen fra props.getDatasets som befinner seg i index.js hvert 500 millisekund
    // dette gjør at vi ikke trenger å trykke søk eller lignende, som er nice

    // props.getDatasets(1, true); 1 = that the page in the fetch should be 1, true = that search has been changed
    const onChange = ({ target: { value } }) => {
        props.setSearchUrl(value)
        const search = _.debounce(() => props.getDatasets(1, true), 500);
        search(value);
      };



    return(
        <div style={{ marginBottom: '2em'}}>
            <FormControl variant="outlined" style={{minWidth: "50vh"}} >
                <TextField 
                    id="searchbar"
                    multiline={false}
                    rows={4} 
                    label="Søk etter innhold"
                    size="medium" 
                    variant="outlined" 
                    fullWidth={true} 
                    value={props.searchUrl} 
                    onChange={onChange}
                    
                />
        </FormControl>
        </div>
    )
}

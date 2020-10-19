import { FormControl, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '6px 15px',
        display: 'flex',
        alignItems: 'center',
        minWidth: '400px',
        margin: '0px 15px 25px 0px'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    iconButton: {
        padding: 6
    }
}));


export default function Search(props){

    const classes = useStyles();
    // en feil med denne akkurat nå, søker man etter Oslo, får den kun opp Osl, og tar man alt vekk vil O stå igjen.
    // altså, den henger ett trykk etter hele tiden... skjønner ikke helt hvorfor :'( Tipper det er pga useState bruker litt lang tid

    // _debounce (_ kommer fra import 'lodash') gjør slik at den kjører et søk til databasen fra props.getDatasets som befinner seg i index.js hvert 500 millisekund
    // dette gjør at vi ikke trenger å trykke søk eller lignende, som er nice

    // props.getDatasets(1, true); 1 = that the page in the fetch should be 1, true = that search has been changed
    const onChange = ({ target: { value } }) => {
        props.setSearchUrl(value)
        const search = _.debounce(() => props.getDatasets(1, true, value), 500);
        search(value);
      };



    return(
        <div style={{ marginBottom: '2em'}}>
        <Paper className={classes.root}>
            <InputBase
                id="searchbar"
                multiline={false}
                rows={4} 
                placeholder="Søk etter innhold..."
                size="medium" 
                variant="outlined" 
                fullWidth={true} 
                value={props.searchUrl} 
                onChange={onChange}
                style={{backgroundColor: "white"}}
            />
            <IconButton className={classes.iconButton} aria-label="search" id="SearchButton">
                <SearchIcon />
            </IconButton>
        </Paper>
        </div>
    )
}

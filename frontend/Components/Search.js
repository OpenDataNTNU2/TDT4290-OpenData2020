import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '6px 15px',
        display: 'flex',
        alignItems: 'center',
        minWidth: '400px',
        margin: '0px 15px 25px 0px',
        flexDirection: 'row',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 6,
    },
}));

export default function Search(props) {
    const [query, setQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState({});
    const classes = useStyles();

    console.log(searchQuery);

    const sendQuery = async (value) => {
        const cancelPrevQuery = await props.getDatasets(1, true, value);
        return cancelPrevQuery;
    };

    // denne funksjonen benytter seg av _debounce som starter en timer på 500 millisekunder når man begynner å søke, hvis søket endrer seg innen de 500 ms er ferdig,
    // vil den starte de 500 ms på nytt. Hvis tiden er over 500 (tastatur idle i 500 eller mer), søker den på det som står skrevet.
    const onChange = ({ target: { value } }) => {
        setQuery(value);

        const search = _.debounce(sendQuery, 500);

        setSearchQuery((prevSearch) => {
            if (prevSearch.cancel) {
                prevSearch.cancel();
            }
            return search;
        });

        search(value);
    };

    return (
        <div style={{ marginBottom: '2em' }}>
            <Paper className={classes.root}>
                <InputBase
                    id="searchbar"
                    multiline={false}
                    rows={4}
                    placeholder="Søk etter innhold..."
                    size="medium"
                    variant="outlined"
                    fullWidth
                    value={query}
                    onChange={onChange}
                    style={{ backgroundColor: 'white' }}
                />
                <IconButton className={classes.iconButton} aria-label="search" id="SearchButton">
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    );
}

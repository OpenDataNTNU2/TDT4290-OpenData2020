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

  /**
   * runs the fetch with props.getDatasets with the search value
   * @param {string} value - search text
   */
  const sendQuery = async (value) => {
    const cancelPrevQuery = await props.getDatasets(value);
    return cancelPrevQuery;
  };

  /**
   * This function uses _debounce with 500 ms.
   * If a new request is sent before the previous request have completed,
   * it will cancel the previous request and send a new one with the updated seach text.
   * @param {*} value - search text 
   */
  const onChange = ({ target: { value } }) => {
    setQuery(value);

    const search = _.debounce(sendQuery, 500);
    // La stå! Blir brukt til å cancle precious søke requests.
    setSearchQuery((prevSearch) => {
      if (prevSearch.cancel) {
        prevSearch.cancel();
      }
      return search;
    });
    console.log(searchQuery);
    search(value);
  };

  return (
    <div>
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

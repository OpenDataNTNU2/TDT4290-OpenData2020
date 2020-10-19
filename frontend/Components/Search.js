import { FormControl, TextField } from '@material-ui/core';
import { useState } from 'react'
import _ from 'lodash';

export default function Search(props) {

    const [query, setQuery] = useState('')
    const [searchQuery, setSearchQuery] = useState({});

    // props.getDatasets(1, true); 1 = that the page in the fetch should be 1, true = that search has been changed

    // denne funksjonen benytter seg av _debounce som starter en timer på 500 millisekunder når man begynner å søke, hvis søket endrer seg innen de 500 ms er ferdig,
    // vil den starte de 500 ms på nytt. Hvis tiden er over 500 (tastatur idle i 500 eller mer), søker den på det som står skrevet.
    const onChange = ({ target: { value } }) => {
        setQuery(value)

        const search = _.debounce(sendQuery, 500);

        setSearchQuery(prevSearch => {
            if (prevSearch.cancel) {
                prevSearch.cancel();
            }
            return search;
        });

        search(value);

    };

    const sendQuery = async value => {
        const cancelPrevQuery = await props.getDatasets(1, true, value)
    }

    return (
        <div style={{ marginBottom: '2em' }}>
            <FormControl variant="outlined" style={{ minWidth: "50vh" }} >
                <TextField
                    id="searchbar"
                    multiline={false}
                    rows={4}
                    label="Søk etter innhold"
                    size="medium"
                    variant="outlined"
                    fullWidth={true}
                    value={query}
                    onChange={onChange}

                />
            </FormControl>
        </div>
    )
}

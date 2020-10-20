import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import GetApi from '../ApiCalls/GetApi';

import styles from '../../styles/Filters.module.css';

export default function FilterPublisher(props) {
    const [addedFilters, setAddedFilters] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [showItems, setShowItems] = useState(5);

    const [res, setRes] = useState({});

    const handleChange = (event) => {
        props.setChanged(true);
        const newArr = addedFilters;
        newArr.push(event.target.value);
        for (let i = 0; i < newArr.length - 1; i += 1) {
            if (newArr[i] === event.target.value) {
                newArr.pop();
                newArr.splice(i, 1);
            }
        }
        setAddedFilters(newArr);
        let newUrlString = '';
        for (let i = 0; i < newArr.length; i += 1) {
            newUrlString += `${newArr[i]},`;
        }
        props.setUrl(newUrlString);
    };

    useEffect(() => {
        GetApi('https://localhost:5001/api/publishers', setRes);

        const pubs = mapResponseToPublishers(res, props.isDataset);

        setPublishers(pubs);
        if (res.length < 5) {
            setShowItems(res.length);
        }
    }, [props]);

    const items = publishers
        .slice(0, showItems)
        .map((pub) => (
            <FormControlLabel
                key={pub[1]}
                control={<Checkbox value={pub[1]} onChange={handleChange} name={pub[0]} />}
                label={`${pub[0]} (${pub[4]})`}
            />
        ));

    return (
        <div className={styles.filterContainer}>
            <FormControl>
                <h4 className={styles.filterTitle}>Kommune</h4>
                <FormGroup className={styles.checkboxesContainer}>
                    <br />
                    {items}
                    {showItems === 5 ? (
                        <ExpandMoreIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowItems(publishers.length)}
                            fontSize="large"
                        />
                    ) : publishers.length > 5 ? (
                        <ExpandLessIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowItems(5)}
                            fontSize="large"
                        />
                    ) : null}
                </FormGroup>
            </FormControl>
        </div>
    );
}

export function mapResponseToPublishers(res, isDataset) {
    // extracted from line 39 in useEffect
    // this is a transformation of data from the server, and can be unit tested
    // ideally, all transformations are extracted into functions, so they can be tested
    const pubs = [];
    for (let i = 0; i < res.length; i += 1) {
        const length = isDataset ? res[i].datasets.length : res[i].coordinations.length;
        length > 0 ? pubs.push([res[i].name.split(' ')[0], res[i].id, false, i, length]) : null; // are the 'false' and 'i' properties used anywhere?
    }
    return pubs;
}

import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import React, { useState } from 'react';

import styles from '../../styles/Filters.module.css';

export default function FilterAccess(props) {

    const [addedAccessFilters, setAddedAccessFilters] = useState([]);
    const [addedPulishStatusFilters, setAddedPulishStatusFilters] = useState([]);

    const handleChangeAccess = (event) => {
        const newArr = addedAccessFilters;
        newArr.push(event.target.value);
        for (let i = 0; i < newArr.length - 1; i += 1) {
            if (newArr[i] === event.target.value) {
                newArr.pop();
                newArr.splice(i, 1);
            }
        }
        setAddedAccessFilters(newArr);

        let newUrlString = '';
        for (let i = 0; i < newArr.length; i += 1) {
            newUrlString += `${newArr[i]},`;
        }
        props.setFilterAccessLevel(newUrlString);
    };

    const handleChangePublished = (event) => {
        const newArr = addedPulishStatusFilters;
        newArr.push(event.target.value);
        for (let i = 0; i < newArr.length - 1; i += 1) {
            if (newArr[i] === event.target.value) {
                newArr.pop();
                newArr.splice(i, 1);
            }
        }
        setAddedPulishStatusFilters(newArr);

        let newUrlString = '';
        for (let i = 0; i < newArr.length; i += 1) {
            newUrlString += `${newArr[i]},`;
        }
        props.setFilterPublishStatus(newUrlString);
    };

    return (
        <div className={styles.filterContainer}>
            <FormControl>
                <h4 className={styles.filterTitle}>Tilgjengelighet</h4>
                <FormGroup className={styles.checkboxesContainer}>
                    <br />
                    <FormControlLabel
                        key={'Kan deles offentlig'}
                        control={<Checkbox value={'1'} onChange={handleChangeAccess} name={'Kan deles offentlig'} />}
                        label={'Kan deles offentlig'}
                    />
                    <FormControlLabel
                        key={'Begrenset offentlighet'}
                        control={<Checkbox value={'2'} onChange={handleChangeAccess} name={'Begrenset offentlighet'} />}
                        label={'Begrenset offentlighet'}
                    />
                    <FormControlLabel
                        key={'Unntatt offentlighet'}
                        control={<Checkbox value={'3'} onChange={handleChangeAccess} name={'Unntatt offentlighet'} />}
                        label={'Unntatt offentlighet'}
                    />
                    <br />
                    <FormControlLabel
                        key={'Publisert'}
                        control={<Checkbox value={'1'} onChange={handleChangePublished} name={'Publisert'} />}
                        label={'Publisert'}
                    />
                    <FormControlLabel
                        key={'Publisering planlagt'}
                        control={<Checkbox value={'2'} onChange={handleChangePublished} name={'Publisering planlagt'} />}
                        label={'Publisering planlagt'}
                    />
                    <FormControlLabel
                        key={'Ikke publisert'}
                        control={<Checkbox value={'3'} onChange={handleChangePublished} name={'Ikke publisert'} />}
                        label={'Ikke publisert'}
                    />

                </FormGroup>
            </FormControl>
        </div>
    );
}

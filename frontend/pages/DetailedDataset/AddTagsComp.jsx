import React, { useState, useEffect } from 'react';
import { Button, Divider, Grid, FormControl, FormLabel } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

import RadioInput from '../../Components/Forms/RadioInput'

import SelectCategory from '../../Components/Forms/SelectCategory'
import Distribution from '../../Components/Forms/Distribution'

import SelectTags from '../../Components/Forms/SelectTags'

import GetApi from '../../Components/ApiCalls/GetApi'
import PostApi from '../../Components/ApiCalls/PostApi'

const AddTagsComp = (props) => {

    const [editBool, setEditBool] = useState(false)
    const [editText, setEditText] = useState(props.value)

    // variables/states for tags
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState('');
    const [newTags, setNewTags] = useState([]);


    useEffect(() => {
        GetApi('https://localhost:5001/api/tags', setTags)

    }, [props])

    const submitTags = () => {
        console.log(selectedTags)
        if (newTags.length !== 0) { addNewTags() }
        props.updateDataset(selectedTags, props.path)
        setEditBool(false)
    }

    const addNewTags = () => {
        newTags.map((tag) => PostApi('https://localhost:5001/api/tags', { name: tag.name }, postTagsInfo));
    };

    const postTagsInfo = () => {
        console.log("added new tags")
    };

    return (
        props.canEdit ?
            editBool ?
                <div>
                    <SelectTags
                        mainLabel="Tags"
                        tags={tags}
                        setTags={setTags}
                        onChange={setSelectedTags}
                        selectedTags={selectedTags}
                        newTags={newTags}
                        setNewTags={setNewTags}
                    />
                    <Button variant="contained" color="primary" onClick={submitTags}>Oppdater søkeord</Button>

                </div>

                : <p className={props.styles}>
                    <span>Søkeord: </span>
                    {editText.map((tag) => tag && `${tag.tags.name}, `)}{' '}
                    {editText.length === 0 ? 'Ingen søkeord lagt til' : null}
                    <EditIcon fontSize="small" onClick={() => setEditBool(true)} />
                </p>
            : <p className={props.styles}>
                <span>Søkeord: </span>
                {editText.map((tag) => tag && `${tag.tags.name}, `)}{' '}
                {editText.length === 0 ? 'Ingen søkeord lagt til' : null}

            </p>
    );
};

export default AddTagsComp;



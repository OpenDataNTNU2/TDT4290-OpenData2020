import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import GetApi from '../ApiCalls/GetApi'

export default function FilterPublisher(props) {

    const [addedFilters, setAddedFilters] = useState([])
    const [publishers, setPublishers] = useState([])
    const [showItems, setShowItems] = useState(5)

    const [res, setRes] = useState({})

    const handleChange = (event) => {
        props.setChanged(true)
        let newArr = addedFilters
        newArr.push(event.target.value) // adds publisher id to the end of addedFilters
        for (let i = 0; i < newArr.length - 1; i++) { // checks all addedFilters except the newest one
            if (newArr[i] === event.target.value) { newArr.pop(); newArr.splice(i, 1) } // if a previous addedFilter has the same id, remove it and undo the newly added one
        }  
        setAddedFilters(newArr)
        let newUrlString = ""
        for (let i = 0; i < newArr.length; i++) {
            newUrlString += newArr[i] + ','
        }
        props.setUrl(newUrlString)


    };



    useEffect(() => {
        GetApi('https://localhost:5001/api/publishers', setRes)

        const pub = mapResponseToPublishers(res)

        setPublishers(pub)
        if (res.length < 5) { setShowItems(res.length) }
    }, [props])

    const items = publishers.slice(0, showItems).map(pub =>
        <FormControlLabel control={<Checkbox value={pub.id} onChange={handleChange} name={pub.name} />}
            label={pub.name + " (" + pub.numDatasets + ")"}
        />)


    return (
        <div>
            <FormControl>
                <FormLabel>Kommune</FormLabel>
                <FormGroup >
                    <br />
                    {items}
                    {showItems === 5
                        ? <ExpandMoreIcon style={{ cursor: 'pointer' }} onClick={() => setShowItems(publishers.length)} fontSize="large" />
                        : publishers.length > 5
                            ? <ExpandLessIcon style={{ cursor: 'pointer' }} onClick={() => setShowItems(5)} fontSize="large" />
                            : null
                    }

                </FormGroup>
            </FormControl>
        </div>
    )
}

export function mapResponseToPublishers(res) { // extracted from line 40 in useEffect
    // this is a transformation of data from the server, and can be unit tested
    // ideally, all transformations are extracted into functions, so they can be tested
    return res.map(entry => ({ // for each entry in the response, make an object
        name: entry.name.split(" ")[0],
        id: entry.id,
        numDatasets: entry.datasets.length,
    }))
}

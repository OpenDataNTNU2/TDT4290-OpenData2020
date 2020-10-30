import React, { useState, useEffect } from 'react';
import { Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Input from '../../Components/Forms/Input';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';

const RequestMunicipalityComp = (props) => {
    const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

    const [reason, setReason] = useState('')
    const [missingPublishers, setMissingPublisers] = useState([])
    const [selectedPublisher, setSelectedPublisher] = useState('')

    useEffect(() => {
        GetApi(`${host}/api/publishers`, findMissingPublishers)
    }, [props])

    function findMissingPublishers(response) {
        let newArr = [];
        for (let i = 0; i < response.length; i++) {
            newArr.push(response[i])
            for (let j = 0; j < props.coordination.datasets.length; j++) {
                if (newArr[newArr.length - 1].id === props.coordination.datasets[j].publisher.id) {
                    newArr.pop()
                    break;
                }
            }
        }
        setMissingPublisers(newArr)
    }

    function sendRequest() {
        const d = {
            reason: reason,
            coordinationId: props.coordination.id,
            publisherId: selectedPublisher,
        };
        PostApi(`${host}/api/applications`, d, successfullySentRequest);
    }
    const successfullySentRequest = () => {
        console.log('Successfully sent request to publisher id' + selectedPublisher + ' about joining the coordination ' + props.coordination.title)
    }

    return (
        <div style={{ margin: '25px 0' }}>
            <Divider variant="fullWidth" />
            <br />
            <h1 style={{ fontWeight: 'normal' }}>Foreslå samordning til en kommune</h1>
            <p>
                Foreslå til en kommune å bli med i samordningen.
      </p>
            {missingPublishers.length !== 0 ? (
                <FormControl variant="outlined" style={{ width: '50vh' }}>
                    <InputLabel id="requestToPublisherInputLabelId">Velg kommune</InputLabel>
                    <Select
                        labelId="requestToPublisherLabelId"
                        label="Velg kommune"
                        id="requestToPublisherId"
                        value={selectedPublisher}
                        onChange={(event) => setSelectedPublisher(event.target.value)}
                    >
                        {Object.values(missingPublishers).map(
                            (publisher) => (
                                <MenuItem value={publisher.id} key={publisher.id}>
                                    {publisher.name}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>
            ) : null}
            <br /><br />
            <Input
                id="reasonId"
                multiline={true}
                label="Hvorfor vil du at denne kommunen skal bli med i samordningen?"
                value={reason}
                handleChange={setReason}
            />
            <br />
            <br />

            <Button
                variant="contained"
                color="primary"
                disabled={false}
                onClick={sendRequest}
            >
                Send forslag
      </Button>
        </div>
    )
};

export default RequestMunicipalityComp;

import { Paper, Grid, Button } from '@material-ui/core';
import RequestButtonComp from './RequestButtonComp';
import { useState } from "react";
import {PageRender} from '../api/serverSideProps'

// import api functions
import PutApi from '../../Components/ApiCalls/PutApi'

export default function DetailedDataset({data, uri}){
  
  const [interestCounter, setInterestCounter] = useState(data.interestCounter);
  
  var requestButton;
  var publishedStatus;

  const ifPublished = (pub) => {
    if (pub === "Published"){
      requestButton = null;
      publishedStatus = "Published";
    }
    else {
      requestButton = <RequestButtonComp handleClick={() => handleChange()}/>;
      publishedStatus = "Not published";
    }
  }

    // puts data into the api with datasets 
    const handleChange = async () => {
        setInterestCounter(interestCounter + 1);

        //publicationStatus er 0 uansett hvis denne knappen kan trykkes på.
        //litt usikker på hva detailedPublicationStatus skal stå på hehe. Kan hende vi må mappe over siden den ligger under distributions.
        const data2 = {
          "interestCounter" : interestCounter,
          "identifier" : data.identifier,
          "title": data.title,
          "description": data.description,
          "publisherId": data.publisher.id,
          "publicationStatus": 1,
          "detailedPublicationStatus": 0,
          "categoryId": data.category.id,
        }
        
        PutApi(uri, data2);
        console.log('Requests er oppdatert!');
    }
  

    return(
        <Grid
            container
            direction="column"
            style={{ minHeight: '70vh', minWidth: '90vh', padding: '5%', border: '2%'}}
        >
            <Grid
            container
            spacing={0}
            direction="row"
            justify="space-between"
            alignItems="center"
            >
                <h1 style={{fontWeight: "bold", }}><p>{data.title}</p></h1>
                <p style={{paddingRight: '5%'}}><b>Oppdatert: <i>{'Placeholder'}</i></b></p>
            </Grid>
            
            <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '1%' , paddingBottom:'4%'}}>
              <Grid
              container
              spacing={0}
              direction="row"
              justify="space-between"
              >
                <p><b>Beskrivelse: </b>{data.description}</p>
                {ifPublished(data.publicationStatus)}{requestButton}
              </Grid>
            
              <p><b>Eier:</b> {data.publisher.name}</p>
              <p><b>Type:</b>  {data.distributions.map(distributions => { return (distributions.fileFormat) })} </p>
              <p><b>Publiseringsstatus: </b><i>{ifPublished(data.publicationStatus)}{publishedStatus}</i></p>
              <p><b>Dato publisert: </b> <i>{'Placeholder'}</i></p>
              <p><b>Link til datasett: </b> {data.distributions.map(distributions => { return (<a href={distributions.uri}> {distributions.uri} </a> )})} </p>
              
            
            </Paper>
            </Grid>

    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("ID", context)
    return propsData
  }

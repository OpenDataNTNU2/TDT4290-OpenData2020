import { Paper, Grid, Button } from '@material-ui/core';
import RequestButtonComp from './RequestButtonComp';
import { useState } from "react";

// import api functions
import PutApi from '../../Components/ApiCalls/PutApi'

export default function DetailedDataset({data, uri}){
  
  const [interestCounter, setInterestCounter] = useState(data.interestCounter);
  
  var requestButton;
  var publishedStatus;
  
  //const onClick = () => {console.log('Requests er oppdatert!'), interestCounterNumber+=1}

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
  // data sent to PutApi when updating interestCounter
  /*const interestData = {
          "interestCounter": interestCounter
          //evt parseInt(interestCounter)
  }*/

    // puts data into the api with datasets 
    const handleChange = async () => {
        setInterestCounter(interestCounter + 1);
        console.log('Requests er oppdatert!');
        // Hvis noe må gjøres annerledes, så kan det være at vi under her sender data og jeg ikke vet om data
        // har fått det nye tallet på interestCounter ennå!
        //const url = 'https://localhost:5001/api/datasets' + context.params.id;
        PutApi(uri, data);
    }
  

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="left"
            style={{ minHeight: '70vh', minWidth: '90vh', padding: '5%', border: '2%'}}
        >
            <Grid
            container
            spacing={0}
            direction="row"
            justify="space-between"
            alignItems="center">
                <h1 style={{fontWeight: "bold", }}><p>{data.title}</p></h1>
                <p style={{paddingRight: '5%'}}><b>Oppdatert: <i>{'Placeholder'}</i></b></p>
            </Grid>
            
            <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '1%' , paddingBottom:'4%'}}>
              <Grid
              container
              spacing={0}
              direction="row"
              justify="space-between"
              alignItems="center">
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
    // Fetch data from external API
    // Should be changed to host link when this is done, not localhost.
    const uri = 'https://localhost:5001/api/datasets/' + context.params.id;
    const res = await fetch(uri, createRequestOptions(true))
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data, uri } }
  }

// ALERT: This ships HTTPS validation and should not be used when we are handling personal information and authentication etc.
function createRequestOptions(skipHttpsValidation) {
    const isNode = typeof window === 'undefined';
    if (isNode) {
      var Agent = (require('https')).Agent;
      return {
        agent: new Agent({ rejectUnauthorized: !skipHttpsValidation })
      };
    }
  }

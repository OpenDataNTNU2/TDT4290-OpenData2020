import { Paper, Grid } from '@material-ui/core';
import RequestButtonComp from './RequestButtonComp';
import { useState } from "react";
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
// import api functions
import PutApi from '../../Components/ApiCalls/PutApi'

export default function DetailedDataset({data, uri}){
  
  const [interestCounter, setInterestCounter] = useState(parseInt(data.interestCounter));
  const [disabled, setDisabled] = useState(false);
  // show/hide snackbar with successfull put message
  const [open, setOpen] = useState(false)

  var requestButton;
  var publishedStatus;

  const ifPublished = (pub) => {
    if (pub === "Published"){
      requestButton = null;
      publishedStatus = "Published";
    }
    else {
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={disabled} />;
      publishedStatus = "Not published";
    }
  }

    // puts data into the api with datasets 
    const handleChange = async () => {
      // setInterestCounter brukes ikke i praksis, oppdaterer manuelt når jeg sender data i put.
      setInterestCounter(parseInt(interestCounter) + 1);
      setDisabled(!disabled); 
      setOpen(true);
      updateData();
      
    }
    const updateData = async () => {
      
      // publicationStatus er 0 uansett hvis denne knappen kan trykkes på.
      // litt usikker på hva detailedPublicationStatus skal stå på hehe. Kan hende vi må mappe over siden den ligger under distributions.
      const data2 = {
        "interestCounter" : interestCounter+1,
        "identifier" : data.identifier,
        "title": data.title,
        "description": data.description,
        "publisherId": data.publisher.id,
        "publicationStatus": 1,
        "detailedPublicationStatus": 0,
        "categoryId": data.category.id,
      }
      /*console.log("Interest counter FØR setInterestCounter: "+ interestCounter);
      setInterestCounter(interestCounter + 1);*/
      console.log("Interest counter er nå: "+ data2.interestCounter);
      setOpen(true);
      PutApi(uri, data2);
      console.log('Requests er oppdatert!');
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
              item xs={12} 
              direction="row"
              justify="space-between"
              alignItems="center">
                <span><b>Beskrivelse: </b>{data.description}</span>
                <span>{ifPublished(data.publicationStatus)} {requestButton}</span>
                <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert elevation={1} severity="info">Interesse for datasett registrert</Alert>
                </Snackbar>
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

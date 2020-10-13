import { Paper, Grid, Snackbar } from '@material-ui/core';
import RequestButtonComp from './RequestButtonComp';
import DistributionCard from './DistributionCard';
import { useState } from "react";

import Alert from '@material-ui/lab/Alert';

import {PageRender} from '../api/serverSideProps'
import PutApi from '../../Components/ApiCalls/PutApi'

export default function DetailedDataset({data, uri}){
  
  const [interestCounter, setInterestCounter] = useState(parseInt(data.interestCounter));
  const [disabled, setDisabled] = useState(false);
  // show/hide snackbar with successfull put message
  const [open, setOpen] = useState(false)

  var requestButton;
  var publishedStatus;
  const distributionCards = [];

  const ifPublished = (pub) => {
    if (pub === "Published"){
      requestButton = null;
      publishedStatus = "Publisert";
      //console.log(data.distributions[0])
      //console.log(data.distributions[1])
      
      for(let i = 0; i < data.distributions.length; i++){
        // Per nå settes bare alle kortene til det siste kortet. 
        distributionCards.push = <DistributionCard 
        id = {data.distributions[i].id}
        fileFormat = {data.distributions[i].fileFormat}
        uri = {data.distributions[i].uri} />           
      }
      console.log(distributionCards.map(cards => ({cards})))
    }
    else {
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={disabled} />;
      publishedStatus = "Ikke publisert";
      distributionCard = "Dette datasettet har ingen distribusjoner ennå."
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
        direction = "column"
        justify = "space-evenly"
        spacing={2}
        >
            <Grid
              container
              direction="column"
              alignItems="stretch"
              style={{ minHeight: '70vh', minWidth: '90vh', padding: '3%', border: '2%'}}
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
              
              <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '1%' , paddingBottom:'1%'}}>
                
                <Grid
                container
                item xs={12} 
                direction="row"
                justify="space-between"
                alignItems="baseline"
              >
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
                <p><b>Link til datasett: </b> {data.distributions.map(distributions => { return (<a key={distributions.id} href={distributions.uri}> {distributions.uri} </a> )})} </p>
              
              </Paper>
            </Grid>
            <Grid 
              container
              direction="column"
              alignItems="stretch"
              style={{ minHeight: '70vh', minWidth: '90vh', padding: '3%', border: '2%'}}
              >
              <h3 style={{fontWeight: "bold", }}><p>Distribusjoner</p></h3>
              <p>{ifPublished(data.publicationStatus)}{distributionCards.map(cards => ({cards}))}</p>
              
            </Grid>
          </Grid>
    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("ID", context)
    return propsData
  }
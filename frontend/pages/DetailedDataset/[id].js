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
  var cardOrNoCard;

  const ifPublished = (pub) => {
    if (pub === "Published"){
      requestButton = null;
      publishedStatus = "Publisert";
      
      for(let i = 0; i < data.distributions.length; i++){
        distributionCards.push(data.distributions[i]);
      }
      cardOrNoCard = Object.values(distributionCards).map(dist => { return (<a key={dist.id}> <DistributionCard id={dist.id} fileFormat={dist.fileFormat} uri={dist.uri} /> </a>)});
      console.log("Antall elementer i distributions er " + data.distributions.length)
    }
    else {
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={disabled} />;
      console.log("kommer vi oss hit mon tro")
      publishedStatus = "Ikke publisert";
      cardOrNoCard = "Dette datasettet har ingen distribusjoner ennå.";
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
                direction="row"
                justify="space-between"
                alignItems="baseline">
                  <p><b>Beskrivelse: </b>{data.description}</p>
                  <span>{ifPublished(data.publicationStatus)}{requestButton}</span>
                  <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                  <Alert elevation={1} severity="info">Interesse for datasett registrert</Alert>
                  </Snackbar>

                </Grid>
              
                <p><b>Eier:</b> {data.publisher.name}</p>
                <p><b>Publiseringsstatus: </b><i>{publishedStatus}</i></p>
                <p><b>Dato publisert: </b> <i>{'Placeholder'}</i></p>
                <p><b>Kategori: </b> {data.category.name}</p>
              
              </Paper>
            </Grid>
            <Grid 
              container
              item xs={5}
              direction="column"
              alignItems="stretch"
              style={{ minHeight: '70vh', minWidth: '90vh', padding: '3%', border: '2%'}}
              >
              <h3 style={{fontWeight: "bold", }}><p>Distribusjoner</p></h3>
              <span>{cardOrNoCard}</span>
            </Grid>
          </Grid>
    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("ID", context)
    return propsData
  }
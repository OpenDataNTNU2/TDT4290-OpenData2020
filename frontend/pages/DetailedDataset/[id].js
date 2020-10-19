import { Grid, Snackbar, Divider} from '@material-ui/core';
import RequestButtonComp from './RequestButtonComp';
import DistributionCard from './DistributionCard';
import { useState } from "react";

import Alert from '@material-ui/lab/Alert';

import {PageRender} from '../api/serverSideProps'
import PatchApi from '../../Components/ApiCalls/PatchApi'

import styles from "../../styles/Detailed.module.css"

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
      if (data.distributions.length == 0){
        cardOrNoCard = "Dette datasettet har ingen distribusjoner ennå.";
      }
      else{
        for(let i = 0; i < data.distributions.length; i++){
        distributionCards.push(data.distributions[i]);
        }
        cardOrNoCard = Object.values(distributionCards).map(dist => { return (<DistributionCard key={dist.id} id={dist.id} fileFormat={dist.fileFormat} uri={dist.uri} title={dist.title} />)});
      }
      }
    else {
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={disabled} />;
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
      const data2 = 
        [
          {
            "value": interestCounter+1,
            "path": "/interestCounter",
            "op": "replace",
          }
        ]
      /*console.log("Interest counter FØR setInterestCounter: "+ interestCounter);
      setInterestCounter(interestCounter + 1);*/
      console.log("Interest counter er nå: "+ data2.interestCounter);
      setOpen(true);
      PatchApi(uri, data2);
      console.log('Requests er oppdatert!');
    }

    const getChips = () => {
      return (
        <div className={styles.chipsContainer} >
          {data.publicationStatus === "Published" ? <div className={styles.chip} style={{backgroundColor: "#076DB1"}} >Publisert</div> : null}
          {data.publicationStatus === "Planned published" ? <div className={styles.chip} style={{backgroundColor: "#5C94B9"}} >Planlagt publisert</div> : null}
          {data.publicationStatus === "Not published" ? <div className={styles.chip} style={{backgroundColor: "#9EB8C9"}} >Ikke publisert</div> : null}

          {data.accessLevel === "Green" ? <div className={styles.chip} style={{backgroundColor: "#46D454"}}>Offentlig</div> : null}
          {data.accessLevel === "Yellow" ? <div className={styles.chip} style={{backgroundColor: "#D4B546"}} >Begrenset offentlighet</div> : null}
          {data.accessLevel === "Red" ? <div className={styles.chip} style={{backgroundColor: "#DA6464"}} >Unntatt offentlighet</div> : null}

          {data.coordination ? <div className={styles.chip} style={{backgroundColor: "#874BE9"}} >Samordnet</div> : <div className={styles.chip} style={{backgroundColor: "#83749B"}}>Ikke samordnet</div> }
        </div>
      )
    }
  
    console.log(data);
    ifPublished(data.publicationStatus);

    return(
      <div >
        <Grid
        container
        direction="column"
        style={{ minHeight: '70vh', minWidth: '90vh', padding: '5% 10% 5% 10%', backgroundColor: "white" }}>
          
          {getChips()}

          <h1 className={styles.title}>{data.title}</h1>

          {data.underCoordination ? <p><b>Status: </b><i>{data.statusDescription}</i></p> : null}


          <Divider variant="fullWidth" /><br />

          <p className={styles.attributes} >
            <span>Beskrivelse: </span>{data.description}
            <br/>
            <br/>
            <span>Eier: </span> {data.publisher.name}
            <br/>
            <span>Publiseringsstatus: </span>{publishedStatus} 
            <br/>           
            <span>Dato publisert: </span>{'25.06 2017'}
            <br/>
            <span>Kategori: </span> {data.category.name}
            <br/>
            {data.coordination && <div><span className={styles.attributeTitle} >Samordningsstatus: </span> {data.coordination.underCoordination ? "Pågående samordning - " + data.coordination.statusDescription : "Samordnet"}</div>}
          </p>
          <br/>

          <h3 style={{fontWeight: "600", }}>Distribusjoner:</h3>
          <span>{cardOrNoCard}</span>
          

          {/* Request dataset */}
          <span>{ifPublished(data.publicationStatus)}{requestButton}</span>
          <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
          <Alert elevation={1} severity="info">Interesse for datasett registrert</Alert>
          </Snackbar>

        </Grid>
      </div>
    )
}

export async function getServerSideProps(context) {
    const propsData = PageRender("ID", context)
    return propsData
  }

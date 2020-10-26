import { Grid, Snackbar, Divider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import RequestButtonComp from './RequestButtonComp';
import DistributionCard from './DistributionCard';
import SubscribeComp from './SubscribeComp';

import { PageRender } from '../api/serverSideProps';
import PatchApi from '../../Components/ApiCalls/PatchApi';

import styles from '../../styles/Detailed.module.css';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';

import EditTextFieldComp from './EditTextFieldComp';
import EditPublishedStatusComp from './EditPublishedStatusComp';
import EditCategoryComp from './EditCategoryComp';
import AddDistributionsComp from './AddDistributionsComp';
import AddTagsComp from './AddTagsComp';

export default function DetailedDataset({ data, uri, prevUserId, prevLoggedUsername, prevPublisherId }) {
  const [interestCounter, setInterestCounter] = useState(parseInt(data.interestCounter));
  const [disabled, setDisabled] = useState(false);
  // show/hide snackbar with successfull put message
  const [open, setOpen] = useState(false);

  const [userAreOwner, setUserAreOwner] = useState(false);

  let requestButton;
  let publishedStatus;
  const distributionCards = [];
  let cardOrNoCard;

  // variable set to false if user already are subscribed, and/or when user subscribes
  const [subscribed, setSubscribed] = useState(false);

  const updateData = async () => {
    // publicationStatus er 0 uansett hvis denne knappen kan trykkes på.
    // litt usikker på hva detailedPublicationStatus skal stå på hehe. Kan hende vi må mappe over siden den ligger under distributions.
    const data2 = [
      {
        value: interestCounter + 1,
        path: '/interestCounter',
        op: 'replace',
      },
    ];
    /* console.log("Interest counter FØR setInterestCounter: "+ interestCounter);
      setInterestCounter(interestCounter + 1); */
    console.log(`Interest counter er nå: ${data2.interestCounter}`);
    setOpen(true);
    PatchApi(uri, data2);
    console.log('Requests er oppdatert!');
  };

  // puts data into the api with datasets
  const handleChange = async () => {
    // setInterestCounter brukes ikke i praksis, oppdaterer manuelt når jeg sender data i put.
    setInterestCounter(parseInt(interestCounter) + 1);
    setDisabled(!disabled);
    setOpen(true);
    updateData();
  };

  const ifPublished = (pub) => {
    if (pub === 'Published') {
      requestButton = null;
      publishedStatus = 'Publisert';
      if (data.distributions.length === 0) {
        cardOrNoCard = 'Dette datasettet har ingen distribusjoner ennå.';
      } else {
        for (let i = 0; i < data.distributions.length; i += 1) {
          distributionCards.push(data.distributions[i]);
        }
        cardOrNoCard = Object.values(distributionCards).map((dist) => {
          return (
            <DistributionCard
              key={dist.id}
              id={dist.id}
              fileFormat={dist.fileFormat}
              uri={dist.uri}
              title={dist.title}
              canEdit={userAreOwner}
            />
          );
        });
      }
    } else {
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={disabled} />;
      publishedStatus = 'Ikke publisert';
      cardOrNoCard = 'Dette datasettet har ingen distribusjoner ennå.';
    }
  };

  const getChips = () => {
    return (
      <div className={styles.chipsContainer}>
        {data.publicationStatus === 'Published' ? (
          <div className={styles.chip} style={{ backgroundColor: '#076DB1' }}>
            Publisert
          </div>
        ) : null}
        {data.publicationStatus === 'Planned published' ? (
          <div className={styles.chip} style={{ backgroundColor: '#5C94B9' }}>
            Planlagt publisert
          </div>
        ) : null}
        {data.publicationStatus === 'Not published' ? (
          <div className={styles.chip} style={{ backgroundColor: '#9EB8C9' }}>
            Ikke publisert
          </div>
        ) : null}

        {data.accessLevel === 'Green' ? (
          <div className={styles.chip} style={{ backgroundColor: '#46D454' }}>
            Offentlig
          </div>
        ) : null}
        {data.accessLevel === 'Yellow' ? (
          <div className={styles.chip} style={{ backgroundColor: '#D4B546' }}>
            Begrenset offentlighet
          </div>
        ) : null}
        {data.accessLevel === 'Red' ? (
          <div className={styles.chip} style={{ backgroundColor: '#DA6464' }}>
            Unntatt offentlighet
          </div>
        ) : null}

        {data.coordination ? (
          <div className={styles.chip} style={{ backgroundColor: '#874BE9' }}>
            Samordnet
          </div>
        ) : (
          <div className={styles.chip} style={{ backgroundColor: '#83749B' }}>
            Ikke samordnet
          </div>
        )}
      </div>
    );
  };

  const subscribe = (url, desc) => {
    // gjør en sjekk her

    let d = {
      userId: prevUserId,
      datasetId: data.id,
    };
    if (url !== '') {
      d.url = url;
    }
    if (desc !== '') {
      d.useCaseDescription = desc;
    }
    PostApi('https://localhost:5001/api/users/subscribe', d, successfullySubscribed);
  };

  function successfullySubscribed() {
    console.log('Subscribed!');
    setSubscribed(true);
  }

  useEffect(() => {
    GetApi(`https://localhost:5001/api/users/${JSON.parse(prevLoggedUsername)}`, checkUserSubscription);
    if (data.publisher.id === parseInt(prevPublisherId)) setUserAreOwner(true);
  }, [data, subscribed]);

  function checkUserSubscription(response) {
    for (let i = 0; i < response.subscriptions.length; i++) {
      if (response.subscriptions[i].datasetId === data.id) {
        setSubscribed(true);
        return;
      }
    }
    setSubscribed(false);
  }

  const updateDataset = (newValue, editPath) => {
    const d = [
      {
        value: newValue,
        path: editPath,
        op: 'replace',
      },
    ];
    PatchApi(`https://localhost:5001/api/datasets/${data.id}`, d);
    console.log('patched dataset');
  };

  // fixing layour of date so it doesnt look so wiiiiierd
  function fixDate(date) {
    const fixing = new Date(date);
    const dd = fixing.getDate() < 10 ? `0${fixing.getDate()}` : fixing.getDate();
    let mm = fixing.getMonth();
    mm = mm < 10 ? `0${parseInt(mm) + 1}` : parseInt(mm) + 1;
    const yyyy = fixing.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  console.log(data);
  ifPublished(data.publicationStatus);

  return (
    <div>
      <Grid
        container
        direction="column"
        style={{ minHeight: '70vh', minWidth: '90vh', padding: '5% 10% 5% 10%', backgroundColor: 'white' }}
      >
        {getChips()}

        <EditTextFieldComp
          value={data.title}
          styles={styles.title}
          type="title"
          canEdit={userAreOwner}
          updateDataset={updateDataset}
          path="/title"
          multiline={false}
        />

        {data.underCoordination ? (
          <p>
            <b>Status: </b>
            <i>{data.statusDescription}</i>
          </p>
        ) : null}

        <Divider variant="fullWidth" />
        <br />

        <EditTextFieldComp
          value={data.description}
          styles={styles.attributes}
          type="span"
          staticText="Beskrivelse: "
          canEdit={userAreOwner}
          updateDataset={updateDataset}
          path="/description"
          multiline={true}
        />

        <EditPublishedStatusComp
          value={publishedStatus}
          styles={styles.attributes}
          canEdit={userAreOwner}
          updateDataset={updateDataset}
          path="/publicationStatus"
        />

        <EditCategoryComp
          value={data.category.name}
          styles={styles.attributes}
          canEdit={userAreOwner}
          categoryId={data.category.id}
          updateDataset={updateDataset}
          path="/categoryId"
        />

        <AddTagsComp
          value={data.datasetTags}
          styles={styles.attributes}
          canEdit={userAreOwner}
          updateDataset={updateDataset}
          path="/tagsIds"
        />

        <p className={styles.attributes}>
          <span>Eier: </span>
          {data.publisher.name}
          <br />
          <span>Dato publisert: </span>
          {fixDate(data.datePublished)}
          <br />
          <span>Sist oppdatert: </span>
          {fixDate(data.dateLastUpdated)}
          <br />
          {data.coordination && (
            <div>
              <span className={styles.attributeTitle}>Samordningsstatus: </span>{' '}
              {data.coordination.underCoordination
                ? `Pågående samordning - ${data.coordination.statusDescription}`
                : 'Samordnet'}
            </div>
          )}
          <p>
            <b>Søkeord: </b>
            {data.datasetTags.map((tag) => tag && `${tag.tags.name}, `)}{' '}
            {data.datasetTags.length === 0 ? 'Ingen søkeord lagt til' : null}
          </p>
        </p>
        <br />

        <h3 style={{ fontWeight: '600' }}>Distribusjoner:</h3>
        <span>{cardOrNoCard}</span>
        <br />
        <span>
          <AddDistributionsComp canEdit={userAreOwner} dataId={data.id} distributionCards={distributionCards} />
        </span>

        {/* Request dataset */}
        <span>
          {ifPublished(data.publicationStatus)}
          {requestButton}
        </span>

        {parseInt(prevPublisherId) !== data.publisher.id && (
          <span>
            <SubscribeComp onClick={subscribe} subscribed={subscribed} />
          </span>
        )}

        <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
          <Alert elevation={1} severity="info">
            Interesse for datasett registrert
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
}

export async function getServerSideProps(context) {
  const propsData = PageRender('ID', context);
  return propsData;
}

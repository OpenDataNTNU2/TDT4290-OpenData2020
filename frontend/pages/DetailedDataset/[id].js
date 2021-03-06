import { Grid, Snackbar, Divider, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import RequestButtonComp from './RequestButtonComp';
import DistributionCard from './DistributionCard';
import UseCaseCard from './UseCaseCard';
import SubscribeComp from './SubscribeComp';

import { PageRender } from '../api/serverSideProps';
import PatchApi from '../../Components/ApiCalls/PatchApi';

import styles from '../../styles/Detailed.module.css';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';
import capitalize from '../../utils/helperFunctions';

import EditTextFieldComp from './EditTextFieldComp';
import EditPublishedStatusComp from './EditPublishedStatusComp';
import EditCategoryComp from './EditCategoryComp';
import AddDistributionsComp from './AddDistributionsComp';
import AddTagsComp from './AddTagsComp';

import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

export default function DetailedDataset({ data, uri, prevUserId, prevLoggedUsername, prevPublisherId }) {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;
  const router = useRouter();

  const [interestCounter, setInterestCounter] = useState(parseInt(data.interestCounter));
  const [disabled, setDisabled] = useState(false);

  // show/hide snackbar with successfull put message
  const [open, setOpen] = useState(false);

  // logged in user are owner of coordination
  const [userAreOwner, setUserAreOwner] = useState(false);

  let requestButton;
  let publishedStatus;
  const distributionCards = [];
  let cardOrNoCard;

  // variable set to false if user already are subscribed, and/or when user subscribes
  const [subscribed, setSubscribed] = useState(false);

  // increments the interestcounter by 1.
  const updateData = async () => {
    const data2 = [
      {
        value: interestCounter + 1,
        path: '/interestCounter',
        op: 'replace',
      },
    ];
    console.log(`Interest counter er nå: ${data2.interestCounter}`);
    setOpen(true);
    PatchApi(uri, data2);
    console.log('Requests er oppdatert!');

    let newArr = Cookie.get('userHaveRequested');
    if (newArr === 'false') {
      Cookie.set('userHaveRequested', data.id + '|');
    } else {
      Cookie.set('userHaveRequested', newArr + data.id + '|');
    }
  };

  // puts data into the api with datasets
  const handleChange = async () => {
    setInterestCounter(parseInt(interestCounter) + 1);
    setDisabled(!disabled);
    setOpen(true);
    updateData();
  };

  /**
   * if published show all distributions, else show the request button
   * @param {string} pub - publication status
   */
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
      let dis = false;
      if (typeof Cookie.get('userHaveRequested') !== 'undefined') {
        let newArr = Cookie.get('userHaveRequested');
        let splitArr = newArr.split('|');
        for (let i = 0; i < splitArr.length; i++) {
          if (parseInt(splitArr[i]) === data.id) {
            dis = true;
          }
        }
      }
      requestButton = <RequestButtonComp handleChange={() => handleChange()} disabled={dis} />;
      publishedStatus = 'Ikke publisert';
      cardOrNoCard = 'Dette datasettet har ingen distribusjoner ennå.';
    }
  };

  // get chips based on publicationStatus, accessLevel and wheter or not the dataset is in a coordination
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
            Kan deles offentlig
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
          data.coordination.underCoordination ? (
            <div
              className={styles.chip}
              onClick={() =>
                router.push('/DetailedCoordination/' + data.coordination.id).then(() => window.scrollTo(0, 0))
              }
              style={{ backgroundColor: '#B99EE5', cursor: 'pointer' }}
            >
              Under samordning
            </div>
          ) : (
            <div
              onClick={() =>
                router.push('/DetailedCoordination/' + data.coordination.id).then(() => window.scrollTo(0, 0))
              }
              className={styles.chip}
              style={{ backgroundColor: '#874BE9', cursor: 'pointer' }}
            >
              Samordnet
            </div>
          )
        ) : (
          <div className={styles.chip} style={{ backgroundColor: '#83749B' }}>
            Ikke samordnet
          </div>
        )}
      </div>
    );
  };

  const subscribe = (url, desc) => {
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
    PostApi(`${host}/api/users/subscribe`, d, successfullySubscribed);
  };

  function successfullySubscribed() {
    console.log('Subscribed!');
    setSubscribed(true);
  }

  /**
   * runs when component mounts and when subscribed updates
   * fetch the logged in user, to check if there is already are a subscription
   * also sets the userAreOwner if the logged in publisher are the creator of the coordination
   */
  useEffect(() => {
    if (prevLoggedUsername !== 'false') {
      GetApi(`${host}/api/users/${JSON.parse(prevLoggedUsername)}`, checkUserSubscription);
      if (data.publisher.id === parseInt(prevPublisherId)) setUserAreOwner(true);
    }
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

  /**
   * updates editPath in dataset with new value
   * @param {string} newValue - new value
   * @param {string} editPath - what is changing
   */
  const updateDataset = (newValue, editPath) => {
    const d = [
      {
        value: newValue,
        path: editPath,
        op: 'replace',
      },
    ];
    PatchApi(`${host}/api/datasets/${data.id}`, d);
    console.log('patched dataset');
  };

  // changing format of date to dd mm yyyy
  function fixDate(date) {
    let notificationDate = new Date(date);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let result = notificationDate.toLocaleDateString('no', options);
    return result.substr(0, 1).toUpperCase() + result.substr(1);
  }

  ifPublished(data.publicationStatus);

  return (
    <div>
      <Grid
        container
        direction="column"
        style={{
          minHeight: '70vh',
          minWidth: '90vh',
          padding: '5% 10% 5% 10%',
          backgroundColor: 'white',
        }}
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

        <div className={styles.attributes}>
          <span>Utgiver: </span>
          {capitalize(data.publisher.name)}
          <br />

          {userAreOwner && (
            <EditPublishedStatusComp
              value={publishedStatus}
              styles={styles.attributes}
              canEdit={userAreOwner}
              updateDataset={updateDataset}
              path="/publicationStatus"
            />
          )}

          {/* {data.coordination && (
            <div>
              <span className={styles.attributeTitle}>Samordningsstatus: </span>{' '}
              {data.coordination.underCoordination
                ? `Pågående samordning - ${data.coordination.statusDescription}`
                : 'Samordnet'}
            </div>
          )} */}

          <span>Dato publisert: </span>
          {fixDate(data.datePublished)}
          <br />
          <span>Sist oppdatert: </span>
          {fixDate(data.dateLastUpdated)}
          <br />

          <EditCategoryComp
            value={data.category.name}
            styles={styles.attributes}
            canEdit={userAreOwner}
            categoryId={data.category.id}
            updateDataset={updateDataset}
            path="/categoryId"
          />

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

          <AddTagsComp
            value={data.datasetTags}
            styles={styles.attributes}
            canEdit={userAreOwner}
            updateDataset={updateDataset}
            path="/tagsIds"
          />
        </div>
        <br />

        <Grid>
          <h3 style={{ fontWeight: '600' }}>Distribusjoner:</h3>
          <Grid>{cardOrNoCard}</Grid>
          <br />
          <Grid>
            <AddDistributionsComp canEdit={userAreOwner} dataId={data.id} distributionCards={distributionCards} />
            <br />
          </Grid>

          <Grid>
            <br />
            <Divider variant="fullWidth" />
            <h3 style={{ fontWeight: '600' }}>Datasettet blir brukt til:</h3>
            {Object.values(data.subscriptions).length == 0 ? (
              <div>
                Dette datasettet har ingen usecase enda. <br />
              </div>
            ) : (
              Object.values(data.subscriptions).map((sub) => {
                return (
                  <UseCaseCard key={sub.id} id={sub.id} url={sub.url} useCaseDescription={sub.useCaseDescription} />
                );
              })
            )}
            <br />
          </Grid>
        </Grid>
        {/* Request dataset & subscribe only if it is not your dataset */}
        {prevLoggedUsername !== 'false' && parseInt(prevPublisherId) !== data.publisher.id && (
          <div>
            <span>
              {ifPublished(data.publicationStatus)}
              {requestButton}
            </span>
            <span>
              <SubscribeComp onClick={subscribe} subscribed={subscribed} />
            </span>
          </div>
        )}

        <Divider />
        <div>
          <br />
          {data.gitlabDiscussionBoardUrl && (
            <Button color="primary" href={data.gitlabDiscussionBoardUrl} target="_blank">
              Diskuter dette datasettet
            </Button>
          )}
          <br />
          {data.gitlabCreateIssueUrl && (
            <Button color="primary" href={data.gitlabCreateIssueUrl} target="_blank">
              Gi tilbakemeldinger på dette datasettet
            </Button>
          )}
        </div>

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

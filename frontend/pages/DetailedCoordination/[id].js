import { Grid, Snackbar, Divider, Select, FormControl, InputLabel, MenuItem, Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Alert from '@material-ui/lab/Alert';

import { PageRender } from '../api/serverSideProps';

import SubscribeComp from './SubscribeComp';
import DistributionCard from '../DetailedDataset/DistributionCard';
import UseCaseCard from '../DetailedDataset/UseCaseCard';
import EditTextFieldComp from '../DetailedDataset/EditTextFieldComp';

import DatasetCard from '../../Components/DatasetCard';
import Input from '../../Components/Forms/Input';
import GetApi from '../../Components/ApiCalls/GetApi';
import PostApi from '../../Components/ApiCalls/PostApi';
import PatchApi from '../../Components/ApiCalls/PatchApi';
import DeleteApi from '../../Components/ApiCalls/DeleteApi';

import styles from '../../styles/Detailed.module.css';

export default function DetailedCoordination({ data, prevPublisherId, prevUserId, prevLoggedUsername }) {
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;
  const [coordinationData, setCoordinationData] = useState(data);

  // variable for which dataset other municipalities will join with
  const [selectedDataset, setSelectedDataset] = useState('');
  const [joinCoordinationReason, setJoinCoordinationReason] = useState('');

  // datasets to choose from when creating application to join coordination
  const [datasets, setDatasets] = useState([]);

  // All the applications to join a coordination
  const [applicationsToJoin /* setApplicationsToJoin */] = useState([]);

  // feedback for actions
  const [openCreateApplicationFeedback, setOpenCreateApplicationFeedback] = useState(false);
  const [openRespondToApplicationFeedback, setOpenRespondToApplicationFeedback] = useState(false);

  // variable set to false if user already are subscribed, and/or when user subscribes
  const [subscribed, setSubscribed] = useState(false);

  // logged in user are owner of coordination
  const [userAreOwner, setUserAreOwner] = useState(false);

  useEffect(() => {
    if (parseInt(JSON.parse(prevPublisherId)) > 0 && parseInt(prevPublisherId) !== data.publisher.id) {
      GetApi(`${host}/api/datasets?PublisherIds=${JSON.parse(prevPublisherId)}`, setDatasets);
    }
    GetApi(`${host}/api/users/${JSON.parse(prevLoggedUsername)}`, checkUserSubscription);

    if (data.publisher.id === parseInt(prevPublisherId)) setUserAreOwner(true);
  }, [data, subscribed]);

  function checkUserSubscription(response) {
    for (let i = 0; i < response.subscriptions.length; i++) {
      if (response.subscriptions[i].coordinationId === coordinationData.id) {
        setSubscribed(true);
        return;
      }
    }
    setSubscribed(false);
  }

  const submitApplicationToJoinCoordination = () => {
    const d = {
      reason: joinCoordinationReason,
      coordinationId: data.id,
      datasetId: selectedDataset,
    };
    PostApi(`${host}/api/applications`, d, successfullySentApplication);
  };

  function successfullySentApplication() {
    console.log(`application sent to: ${host}/api/applications`);
    setSelectedDataset('');
    setJoinCoordinationReason('');
    setOpenCreateApplicationFeedback(true);
  }

  const approveApplication = (datasetId, applicationId) => {
    const d = [
      {
        value: data.id,
        path: '/coordinationId',
        op: 'replace',
      },
    ];

    PatchApi(`${host}/api/datasets/${datasetId}`, d);
    DeleteApi(`${host}/api/applications/${applicationId}`);
    GetApi(`${host}/api/coordinations/${data.id}`, setCoordinationData);
    setOpenRespondToApplicationFeedback(true);
  };

  const subscribe = (url, desc) => {
    // gjør en sjekk her

    let d = {
      userId: prevUserId,
      coordinationId: data.id,
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

  const onClick = (path, id) => {
    router.push(path + id);
  };

  const getChips = () => {
    return (
      <div className={styles.chipsContainer}>
        {coordinationData.underCoordination ? (
          <div className={styles.chip} style={{ backgroundColor: '#B99EE5' }}>
            Under samordning
          </div>
        ) : (
          <div className={styles.chip} style={{ backgroundColor: '#874BE9' }}>
            Samordnet
          </div>
        )}
        {coordinationData.accessLevel === 'Green' ? (
          <div className={styles.chip} style={{ backgroundColor: '#46D454' }}>
            Kan deles offentlig
          </div>
        ) : null}
        {coordinationData.accessLevel === 'Yellow' ? (
          <div className={styles.chip} style={{ backgroundColor: '#D4B546' }}>
            Begrenset offentlighet
          </div>
        ) : null}
        {coordinationData.accessLevel === 'Red' ? (
          <div className={styles.chip} style={{ backgroundColor: '#DA6464' }}>
            Unntatt offentlighet
          </div>
        ) : null}
      </div>
    );
  };

  const updateCoordination = (newValue, editPath) => {
    const d = [
      {
        value: newValue,
        path: editPath,
        op: 'replace',
      },
    ];
    PatchApi(`${host}/api/coordinations/${data.id}`, d);
    console.log('patched dataset');
  };

  return (
    <Grid container direction="column" style={{ minHeight: '70vh', minWidth: '90vh', padding: '5% 10% 5% 10%' }}>
      {/* Tags og overskrift */}
      <Grid style={{ padding: '3% 0 3% 0' }}>
        {getChips()}

        <EditTextFieldComp
          value={coordinationData.title}
          styles={styles.title}
          type="title"
          canEdit={userAreOwner}
          updateDataset={updateCoordination}
          path="/title"
          multiline={false}
        />

        {data.underCoordination ? (
          <div>
            <EditTextFieldComp
              value={coordinationData.statusDescription}
              styles={styles.attributes}
              type="span"
              canEdit={userAreOwner}
              updateDataset={updateCoordination}
              path="/statusDescription"
              multiline={true}
              staticText="Status: "
            />
            <Button variant="contained" onClick={() => updateCoordination(false, '/underCoordination')}>
              Sett status til samordnet
            </Button>
          </div>
        ) : null}
      </Grid>

      <Divider variant="fullWidth" />
      <br />

      {/* Informasjon om samordningen */}
      <Grid style={{ padding: '3% 0 3% 0' }}>
        <EditTextFieldComp
          value={coordinationData.description}
          styles={styles.attributes}
          type="span"
          canEdit={userAreOwner}
          updateDataset={updateCoordination}
          path="/description"
          multiline={true}
          staticText="Beskrivelse: "
        />
        <p>
          <b>Utgiver av samordning: </b>
          {data.publisher.name}
        </p>
        <p>
          <b>Deltakere i samordningen: </b>
          {coordinationData.datasets.length === 0 ? (
            <i>Ingen deltakere med i samordningen</i>
          ) : (
            coordinationData.datasets.map((dataset) => dataset && `${dataset.publisher.name}, `)
          )}
        </p>
        <br />
        <p>
          <b>Distribusjonene i samordningen: </b>
          {coordinationData.datasets.length === 0 ? <i>Ingen dataset i samordningen</i> : null}
        </p>
        {coordinationData.datasets.map((dataset) => (
          <div key={dataset.id}>
            <p>
              {dataset.publisher.name} -{dataset.title}
            </p>
            {dataset.distributions.length !== 0 ? (
              dataset.distributions.map((dist) => (
                <DistributionCard
                  key={dist.id}
                  id={dist.id}
                  fileFormat={dist.fileFormat}
                  uri={dist.uri}
                  title={dist.title}
                />
              ))
            ) : (
              <p>
                <i>Ingen distribusjon i dette datasettet</i>
              </p>
            )}
            <br />
          </div>
        ))}
      </Grid>

      <Divider variant="fullWidth" />
      <br />

      {/* Datasettene som er med i samordningen */}
      <Grid style={{ padding: '3% 0 3% 0' }}>
        <h1 style={{ fontWeight: 'normal' }}>Samordnede data</h1>
        <p>Følgende datasett er med i samordningen</p>
        <br />

        {coordinationData.datasets &&
          Object.values(coordinationData.datasets).map(
            (d) =>
              d && (
                <DatasetCard
                  key={d.id}
                  dataset={d}
                  onClick={() => onClick('/DetailedDataset/', d.id)}
                  pathName="/DetailedCoordination"
                />
              )
          )}
      </Grid>

      <Divider variant="fullWidth" />
      <br />
      <h3 style={{ fontWeight: '600' }}>Samordningen blir brukt til:</h3>
      {Object.values(coordinationData.subscriptions).length == 0 ? (
        <>
          Denne samordningen har ingen usecase enda. <br />
        </>
      ) : (
        Object.values(coordinationData.subscriptions).map((sub) => {
          return <UseCaseCard key={sub.id} id={sub.id} url={sub.url} useCaseDescription={sub.useCaseDescription} />;
        })
      )}

      <br />
      <Divider variant="fullWidth" />

      {/* Send forespørsel om å bli med i samordningen */}
      {JSON.parse(prevPublisherId) === null ||
      parseInt(JSON.parse(prevPublisherId)) === -1 ||
      parseInt(prevPublisherId) === data.publisher.id ? null : (
        <Grid style={{ padding: '3% 0 3% 0' }}>
          <h1 style={{ fontWeight: 'normal' }}>Bli med i denne samordningen</h1>
          <p>
            Velg hvilket datasett dere vil ha med i denne samordningen og skriv en liten begrunnelse av hvorfor dere
            ønsker å være med.
          </p>
          <br />
          <Input
            id="joinCoordinationId"
            multiline
            label="Begrunnelse for forespørsel"
            value={joinCoordinationReason}
            handleChange={setJoinCoordinationReason}
          />
          <br />
          <br />
          {datasets.length !== 0 ? (
            <FormControl variant="outlined" style={{ width: '50vh' }}>
              <InputLabel id="requestToJoinCoordinationLabel">Velg dataset</InputLabel>
              <Select
                labelId="requestToJoinCoordinationLabelID"
                label="Velg dataset"
                id="requestToJoinCoordinationID"
                value={selectedDataset}
                onChange={(event) => setSelectedDataset(event.target.value)}
              >
                {Object.values(datasets.items).map(
                  (dataset) =>
                    dataset && (
                      <MenuItem value={dataset.id} key={dataset.id}>
                        {dataset.title}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          ) : null}
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={submitApplicationToJoinCoordination}>
            Send Forespørsel
          </Button>
        </Grid>
      )}

      {/* Forespørsler om å bli med i samordningen */}
      {/* TODO: Nå kan kommuner legge til flere datasett til samme samordning, bør dette endres? */}
      {parseInt(prevPublisherId) === coordinationData.publisher.id ? (
        <Grid style={{ padding: '3% 0 3% 0' }}>
          <h1 style={{ fontWeight: 'normal' }}>Forespørsler om å bli med i samordningen</h1>
          {coordinationData.applications.length !== 0 ? (
            Object.values(coordinationData.applications).map(
              (application) =>
                applicationsToJoin && (
                  <div style={{ paddingBottom: '5%' }}>
                    <p>
                      <b>Utgiver:</b> {application.dataset.publisher.name}
                    </p>
                    <p>
                      <b>Begrunnelse for forespørsel:</b> {application.reason}
                    </p>
                    <DatasetCard
                      dataset={application.dataset}
                      onClick={() => onClick('/DetailedDataset/', application.dataset.id)}
                      pathName="/DetailedCoordination"
                    />
                    <Button variant="contained" color="secondary">
                      Avslå forespørsel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => approveApplication(application.dataset.id, application.id)}
                    >
                      Godta forespørsel
                    </Button>
                  </div>
                )
            )
          ) : (
            <p>Ingen forespørsler</p>
          )}
        </Grid>
      ) : null}

      {parseInt(prevPublisherId) === coordinationData.publisher.id && <Divider variant="fullWidth" />}

      <Grid style={{ padding: '3% 0 3% 0' }}>
        <h1 style={{ fontWeight: 'normal' }}>Søkeord</h1>
        {coordinationData.coordinationTags.map((tag) => (
          <p key={tag.id}>{tag.tags.name}, </p>
        ))}
        {coordinationData.coordinationTags.length === 0 ? <p>Ingen søkeord lagt til</p> : null}
      </Grid>

      {parseInt(prevPublisherId) !== coordinationData.publisher.id && (
        <Grid style={{ padding: '3% 0 3% 0' }}>
          <SubscribeComp onClick={subscribe} subscribed={subscribed} />
        </Grid>
      )}

      <Snackbar
        open={openCreateApplicationFeedback}
        autoHideDuration={5000}
        onClose={() => setOpenCreateApplicationFeedback(false)}
      >
        <Alert elevation={1} severity="success">
          Forespørsel sendt
        </Alert>
      </Snackbar>
      <Snackbar
        open={openRespondToApplicationFeedback}
        autoHideDuration={5000}
        onClose={() => setOpenRespondToApplicationFeedback(false)}
      >
        <Alert elevation={1} severity="success">
          Datasett lagt til i samordningen
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const propsData = PageRender('CoordinationID', context);
  return propsData;
}

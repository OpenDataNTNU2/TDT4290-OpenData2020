import { Grid } from '@material-ui/core/';
import styles from '../styles/CoordinationCard.module.css';
import capitalize from '../utils/helperFunctions';

export default function CoordinationCard(props) {
  /**
   * cuts the description if its too long to display everything.
   * @param {string} string - description of the coordination
   */
  const cutString = (string) => {
    if (string != null && string.length > 200) {
      return `${string.substr(0, 200)}\u2026`;
    }
    return string;
  };

  /**
   * Get chips depending on the status of the coordination
   */
  const getChips = () => {
    return (
      <div className={styles.chipsContainer}>
        {props.coordination.underCoordination ? (
          <div className={styles.chip} style={{ backgroundColor: '#B99EE5' }}>
            Under samordning
          </div>
        ) : (
            <div className={styles.chip} style={{ backgroundColor: '#874BE9' }}>
              Samordnet
            </div>
          )}
        {props.coordination.accessLevel === 'Green' ? (
          <div className={styles.chip} style={{ backgroundColor: '#46D454' }}>
            Kan deles offentlig
          </div>
        ) : null}
        {props.coordination.accessLevel === 'Yellow' ? (
          <div className={styles.chip} style={{ backgroundColor: '#D4B546' }}>
            Begrenset offentlighet
          </div>
        ) : null}
        {props.coordination.accessLevel === 'Red' ? (
          <div className={styles.chip} style={{ backgroundColor: '#DA6464' }}>
            Unntatt offentlighet
          </div>
        ) : null}
      </div>
    );
  };


  return (
    <div key={props.id * 2} className={styles.cardContainer} onClick={props.onClick}>
      {getChips()}
      <Grid container wrap="wrap">
        <Grid item xs={9}>
          <h3 className={styles.title}>{props.coordination.title}</h3>
          <p className={styles.publisher}>Utgiver: {capitalize(props.coordination.publisher.name)}</p>
          <p className={styles.desc}>{cutString(props.coordination.description)}</p>
        </Grid>
        <Grid container direction="row">
          <p>
            <strong>Deltagende kommuner: </strong>
            {props.coordination.datasets.length !== 0 ? (
              props.coordination.datasets.map((dataset) => `${capitalize(dataset.publisher.name)}, `)
            ) : (
                <i> Ingen deltagende kommuner</i>
              )}
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

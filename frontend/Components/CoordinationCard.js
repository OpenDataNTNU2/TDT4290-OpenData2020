import { Grid } from '@material-ui/core/';
import styles from '../styles/CoordinationCard.module.css';

export default function CoordinationCard(props) {
  const cutString = (string) => {
    if (string != null && string.length > 200) {
      return `${string.substr(0, 200)}\u2026`;
    }
    return string;
  };

  const getChips = () => {
    const coordinationStatus = props.coordination.underCoordination;
    return (
      <div className={styles.chipsContainer}>
        {coordinationStatus.underCoordination ? (
          <div className={styles.chip} style={{ backgroundColor: '#B99EE5' }}>
            Under samordning
          </div>
        ) : (
          <div className={styles.chip} style={{ backgroundColor: '#874BE9' }}>
            Samordnet
          </div>
        )}
      </div>
    );
  };

  //   props.coordination.underCoordination
  return (
    <div key={props.id * 2} className={styles.cardContainer} onClick={props.onClick}>
      {getChips()}
      <Grid container wrap="wrap">
        <Grid item xs={9}>
          <h3 className={styles.title}>{props.coordination.title}</h3>
          <p className={styles.publisher}>
            Utgiver:
            {props.coordination.publisher.name}
          </p>
          <p className={styles.desc}>{cutString(props.coordination.description)}</p>
        </Grid>
        <Grid container direction="row">
          <p>
            <strong>Deltagende kommuner:</strong>
            {props.coordination.datasets.length !== 0 ? (
              props.coordination.datasets.map((dataset) => `${dataset.publisher.name}, `)
            ) : (
              <i> Ingen deltagende kommuner</i>
            )}
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

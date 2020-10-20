import React from "react";
import { Grid, Paper, Box } from "@material-ui/core/";
import styles from "../styles/DatasetCard.module.css"

export default function DatasetCard({ dataset, onClick, pathName = "" }) {
    // Just example text to try long description
    const lorum =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales dapibus enim eu gravida. Phasellus consequat in dui vitae aliquam. Ut facilisis sit amet ligula at porta. Duis ut tellus diam. Nullam hendrerit elementum enim et pretium. Cras erat felis, vulputate sit amet eleifend ac, iaculis vitae tortor. Nullam ligula orci, lacinia et convallis ut, pulvinar a velit. Nullam luctus dui felis, eget venenatis massa pretium quis. Nam feugiat metus ac ligula pellentesque feugiat. Etiam eu sapien dolor. Sed a euismod odio. Pellentesque molestie purus at varius commodo. Sed lacinia sed risus at ullamcorper. Nulla a justo tincidunt, laoreet est a, euismod nulla. In fringilla non leo in volutpat. Donec lacus odio, faucibus non neque et, luctus volutpat felis. Curabitur sit amet libero arcu. Nulla molestie aliquam auctor. Sed augue lorem, faucibus eu ante a, rutrum imperdiet turpis.";

    let reqCounter;

    const ifPublished = (pub) => {
        if (pub === "Published") {
            reqCounter = null;
        } else {
            if (pathName == "/MyDatasets") {
                reqCounter =
                    "Antall forespørsler på datasett: " + dataset.interestCounter;
            } else {
                reqCounter = null;
            }
        }
    };

    const cutString = (string) => {
        if (string != null && string.length > 200) {
            return string.substr(0, 200) + "\u2026";
        }
        return string;
    };


    const setSamordna = (samordna) => {
        // checking if we have coordination information. If null it is not samordna
        if (pathName === "/DetailedCoordination") {
            return ["#FFFFFF", ""];
        }
        if (samordna == null) {
            return ["#83749B", "Ikke samordna"];
        }
        if (!samordna.underCoordination) {
            return ["#874BE9", "Samordna"];
        }
        else if (samordna.underCoordination) {
            return ["#675c78", "Pågående samordning"];
        }
    };

  const getChips = () => {
    return (
      <div className={styles.chipsContainer} >
        {dataset.publicationStatus === "Published" ? <div className={styles.chip} style={{backgroundColor: "#076DB1"}} >Publisert</div> : null}
        {dataset.publicationStatus === "Planned published" ? <div className={styles.chip} style={{backgroundColor: "#5C94B9"}} >Planlagt publisert</div> : null}
        {dataset.publicationStatus === "Not published" ? <div className={styles.chip} style={{backgroundColor: "#9EB8C9"}} >Ikke publisert</div> : null}

        {dataset.accessLevel === "Green" ? <div className={styles.chip} style={{backgroundColor: "#46D454"}}>Offentlig</div> : null}
        {dataset.accessLevel === "Yellow" ? <div className={styles.chip} style={{backgroundColor: "#D4B546"}} >Begrenset offentlighet</div> : null}
        {dataset.accessLevel === "Red" ? <div className={styles.chip} style={{backgroundColor: "#DA6464"}} >Unntatt offentlighet</div> : null}

        {dataset.coordination && <div className={styles.chip} style={{backgroundColor: setSamordna(dataset.coordination)[0]}}>{setSamordna(dataset.coordination)[1]}</div>}
        {/* TODO: Add tags for under coordination */}
        {/* {dataset.coordination.underCoordination ? <div className={styles.chip} style={{backgroundColor: "#B99EE5"}} >Under samordning</div> : <div className={styles.chip} style={{backgroundColor: "#83749B"}}>Ikke samordnet</div> }       */}
      </div>
    )
  }

  return (
    <div onClick={onClick} key={dataset.id * 2} className={styles.datasetContainer} >
      {getChips()}
        <Grid container alignItems="flex-end" wrap="wrap">
          <Grid item xs={9} >
            <h3 className={styles.title}>{dataset.title}</h3>
            <p className={styles.publisher} >{dataset.publisher.name}</p>
            <p className={styles.desc}>{cutString(dataset.description)}</p>

          <Grid container direction="row">
            {Object.values(dataset.distributions).map((dist) => (
              <Box
                key={dist.id * 7}
                border={1}
                borderRadius="borderRadius"
                borderColor="grey.500"
                padding="0.5%"
                marginRight={1}
              >
                {dist.fileFormat.toUpperCase()}
              </Box>
            ))}
          </Grid>
          {pathName==="/MyDatasets" && 
          <Grid container alignItems="center">
            {ifPublished(dataset.publicationStatus)}
            <p>{reqCounter}</p>
          </Grid>}
        </Grid>
      </Grid>
    </div>
  );
}

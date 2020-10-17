import React from "react";
import { Grid, Paper, Box } from "@material-ui/core/";

export default function DatasetCard({ dataset, onClick }) {
  const pathName = window.location.pathname;
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

  const setPublished = (publisert) => {
    if (publisert === "Published") {
      return ["#D6FFD2", "Publisert"];
    }
    return ["#FFBFC3", "Ikke publisert"];
  };

  const setSamordna = (samordna) => {
    // checking if we have coordination information. If null it is not samordna
    if (samordna==null) {
      return ["#E8E6EF", "Ikke samordna"];
    }
    if (!samordna.underCoordination) {
      return ["#EBE4FF", "Samordna"];
    }
    else if (samordna.underCoordination) {
      return ["#E8E6EF", "Pågående samordning"];
    }
    return ["#E8E6EF", "Ikke samordna"];
  };

  return (
    <div onClick={onClick} key={dataset.id * 2}>
      <Paper
        variant="outlined"
        style={{ padding: "1%", marginBottom: "2%", cursor: "pointer" }}
      >
        <Grid container alignItems="flex-end" wrap="wrap">
          <Grid item xs={9}>
            <h3>{dataset.title}</h3>
            <h5>{dataset.publisher.name}</h5>
            <p>{cutString(dataset.description)}</p>
          </Grid>
          <Grid item xs={2} style={{ margin: "1em" }}>
            <Paper
              elevation={0}
              style={{
                backgroundColor: setPublished(dataset.publicationStatus)[0],
                textAlign: "center",
                padding: "3%",
                marginBottom: "3%",
              }}
            >
              {setPublished(dataset.publicationStatus)[1]}
            </Paper>
            <Paper
              elevation={0}
              style={{
                backgroundColor: setSamordna(dataset.coordination)[0],
                textAlign: "center",
                padding: "3%",
              }}
            >
              {setSamordna(dataset.coordination)[1]}
            </Paper>
          </Grid>

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
          <Grid container alignItems="center">
            {ifPublished(dataset.publicationStatus)}
            <p>{reqCounter}</p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

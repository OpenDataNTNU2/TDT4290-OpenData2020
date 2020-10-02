import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

export default function DatasetCard({ dataset, onClick }) {
    // Just example text to try long description
    const lorum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales dapibus enim eu gravida. Phasellus consequat in dui vitae aliquam. Ut facilisis sit amet ligula at porta. Duis ut tellus diam. Nullam hendrerit elementum enim et pretium. Cras erat felis, vulputate sit amet eleifend ac, iaculis vitae tortor. Nullam ligula orci, lacinia et convallis ut, pulvinar a velit. Nullam luctus dui felis, eget venenatis massa pretium quis. Nam feugiat metus ac ligula pellentesque feugiat. Etiam eu sapien dolor. Sed a euismod odio. Pellentesque molestie purus at varius commodo. Sed lacinia sed risus at ullamcorper. Nulla a justo tincidunt, laoreet est a, euismod nulla. In fringilla non leo in volutpat. Donec lacus odio, faucibus non neque et, luctus volutpat felis. Curabitur sit amet libero arcu. Nulla molestie aliquam auctor. Sed augue lorem, faucibus eu ante a, rutrum imperdiet turpis."

    const cutString = (string) => {
        if(string.length>200){
            return string.substr(0, 200) + "\u2026"
        }
        return string
    }

    return (
        <div onClick={onClick}>
            <Grid item key={dataset.id}>
                <Paper variant='outlined' style={{ padding: '1%', marginBottom:'2%' }}>
                    <Grid container alignItems='flex-end' wrap='wrap'>
                        <Grid item  xs={9}>
                            <h3>{dataset.title}</h3>
                            <p>{cutString(dataset.description)}</p>
                        </Grid>
                        <Grid item xs={2} style={{margin: '1em'}}>
                            <Paper elevation={0} style={{ backgroundColor: '#D6FFD2', textAlign: 'center', padding: '3%', marginBottom: '3%' }}>Publisert</Paper>
                            <Paper elevation={0} style={{ backgroundColor: '#EBE4FF', textAlign: 'center', padding: '3%' }}>Samordna</Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}
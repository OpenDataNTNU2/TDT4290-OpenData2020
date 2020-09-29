import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { useState } from "react";
import Alert from '@material-ui/lab/Alert'
import { Paper } from '@material-ui/core'

export default function DetailedDataset(){
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [distributions, setLink] = useState("");
    const [owner, setOwner] = useState("");
    const [format, setFormat] = useState("");
    const [language, setLanguage] = useState("");
    

    const handleChange = async (id) => {
        
        const data = {
            "identifier": "stringeling",
            "title": title,
            "description": description,
            "date": date,
            "link": distributions,
            "owner": owner,
            "format": format,
            "language": language
        }
        
    }
    
    return(
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="left"
            style={{ minHeight: '70vh', minWidth: '90vh', padding: '5%', border: '2%'}}
        >
            <Grid
            container
            spacing={0}
            direction="row"
            justify="space-between"
            alignItems="center">
                <h1 style={{fontWeight: "bold", }}><p>PLACEHOLDER TITLE {title}</p></h1>
                <p style={{paddingRight: '5%'}}><b>Oppdatert: </b>{date}placeholder</p>
            </Grid>
            
            <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '1%' , paddingBottom:'4%'}}>
            <p style={{paddingBottom:'3%'}}><b>Beskrivelse: </b> Placeholder {description}</p>
            <p><b>Eier:</b> Placeholder {owner}</p>
            <p><b>Type:</b> Placeholder {format}</p>
            <p><b>Språk:</b> Placeholder {language}</p>
            <p><b>Dato publisert: </b>Placeholder {date}</p>
            <p><b>Link til datasett: </b>Placeholder {distributions}</p>
            </Paper>

        </Grid>

        


    )
}
 
export async function getServerSideProps(id) {
    // Fetch data from external API
    // Should be changed to host link when this is done, not localhost.
    const uri = 'https://localhost:5001/api/datasets/:id';
    const res = await fetch(uri, createRequestOptions(true))
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data } }
  }

import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { useState } from "react";
import { Paper } from '@material-ui/core'
import { useRouter } from 'next/router'

export default function DetailedDataset({data}){
   
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
                <h1 style={{fontWeight: "bold", }}><p>{data.title}</p></h1>
                <p style={{paddingRight: '5%'}}><b>Oppdatert: </b></p>
            </Grid>
            
            <Paper variant='outlined' style={{ backgroundColor: '#E1F3FF', padding: '1%' , paddingBottom:'4%'}}>
            <p style={{paddingBottom:'3%'}}><b>Beskrivelse: </b>{data.description}</p>
            <p><b>Eier:</b> {data.publisher[obj].name}</p>
            <p><b>Type:</b>  </p>
            <p><b>Språk:</b> </p>
            <p><b>Dato publisert: </b> </p>
            <p><b>Link til datasett: </b> {data.distributions} </p>
            </Paper>

        </Grid>

        


    )
}

export async function getServerSideProps(context) {
    // Fetch data from external API
    // Should be changed to host link when this is done, not localhost.
    const uri = 'https://localhost:5001/api/datasets/' + context.params.id;
    const res = await fetch(uri, createRequestOptions(true))
    const data = await res.json()
  
    // Pass data to the page via props
    return { props: { data } }
  }

// ALERT: This ships HTTPS validation and should not be used when we are handling personal information and authentication etc.
function createRequestOptions(skipHttpsValidation) {
    const isNode = typeof window === 'undefined';
    if (isNode) {
      var Agent = (require('https')).Agent;
      return {
        agent: new Agent({ rejectUnauthorized: !skipHttpsValidation })
      };
    }
  }

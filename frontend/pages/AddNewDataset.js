
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';

import Distribution from '../Components/Forms/Distribution'
import Input from '../Components/Forms/Input'
import RadioInput from '../Components/Forms/RadioInput'
import SelectInput from '../Components/Forms/SelectInput'

import { useState } from "react";

export default function AddNewDataset(){
    
    // variables/states for "main data", will add more here
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [published, setPublished] = useState("published");
    const [publishedStatus, setPublishedStatus] = useState("")

    // variables/states for the distribution
    const [distribution, setDistribution] = useState(0);
    const [distTitle, setDistTitle] = useState([""]);
    const [distUri, setDistUri] = useState([""]);
    const [distFileFormat, setDistFileFormat] = useState([1]);




    // posts data into the api with datasets 
    // and if successfull runs addDistributions
    const handleChange = async () => {
        const data = {
            "identifier": "stringeling",
            "title": title,
            "description": description
        }
        try{
            fetch('https://localhost:5000/api/datasets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                for(let i = 0; i < distribution; i++){
                    try{
                        addDistributions(data.id, i);
                    }
                    catch(_){
                        alert("failed x2")
                    }
                }
            })
        }
        catch(_){
            alert("failed")
            console.log("failed")
        }
    }

    // need id of a dataset, which it gets from handleChange, 
    // and adds/posts data2 into the distributions of that dataset
    const addDistributions = async (id, i) => {
        const data2 = {
            "title": distTitle[i],
            "uri": distUri[i],
            "fileFormat": distFileFormat[i],
            "datasetId": id
        }
        try{
            fetch('https://localhost:5001/api/distributions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data2)
            })
            .then(response => response.json())
            .then(data2 => console.log(data2))
        }
        catch(_){
            alert("failed")
            console.log("failed")
        }
    }


    const addNewMoreDistributions = () => {
        setDistribution(distribution + 1)
        setDistTitle([...distTitle, ""])
        setDistUri([...distUri, ""])
        setDistFileFormat([...distFileFormat, 1])
    }

    const removeDistribution = () => {
        setDistTitle(distTitle.splice(-1,1))
        setDistUri(distUri.splice(-1,1))
        setDistFileFormat(distFileFormat.splice(-1,1))
        setDistribution(distribution - 1)
    }

    return(
        <Grid
            container
            spacing={0}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '70vh', minWidth: '90vh'}}
        >
            
            <h1 style={{fontWeight: "normal"}}>Legg til nytt datasett</h1>

            <Input 
                id="outlined-basic"
                label="Tittel"
                value={title}
                handleChange={setTitle}
                multiline={false}
            /><br/>
            
            <FormControl component="fieldset">
                <FormLabel component="legend">Status for publisering</FormLabel>
                <RadioInput 
                    mainValue={published}
                    handleChange={setPublished}
                    value={["published", "not published"]}
                    label={["Publisert", "Ikke publisert"]}
                />
                {published !== "published" ? 
                    <div style={{marginLeft: "5vh"}}>
                        <RadioInput 
                            mainValue={publishedStatus}
                            handleChange={setPublishedStatus}
                            value={["willBePublished", "underEvaluation", "cannotPublish"]}
                            label={["Skal publiseres", "Under vurdering", "Kan ikke publiseres"]}
                        />
                    </div>
                : null }
            </FormControl>

            <Input 
                id="outlined-multiline"
                label="Beskrivelse"
                value={description}
                handleChange={setDescription}
                multiline={true}
            /><br/>
           
            <SelectInput 
                mainLabel="Type: Not relevant yet"
                value={[10,20,30]}
                label={["Option 1", "Option 2", "Option 3"]}
            /><br/>

            <SelectInput 
                mainLabel="Kategori: Not relevant yet"
                value={[10,20,30]}
                label={["Option 1", "Option 2", "Option 3"]}
            /><br/>

            <Input 
                id="outlined-multiline"
                label="Tags: Not relevant yet"
                value=""
                handleChange={null}
                multiline={false}
            /><br/>
            
        
            {distribution === 0 ? 
                <Button variant="contained" color="primary" onClick={() => setDistribution(1)}>Add distribution</Button>
            :   <Grid><br/>
                    <h1 style={{fontWeight: "normal", textAlign: "center"}}>Legg til distribusjon</h1>
                    {Array.from(Array(distribution), (e, i) => {
                        return <div>
                                    <Divider variant="middle" />
                                    <Distribution 
                                        title={distTitle}
                                        setTitle={setDistTitle}
                                        uri={distUri}
                                        setUri={setDistUri}
                                        fileFormat={distFileFormat}
                                        setFileFormat={setDistFileFormat}
                                        number={i}
                                    />
                                </div>
                    })}
                </Grid> }

            {distribution !== 0 ? 
                <div>
                    <Button variant="contained" color="secondary" onClick={removeDistribution}>Fjern</Button>
                    <Button variant="contained" color="primary" onClick={addNewMoreDistributions}>Legg til</Button>
                </div>
            :   null }<br/>
            
            <Button variant="contained" color="primary" onClick={handleChange}>Send inn</Button><br/>
            
        
        </Grid>
    )
}
 

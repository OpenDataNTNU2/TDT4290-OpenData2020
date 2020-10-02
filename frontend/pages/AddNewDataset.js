
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import Distribution from '../Components/Forms/Distribution'
import Input from '../Components/Forms/Input'
import RadioInput from '../Components/Forms/RadioInput'
import SelectInput from '../Components/Forms/SelectInput'
import SelectTags from '../Components/Forms/SelectTags'

import { useState } from "react";

export default function AddNewDataset(){
    
    // variables/states for "main data", will add more here
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [published, setPublished] = useState("1");
    const [publishedStatus, setPublishedStatus] = useState("0")

    // variables/states for the distribution
    const [distribution, setDistribution] = useState(0);
    const [distTitle, setDistTitle] = useState([""]);
    const [distUri, setDistUri] = useState([""]);
    const [distFileFormat, setDistFileFormat] = useState([1]);

    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [createdTag, setCreatedTag] = useState("")

    const [submitted, setSubmitted] = useState(false)


    const [open, setOpen] = useState(false)

    // resets the value of publishedStatus to 0 if "published" is selected
    const handlePublishChange = (value) => {
        if(value === "1") setPublishedStatus("0")
        setPublished(value)
    }

    // posts data into the api with datasets 
    // and if successfull runs addDistributions
    const handleChange = async () => {
        const data = {
            "identifier": "stringeling",
            "title": title,
            "description": description,
            "publisherId": 100,
            "publicationStatus": parseInt(published),
            "detailedPublicationStatus": parseInt(publishedStatus)
        }
        try{
            fetch('https://localhost:5001/api/datasets', {
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
                if(distribution===0){
                    setOpen(true)
                    clearStates()
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
            setOpen(true)
            clearStates() 
        }
        catch(_){
            alert("failed")
            console.log("failed")
        }
        
    }

    const getTags = async () => {
        try{
            fetch('https://localhost:5001/api/tags', {
                method: 'GET',    
            })
            .then(response => response.json())
            .then(response => { setTags(response); console.log(response)})
        }
        catch(_){
            console.log("failed to fetch tags")
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

    // vet ikke om dette kan gjøres på en annen måte, men lar det stå slik for nå
    // resets all the states, this is executed after successfully submitting a dataset
    // it is no restrictions for input fields missing etc, so in theory, it is successfull no matter what now..
    const clearStates = () => {
        setTitle("")
        setDescription("")
        setPublished("1")
        setPublishedStatus("0")
        
        setDistTitle([""])
        setDistUri([""])
        setDistFileFormat([0])
        setDistribution(0)
    }

    // TODO: kanskje greit å ha en link brukere kan trykke på etter å ha opprettet et dataset, som tar de til datasettet
    // venter med dette til vi har dynamic routes ferdig for hvert dataset, men har tilgang på id her, så bør være enkelt

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

            <Button onClick={getTags}>click to fetch tags</Button>
            
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
                    handleChange={handlePublishChange}
                    value={["1", "2"]}
                    label={["Publisert", "Ikke publisert"]}
                />
                {published !== "1" ? 
                    <div style={{marginLeft: "5vh"}}>
                        <RadioInput 
                            mainValue={publishedStatus}
                            handleChange={setPublishedStatus}
                            value={["1", "2", "3"]}
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

            <SelectTags 
                mainLabel="Tags"
                tags={tags}
                prevSelected={selectedTags}
                onChange={setSelectedTags}
                setCreateTag={setCreatedTag}
                createTag={createdTag}
                submitted={setSubmitted}
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
            
                
            <Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
                <Alert elevation={1} severity="success">Datasett publisert</Alert>
            </Snackbar>
        </Grid>
    )
}

function createRequestOptions(skipHttpsValidation) {
    const isNode = typeof window === 'undefined';
    if (isNode) {
      var Agent = (require('https')).Agent;
      return {
        agent: new Agent({ rejectUnauthorized: !skipHttpsValidation })
      };
    }
  }
  
  // This gets called on every request
  export async function getServerSideProps() {
    // Fetch data from external API
    // Should be changed to host link when this is done, not localhost.
    const uri = 'https://localhost:5001/api/tags';
    const res = await fetch(uri, createRequestOptions(true))
    const fuu = await res.json()
  
    // Pass data to the page via props
    return { props: { fuu } }
  }
 


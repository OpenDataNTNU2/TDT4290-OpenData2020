
import Cookie from "js-cookie";
import { parseCookies } from '../utils/parseCookies'


export default function MyDatasets({prevLoggedIn, prevLoggedUsername, prevPublisherId, prevUserId}){
    
    

    
    return(
        <div>
            <p>id {prevPublisherId}</p>
            {prevLoggedIn ? <h3>{JSON.parse(prevLoggedUsername)} sine dataset</h3> : null}
            
        </div>
    )
    
}

MyDatasets.getInitialProps = ({req}) => {
    const cookies = parseCookies(req);

    return{
        prevLoggedIn: cookies.prevLoggedIn,
        prevLoggedUsername: cookies.prevLoggedUsername,
        prevPublisherId: cookies.prevPublisherId,
        prevUserId: cookies.prevUserId 
    }
}





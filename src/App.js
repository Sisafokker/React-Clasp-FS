import { Routes, Route } from "react-router-dom";
import  { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Nav from "./components/nav";
import Home from "./components/home";
import About from "./components/about";

const SCOPES = "https://www.googleapis.com/auth/drive";

function App() {
    const [user, setUser] = useState({});
    const [tokenClient, setTokenClient ] = useState({});
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    // React Hook to initialize our Google Client once at the begining of our render
    useEffect( () => {
        //console.log("App initialized", process.env.REACT_APP_CLIENT_ID)
        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            //client_id: process.env.CLIENT_ID,
            callback: handleCallbackResponse
        })

        window.google.accounts.id.renderButton( 
            document.getElementById("signInDiv"), 
            { theme: "outline", width: 200 }
        )
        
        // Get Access Token
        setTokenClient(
            window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    console.log("tokenResponse", tokenResponse);
                    if (tokenResponse && tokenResponse.access_token) {
                        // Http request to API (try this method instead of http gapi.calendar.events)
                        fetch("https://www.googleapis.com/drive/v3/files", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${tokenResponse.access_token}`
                            }, 
                            body: JSON.stringify({"name": "CooperCodes_ReactAppFile", "mimeType": "text/plain"})
                        })
                    }
                }
            })
        )

        // Optional. Show list of Google Users (users same HandleCallbackResponse fx)
        window.google.accounts.id.prompt();
    }, []); 

    function handleCallbackResponse(response) {
        let userCredentials = response.credential;
        console.log(`Encoded JWT (Json Web Token) Id: ${userCredentials}`);
        let userObject = jwtDecode(userCredentials);
        console.log('User Object:', JSON.stringify(userObject, null, 4));
        console.log(`User: ${userObject.email}`)
        setUser(userObject)

        // Hidding SignIn Button
        document.getElementById("signInDiv").hidden = true;
    }

    function handleSignOut (e) {
        console.log("handleSignOut: "+e)
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    function createDriveFile(){
        tokenClient.requestAccessToken();
    }

    return (
    <div>
        <div id="signInDiv"></div>

        {/* SignOut Button if user is signed in */}
        { Object.keys(user).length !== 0 && 
            <button onClick={ (e) => handleSignOut(e) }>Sign Out</button>
        }
        
        {/* Show User Data if User object is present*/}
        { Object.keys(user).length !== 0 && user && 
            <div> 
                <img src={user.picture}></img>
                <h3>Holaaa {user.name} ( {user.email} )</h3>
                <input type="submit" onClick={ createDriveFile } value="Create File"/>
                <Nav />
            </div>           
        }


       <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="about" element={<About />} />
            <Route path="*" element={<Home />} />
       </Routes>
    </div>
    )
}

export default App
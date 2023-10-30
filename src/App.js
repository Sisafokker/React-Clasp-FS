import { Routes, Route } from "react-router-dom";
import  { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import Nav from "./components/nav";
import Home from "./components/home";
import About from "./components/about";


function App() {
    const [user, setUser] = useState({})
    // React Hook to initialize our Google Client once at the begining of our render
    useEffect( () => {
        window.google.accounts.id.initialize({
            client_id: "240692930692-icvohb5b9herteb2oqk18qjb89hlqnls.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        window.google.accounts.id.renderButton( 
            document.getElementById("signInDiv"), 
            { theme: "outline", size: "large" }
        )
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
                <h3>Hi {user.name} ( {user.email} )</h3>
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
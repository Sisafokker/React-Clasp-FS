// OAuth.js
// Dependencies
import React, { useEffect, useState, useContext } from "react";
import { Context } from "./Context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // useNavigate Hook

// Styles
import "./styles/main.scss";

// Components
import Nav from "./components/nav";
import OAuthForm from "./components/oauthform";

const SCOPES = "https://www.googleapis.com/auth/drive";

function OAuth({ prop_renderRoutes }) {
    const { user, setUser } = useContext(Context);
    const [showGoogleLogin, setShowGoogleLogin] = useState(true); // New state to control Google login visibility
    const [tokenClient, setTokenClient] = useState({});
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();

    // useEffect hook to handle component initialization and cleanup
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google && window.google.accounts) {
                // Google API is loaded, proceed with initialization
                console.log("👍App initialized");
                const storedUser = localStorage.getItem("local_user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    document.getElementById("googleLogIn").style.display = "none";
                } else {
                    window.google.accounts.id.prompt();
                }

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: handleCallbackResponse
                });

                window.google.accounts.id.renderButton(document.getElementById("googleLogIn"), {
                    theme: "outline",
                    size: 'large',
                    width: 250
                });

                setTokenClient(
                    window.google.accounts.oauth2.initTokenClient({
                        client_id: CLIENT_ID,
                        scope: SCOPES,
                        callback: tokenResponse => {
                            if (tokenResponse && tokenResponse.access_token) {
                                fetch("https://www.googleapis.com/drive/v3/files", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${tokenResponse.access_token}`
                                    },
                                    body: JSON.stringify({
                                        name: "ReactAppFile",
                                        mimeType: "text/plain"
                                    })
                                });
                            }
                        }
                    })
                );
            } else {
                setTimeout(initializeGoogleSignIn, 50); // Wait and try initializeGoogleSignIn again
            }
        };

        // Initialize the entire process
        initializeGoogleSignIn();

        return () => {
            // Clean-up logic when the component is unmounted
        };
    }, []); // The empty dependency array ensures that this effect runs once after the initial render
    

    // Handle the response from Google Sign-In callback
    function handleCallbackResponse(response) {
        console.log("👍HandleSignIn")
        setShowGoogleLogin(false);
        let userCredentials = response.credential;
        let userObject = jwtDecode(userCredentials); // Decode the JWT token to get user data

        // Set the user data in the component state
        setUser(userObject);

        // Hide SignIn Button
        //document.getElementById("googleLogIn").hidden = true;
        document.getElementById("googleLogIn").style.display = "none";

        // Save user data to local storage
        localStorage.setItem("local_user", JSON.stringify(userObject));

        // Render Routes after signin
        prop_renderRoutes();

         // Move to the desired route
         navigate("/customers");
    }

    // Function to handle user sign-out
    function handleSignOut(e) {
        console.log("👍handleSignOut")
        setShowGoogleLogin(true);
        localStorage.removeItem("local_user");  // Clear user data from local storage
        setUser({});                            // Clear user data from component state
        navigate("/home");                      // Move to: 
        

        // Show SignIn Div and Prompt
        //document.getElementById("googleLogIn").style.display = "block";
        //document.getElementById("googleLogIn").hidden = false;
        window.google.accounts.id.prompt();
    }

    // Function to create a file in Google Drive when the user clicks the "Create File" button
    function createDriveFile() {
        console.log("👍createDriveFile")
        tokenClient.requestAccessToken();
    }

    // Render the OAuth component
    return (
        <div className="auth-wrapper">
            {!user || Object.keys(user).length === 0 && <OAuthForm />}
            {showGoogleLogin && Object.keys(user).length === 0 ? <div id="googleLogIn" className="google-login"></div> : null}
            {user && Object.keys(user).length !== 0 && (                
                <div className="user-nav-wrapper">
                    <div className="user-info">
                        <div className="user-details">
                            <img className="user-avatar" src={user.picture || "https://use.fontawesome.com/releases/v5.15.4/svgs/solid/user.svg"} alt="User" />
                            <div className="user-text">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                                <div className="sign-out">
                                    <button className="sign-out-button" onClick={e => handleSignOut(e)}>Sign Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Nav />
                    {/*              <div className="others">
                    <input className="create-file-button" type="submit" onClick={createDriveFile} value="Create File" />
                </div> */}
                </div>
            )}
        </div>
    );

}

export default OAuth;

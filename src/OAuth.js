// Dependencies
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Components
import Nav from "./components/nav";

const SCOPES = "https://www.googleapis.com/auth/drive";

function OAuth() {
    // State variables to manage user data and token client
    const [user, setUser] = useState({});
    const [tokenClient, setTokenClient] = useState({});
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

    // useEffect hook to handle component initialization and cleanup
    useEffect(() => {
        // Initialize Google Sign-In and set up event handlers
        console.log("👍App initialized")

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCallbackResponse
        });

        // Render Google Sign-In button
        window.google.accounts.id.renderButton(document.getElementById("signInDiv"), {
            theme: "outline",
            width: 200
        });

        // Set up the token client for accessing Google Drive API
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
                                name: "CooperCodes_ReactAppFile",
                                mimeType: "text/plain"
                            })
                        });
                    }
                }
            })
        );

        // (Optional) Prompt the user to sign in using their Browser Google account
        window.google.accounts.id.prompt();

        // Clean-up logic when the component is unmounted
        return () => {
            // Cleanup logic, if needed
        };
    }, []); // The empty dependency array ensures that this effect runs once after the initial render

    // Handle the response from Google Sign-In callback
    function handleCallbackResponse(response) {
        console.log("👍HandleSignIn")
        let userCredentials = response.credential;
        let userObject = jwtDecode(userCredentials); // Decode the JWT token to get user data
        setUser(userObject); // Set the user data in the component state
        document.getElementById("signInDiv").hidden = true;
    }

    // Function to handle user sign-out
    function handleSignOut(e) {
        console.log("👍handleSignOut")
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    // Function to create a file in Google Drive when the user clicks the "Create File" button
    function createDriveFile() {
        console.log("👍createDriveFile")
        tokenClient.requestAccessToken();
    }

    // Render the OAuth component
    return (
        <div>
            <div id="signInDiv"></div>
            {Object.keys(user).length !== 0 && ( // Conditionally render content if user data is available
                <div>
                    <button onClick={e => handleSignOut(e)}>Sign Out</button>
                    <img src={user.picture} alt="User" />
                    <h3>Hola {user.name} ({user.email})</h3>
                    <Nav />
                    <input type="submit" onClick={createDriveFile} value="Create File" />
                </div>
            )}
        </div>
    );
}

export default OAuth;

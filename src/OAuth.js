// Dependencies
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // useNavigate Hook

// Styles
import "./styles/main.scss";

// Components
import Nav from "./components/nav";

const SCOPES = "https://www.googleapis.com/auth/drive";

function OAuth() {
    // State variables to manage user data and token client
    const [user, setUser] = useState({});
    const [tokenClient, setTokenClient] = useState({});
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();

    // useEffect hook to handle component initialization and cleanup
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google && window.google.accounts) {
                // Google API is loaded, proceed with initialization
                console.log("👍App initialized");
                const storedUser = localStorage.getItem("user");
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

        // Set the user data in the component state
        setUser(userObject);

        // Hide SignIn Button
        //document.getElementById("googleLogIn").hidden = true;
        document.getElementById("googleLogIn").style.display = "none";

        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify(userObject));

        // Move to: 
        navigate("/customers");
    }

    // Function to handle user sign-out
    function handleSignOut(e) {
        console.log("👍handleSignOut")

        // Clear user data from local storage
        localStorage.removeItem("user");

        // Clear user data from component state
        setUser({});

        // Move to: 
        navigate("/");

        // Show SignIn Div and Prompt
        document.getElementById("googleLogIn").style.display = "block";
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
            <div id="googleLogIn" className="google-login"></div>
            {Object.keys(user).length !== 0 && ( // Conditionally render content if user data is available
                <div className="user-nav-wrapper">
                    <div className="user-info">
                        <div className="user-details">
                            <img className="user-avatar" src={user.picture} alt="User" />
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

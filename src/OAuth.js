// OAuth.js
// Dependencies
import React, { useEffect, useState, useContext } from "react";
import { Context } from "./Context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // useNavigate Hook

// Styles
import "./styles/main.scss";
// Compiled CSS Styles files
//import "../apps-script/styles_compiled/main.css";

// Components
import Nav from "./components/nav";
import OAuthForm from "./components/oauthform";


const SCOPES = "https://www.googleapis.com/auth/drive";

function OAuth({ prop_renderRoutes }) {
    const { user, setUser } = useContext(Context);
    const [tokenClient, setTokenClient] = useState({});
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();

    // useEffect hook to handle component initialization and cleanup
    useEffect(() => {
        console.log("CLIENT_ID",CLIENT_ID);
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
                    context: 'signin',
                    callback: handleCallbackResponse,
                    cancel_on_tap_outside: false,
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
                setTimeout(initializeGoogleSignIn, 100); // Wait and try initializeGoogleSignIn again
            }
        };

        // Initialize the entire process
        initializeGoogleSignIn();

        return () => {
            // Clean-up logic when the component is unmounted
        };
    }, []); // The empty dependency array ensures that this effect runs once after the initial render
    
    function decodeJwtResponse(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Handle the response from Google Sign-In callback
    function handleCallbackResponse(response) {
        console.log("👍HandleSignIn")
        let userCredentials = response.credential;
        //let userObject = jwtDecode(userCredentials);          // Alternative 1: Decode the JWT token to get user data
        let userObject = decodeJwtResponse(userCredentials);    // Alternative 2: To Decode the JWT token

        setUser(userObject); // Set the user data in the component state
        localStorage.setItem("local_user", JSON.stringify(userObject)); // Save user data to local storage
        prop_renderRoutes(); // Render Routes after signin
         navigate("/customers"); // Move to the desired route
        
         // Hide SignIn Button
        //document.getElementById("allLogin").style.display = "none";
        const allLoginElement = document.getElementById("allLogin");
        if (allLoginElement) {
            allLoginElement.style.display = "none";
        }
    }

    // Function to handle user sign-out
    function handleSignOut(e) {
        console.log("👍handleSignOut")
        localStorage.removeItem("local_user");  // Clear user from local storage
        setUser({});                            // Clear user state
        navigate("/home");                      // Move to:        

        // Show SignIn Div and Prompt
        const allLoginElement = document.getElementById("allLogin");
        if (allLoginElement) {
            allLoginElement.style.display = "block";
        }
        //window.google.accounts.id.prompt();

        if (window.google && window.google.accounts) {
            window.google.accounts.id.prompt();
        }
    }

    // Function to create a file in Google Drive when the user clicks the "Create File" button
    function createDriveFile() {
        console.log("👍createDriveFile")
        tokenClient.requestAccessToken();
    }

    // Render the OAuth component
    return (
        <div className="auth-wrapper">
            {!user || Object.keys(user).length === 0 && (
            <div className="allLogin">
                <OAuthForm /> 
                <div id="googleLogIn" className="google-login"></div> 
            </div>)
            }
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


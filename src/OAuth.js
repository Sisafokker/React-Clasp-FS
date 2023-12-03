// src/OAuth.js
// Dependencies
import React, { useEffect, useState, useContext } from "react";
import axios from 'axios';
import { Context } from "./Context";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // useNavigate Hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


// Styles
import "./styles/main.scss";
import "./styles/auth.scss";
// Compiled CSS Styles files
//import "../apps-script/styles_compiled/main.css";

// Components
import Nav from "./components/nav";
import Auth_Form from "./components/auth_form";
const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";

export const AuthContext = React.createContext();

function OAuth({ prop_renderRoutes }) {
    const { user, setUser, setTokenClient, isMenuOpen, setIsMenuOpen } = useContext(Context);
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const navigate = useNavigate();

    // Initial Mount
    useEffect(() => {
        const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
        console.log('CLIENT_ID_1:', CLIENT_ID.slice(0, 2));
        loadGoogleSignInScript();
    }, []);

    useEffect(() => {
        const googleLoginElement = document.getElementById("googleLogIn");
        if (user && Object.keys(user).length !== 0) {
          if (googleLoginElement) googleLoginElement.style.display = "none"; // User Logged
        } else {
          if (googleLoginElement) googleLoginElement.style.display = "block"; // User Not logged
        }
      }, [user]);      

    const loadGoogleSignInScript = () => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.onload = () => {
                console.log('Google Sign-In script loaded');
                initializeGoogleSignIn();
            };
            script.onerror = () => console.error("Error loading Google Sign-In");
            document.body.appendChild(script);
        } else {
            console.log('Google Sign-In script already loaded');
            initializeGoogleSignIn();
        }
    };

    const initializeGoogleSignIn = () => {
        console.log('Initializing Google Sign-In...');
        console.log('window.google:', window.google);
        console.log('CLIENT_ID:', CLIENT_ID.slice(0, 2));

        if (window.google && window.google.accounts) {
            try {
                const storedUser = localStorage.getItem("local_user");
                
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    document.getElementById("googleLogIn").style.display = "none";
                } else {                      
                    window.google.accounts.id.initialize({
                        client_id: CLIENT_ID,
                        context: 'signin',
                        callback: handleCallbackResponse,
                        cancel_on_tap_outside: false,
                    });

                    if (CLIENT_ID) {
                        window.google.accounts.id.prompt();
                    } else {
                        console.error("Client ID is missing");
                    }
                }

                window.google.accounts.id.renderButton(document.getElementById("googleLogIn"), {
                    theme: "outline",
                    size: 'large',
                    width: 250
                });

            } catch (e)  {
                console.log("G.Loaded Google Sign-In initializing error");
            }
        } else {
            setTimeout(initializeGoogleSignIn, 100); // Go again
        }
    }
    
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
        //let userObject = jwtDecode(userCredentials);              // Alternative 1: Decode the JWT token to get user data
        let temp_userObject = decodeJwtResponse(userCredentials);   // Alternative 2: To Decode the JWT token
        
        let userObject = {
            name:  temp_userObject.name,
            email: temp_userObject.email,
            iss: "Google",
            type: null
          };

        
        // Verify Google User's type and status in own DB
        axios.post(`${process.env.REACT_APP_Backend_URL}/api/verifyUser`, { email: userObject.email })
        .then(verifResponse => {
            //console.log("verifResponse", verifResponse.data.user)
            const { type, status, id } = verifResponse.data.user;
            userObject.type = type;
            userObject.status = status;
            userObject.id = id;

            setUser(userObject);
            localStorage.setItem("local_user", JSON.stringify(userObject));

            prop_renderRoutes();    // Render Routes after signin 
            navigate("/customers"); // navigate to the desired route

            // Hide SignIn Button
            const allLoginElement = document.getElementById("allLogin");
            if (allLoginElement) {
                allLoginElement.style.display = "none";
            }
        })
        .catch(error => {
        console.error(error);
        });
        }

    // Function to handle user sign-out
    function handleSignOut(e) {
        window.location.reload(); // Force Tab reload

        console.log("👍handleSignOut")
        localStorage.removeItem("local_user");  // Clear user local storage
        setUser({});                            // Clear user state
        setTokenClient({}); 
    }

    const toggleMenuView = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log("MAIN MENU CLICKED")
        console.log("❓🔨❓isMenuOpen: ",isMenuOpen)
    };

    return (
        <div className="auth-wrapper">
            {!user || Object.keys(user).length === 0 && (
                <div className="allLogin">
                    <div id="googleLogIn" className="google-login" ></div> 
                    <Auth_Form />
                </div>
            )}
            {user && Object.keys(user).length !== 0 && ( 
                <div className="app">
                    <div className="hamburger-menu" title={ !isMenuOpen ? "Show Navigation Bar": "Hide Navigation Bar"} onClick={toggleMenuView}>
                        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                    </div>
                    {isMenuOpen && (
                        <div className="userNav-wrapper">
                            <div className="user-wrapper">
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default OAuth;
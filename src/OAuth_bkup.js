// // OAuth.js --- Didnt work perfectly BUT might generate less errors that the newer version. Need to keep testing it. 
// // Dependencies
// import React, { useEffect, useState, useContext } from "react";
// import axios from 'axios';
// import { Context } from "./Context";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom"; // useNavigate Hook

// // Styles
// import "./styles/main.scss";
// import "./styles/auth.scss";
// // Compiled CSS Styles files
// //import "../apps-script/styles_compiled/main.css";

// // Components
// import Nav from "./components/nav";
// import Auth_Form from "./components/auth_form";
// const SCOPES = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets";

// export const AuthContext = React.createContext();

// function OAuth({ prop_renderRoutes }) {
//     const { user, setUser, setTokenClient } = useContext(Context);
//     //const [tokenClient, setTokenClient] = useState({});
//     const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
//     const navigate = useNavigate();

//     // useEffect hook to handle component initialization and cleanup
//     useEffect(() => {
//         //console.log("CLIENT_ID",CLIENT_ID);
//         const initializeGoogleSignIn = () => {
//             if (window.google && window.google.accounts) {
//                 // Google API is loaded, proceed with initialization
//                 console.log("👍App initialized");
//                 const storedUser = localStorage.getItem("local_user");
//                 if (storedUser) {
//                     setUser(JSON.parse(storedUser));
//                     document.getElementById("googleLogIn").style.display = "none";
//                 } else {
//                     window.google.accounts.id.prompt();
//                 }

//                 window.google.accounts.id.initialize({
//                     client_id: CLIENT_ID,
//                     context: 'signin',
//                     callback: handleCallbackResponse,
//                     cancel_on_tap_outside: false,
//                 });

//                 window.google.accounts.id.renderButton(document.getElementById("googleLogIn"), {
//                     theme: "outline",
//                     size: 'large',
//                     width: 250
//                 });

//             } else {
//                 setTimeout(initializeGoogleSignIn, 100); // Wait and try initializeGoogleSignIn again
//             }
//         };

//         // Initialize the entire process
//         initializeGoogleSignIn();
//     }, []); // The empty dependency array ensures that this effect runs once after the initial render
    
//     function decodeJwtResponse(token) {
//         let base64Url = token.split('.')[1];
//         let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));
//         return JSON.parse(jsonPayload);
//     }

//     // Handle the response from Google Sign-In callback
//     function handleCallbackResponse(response) {
//         console.log("👍HandleSignIn")
//         let userCredentials = response.credential;
//         //let userObject = jwtDecode(userCredentials);          // Alternative 1: Decode the JWT token to get user data
//         let temp_userObject = decodeJwtResponse(userCredentials);    // Alternative 2: To Decode the JWT token
        
//         let userObject = {
//             name:  temp_userObject.name,
//             email: temp_userObject.email,
//             iss: "Google"
//           };

        
//         // Verify Google User's type and status in own DB
//         axios.post(`${process.env.REACT_APP_Backend_URL}/api/verifyUser`, { email: userObject.email })
//         .then(verifResponse => {
//             //console.log("verifResponse", verifResponse.data)
//             const { type, status } = verifResponse.data.user;
//             userObject.type = type;
//             userObject.status = status;

//             // Set user in component state
//             setUser(userObject);
//             localStorage.setItem("local_user", JSON.stringify(userObject));

//             // Render Routes after signin and navigate to the desired route
//             prop_renderRoutes();
//             navigate("/customers");

//             // Hide SignIn Button
//             const allLoginElement = document.getElementById("allLogin");
//             if (allLoginElement) {
//                 allLoginElement.style.display = "none";
//             }
//         })
//         .catch(error => {
//         console.error(error);
//         });
//         }

//     // Function to handle user sign-out
//     function handleSignOut(e) {
//         window.location.reload(); // Force Tab reload

//         console.log("👍handleSignOut")
//         localStorage.removeItem("local_user");  // Clear user local storage
//         setUser({});                            // Clear user state
//         setTokenClient({});
            
//         //navigate("/home");
//         // // Show SignIn Div and Prompt
//         // const allLoginElement = document.getElementById("allLogin");
//         // if (allLoginElement) {
//         //     allLoginElement.style.display = "block";
//         // }
//         // //window.google.accounts.id.prompt();

//         // if (window.google && window.google.accounts) {
//         //     window.google.accounts.id.prompt();
//         // }

//     }

//     // Render the OAuth component
//     return (
//         <div className="auth-wrapper">
//             {!user || Object.keys(user).length === 0 && (
//                 <div className="allLogin">
//                     <div id="googleLogIn" className="google-login" ></div> 
//                     <Auth_Form />
//                 </div>
//             )}
//             {user && Object.keys(user).length !== 0 && (                
//                 <div className="userNav-wrapper">
//                     {/* <input type="submit" onClick={createDriveFile} value="🔴Create File🔴" /> */}
//                     <div className="user-wrapper">
//                         <div className="user-details">
//                             <img className="user-avatar" src={user.picture || "https://use.fontawesome.com/releases/v5.15.4/svgs/solid/user.svg"} alt="User" />
//                             <div className="user-text">
//                                 <h3>{user.name}</h3>
//                                 <p>{user.email}</p>
//                                 <div className="sign-out">
//                                     <button className="sign-out-button" onClick={e => handleSignOut(e)}>Sign Out</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <Nav />
//                 </div>
//             )}
//         </div>
//     );

// }

// export default OAuth;
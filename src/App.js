// src/App.js

// Dependencies
import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

// Styles
import "./styles/main.scss";
// Compiled CSS Styles files
//import "../apps-script/styles_compiled/main.css";

// Components
//import { ContextProvider } from './Context';
import OAuth from "./OAuth";
import Crm from "./components/crm";
import Home from "./components/home";
import Customers from "./components/customers";
import Download from "./actions/download";
import Inventory from "./components/inventory";
import AppUsers from "./components/appusers";
import Tutorials from "./components/tutorials";
import Footer from "./components/footer";


import { Context } from "./Context";

//const PORT = process.env.REACT_APP_BACKEND_PORT || 5000;

function App() {
  const { user, setUser } = useContext(Context)
  //const [data, setData] = useState([]);
  //const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("local_user"));
    if (storedUser) {
      setUser(storedUser);
    }

    //allGetRequests()
  }, [setUser]);

  useEffect(() => {
    allGetRequests()
  }, []);

  const allGetRequests = () => {
    // All API Fetch Requests from SQL Backend
    const url = process.env.REACT_APP_Backend_URL;
    axios.get(`${url}/api/users`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_users")//, response.data)
      }).catch(error => {
        console.error("App ❌get_users", error);
      });

      axios.get(`${url}/api/companies`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_companies")//, response.data)
      }).catch(error => {
        console.error("App ❌get_companies", error);
      });

      axios.get(`${url}/api/contacts`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_contacts")//, response.data)
      }).catch(error => {
        console.error("App ❌get_contacts", error);
      });

      axios.get(`${url}/api/orders`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_orders")//, response.data)
      }).catch(error => {
        console.error("App ❌get_orders", error);
      });

      axios.get(`${url}/api/items`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_items")//, response.data)
      }).catch(error => {
        console.error("App ❌get_items", error);
      });

      axios.get(`${url}/api/intCompanyUser`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_intCompanyUser")//, response.data)
      }).catch(error => {
        console.error("App ❌get_intCompanyUser", error);
      });

      axios.get(`${url}/api/intOrderItem`)
      .then(response => {
        //setData(response.data);
        //console.log("App 👍get_intOrderItem")//, response.data)
      }).catch(error => {
        console.error("App ❌get_intOrderItem", error);
      });
  }

  const renderRoutes = () => {
    const storedUser = localStorage.getItem("local_user");
    console.log("User", user)
    //console.log("User.Name", user.name)
    console.log("storedUser", storedUser)

    if (user && user.name || storedUser) {
      // console.log("App.js ENABLED renderRoutes()")
      // User is signed in, render all routes
      if (user.type === "admin" && user.status === "active") {   
        return (
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Crm />} />
            <Route path="crm" element={<Crm />} />
            <Route path="customers" element={<Customers />} />
            <Route path="home" element={<Home />} />
            <Route path="download" element={<Download />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="appusers" element={<AppUsers />} />
            <Route path="tutorials" element={<Tutorials />} />
            <Route path="*" element={<Navigate to="/crm" />} />
          </Routes>
        );
      } else if (user.type === "usuario" && user.status === "active") {
        return (
          <Routes>
            <Route path="/" element={<Crm />} />
            <Route path="crm" element={<Crm />} />
            <Route path="tutorials" element={<Tutorials />} />
            <Route path="*" element={<Navigate to="/crm" />} />
          </Routes>
        );
      } else {
        <Routes>
          <Route path="/" element={<Home />} />  
          <Route path="*" element={<Navigate to="/" />} />
        </Routes> 
      }
    
    } else {
      // User is not signed in, render only the home route
      console.log("App.js DISABLED renderRoutes()")
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes> 
      )
    }
  };

  return (
    <div className="app-wrapper">
        <OAuth prop_renderRoutes={renderRoutes} />
        {renderRoutes()}
    <Footer />
    </div>
  );
}

export default App;

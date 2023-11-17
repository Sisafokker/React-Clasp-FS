// App.js

// Dependencies
import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

// Styles
import "./styles/main.scss";

// Components
import { ContextProvider } from './Context';
import OAuth from "./OAuth";
import Home from "./components/home";
import Customers from "./components/customers";
import POs from "./components/pos";
import Inventory from "./components/inventory";
import AppUsers from "./components/appusers";
import Tutorials from "./components/tutorials";
import { Context } from "./Context";

//const PORT = process.env.REACT_APP_BACKEND_PORT || 5000;

function App() {
  const { user, setUser } = useContext(Context)
  const [data, setData] = useState([]);
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
        setData(response.data);
        console.log("👍get_users")//, response.data)
      })
      .catch(error => {
        console.error("❌get_users", error);
      });

      // axios.get(`${url}/api/companies`)
      // .then(response => {
      //   setData(response.data);
      //   console.log("👍get_companies")//, response.data)
      // })
      // .catch(error => {
      //   console.error("❌get_companies", error);
      // });

      // axios.get(`${url}/api/contacts`)
      // .then(response => {
      //   setData(response.data);
      //   console.log("👍get_contacts")//, response.data)
      // })
      // .catch(error => {
      //   console.error("❌get_contacts", error);
      // });
  }

  const renderRoutes = () => {
    const storedUser = localStorage.getItem("local_user");
    console.log("User", user)
    console.log("User.Name", user.name)
    console.log("storedUser", storedUser)

    if (user && user.name || storedUser) {
      console.log("renderRoutes(): ENABLED")
      // User is signed in, render all routes
      return (
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Customers />} />
          <Route path="customers" element={<Customers />} />
          <Route path="home" element={<Home />} />
          <Route path="pos" element={<POs />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="appusers" element={<AppUsers />} />
          <Route path="tutorials" element={<Tutorials />} />
          <Route path="*" element={<Navigate to="/customers" />} />
        </Routes>
      );
    } else {
      // User is not signed in, render only the home route
      console.log("renderRoutes(): DISABLED")
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )
    }
  };

  return (
    <div className="container">
        <OAuth prop_renderRoutes={renderRoutes} />
        {renderRoutes()}
    </div>
  );
}

export default App;

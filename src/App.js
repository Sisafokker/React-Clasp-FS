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

//const PORT = process.env.REACT_APP_PORT || 3001;

function App() {
  const context = useContext(Context) || { user: {}, setUser: () => {} };
  const { user } = context;
  const [data, setData] = useState([]);
  //const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    allGetRequests()
  }, []);

  const allGetRequests = () => {
    // All API Fetch Requests from SQL Backend
    axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/users`)
      .then(response => {
        setData(response.data);
        console.log("👍get_users")//, response.data)
      })
      .catch(error => {
        console.error("❌get_users", error);
      });

      axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/companies`)
      .then(response => {
        setData(response.data);
        console.log("👍get_companies")//, response.data)
      })
      .catch(error => {
        console.error("❌get_companies", error);
      });

      axios.get(`http://localhost:${process.env.REACT_APP_PORT}/api/contacts`)
      .then(response => {
        setData(response.data);
        console.log("👍get_contacts")//, response.data)
      })
      .catch(error => {
        console.error("❌get_contacts", error);
      });
  }

  const renderRoutes = () => {
    const storedUser = localStorage.getItem("local_user");
    if (user && user.name != "" && storedUser ) {
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
      return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )
    }
  };

  return (
    <ContextProvider>
    <div className="container">
        <OAuth prop_renderRoutes={renderRoutes} />
        {renderRoutes()}
    </div>
    </ContextProvider>
  );
}

export default App;

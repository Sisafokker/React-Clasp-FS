// Dependencies
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useState, useEffect } from 'react';
import axios from 'axios';

// Styles
import "./styles/main.scss";

// Components
import OAuth from "./OAuth";
import Home from "./components/home";
import Customers from "./components/customers";
import POs from "./components/pos";
import Inventory from "./components/inventory";
import AppUsers from "./components/appusers";
import Tutorials from "./components/tutorials";

const PORT = process.env.REACT_APP_PORT || 3001;

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    allGetRequests()
  }, []);

  const allGetRequests = () => {
    // All API Fetch Requests from SQL Backend
    axios.get(`http://localhost:${PORT}/api/students`)
      .then(response => {
        setData(response.data);
        console.log("👍students")//, response.data)
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`http://localhost:${PORT}/api/professors`)
      .then(response => {
        setData(response.data);
        console.log("👍professors")//, response.data)
      })
      .catch(error => {
        console.error(error);
      });

    axios.get(`http://localhost:${PORT}/api/courses`)
      .then(response => {
        setData(response.data);
        console.log("👍courses")//, response.data)
      })
      .catch(error => {
        console.error(error);
      });
  }


  return (
    <div className="container">
      <OAuth />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="customers" element={<Customers />} />
        <Route path="pos" element={<POs />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="appusers" element={<AppUsers />} />
        <Route path="tutorials" element={<Tutorials />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </div>
  );
}

export default App;

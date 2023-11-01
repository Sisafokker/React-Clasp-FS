// Dependencies
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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


function App() {
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
                <Route path="*" element={<Navigate to="/"/>} />
            </Routes>

        </div>
    );
}

export default App;

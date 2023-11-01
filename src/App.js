// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// Styles
import "./styles/main.scss";

// Components
import OAuth from "./OAuth";
import Home from "./components/home";
import About from "./components/about";
import Actions from "./components/actions";
import Tutorials from "./components/tutorials";


function App() {
    return (
        <div className="container">
            <OAuth />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="actions" element={<Actions />} />
                <Route path="tutorials" element={<Tutorials />} />
                <Route path="*" element={<Home />} />
            </Routes>

        </div>
    );
}

export default App;

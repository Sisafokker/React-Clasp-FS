// Dependencies
import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import OAuth from "./OAuth";
import Home from "./components/home";
import About from "./components/about";


function App() {
    return (
        <div>
            <OAuth />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<Home />} />
            </Routes>

        </div>
    );
}

export default App;

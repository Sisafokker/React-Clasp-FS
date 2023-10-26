import { Routes, Route } from "react-router-dom"
import Nav from "./components/nav"
import Home from "./components/home"
import About from "./components/about"

function App() {
    return <div>
       <Nav />
       <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="about" element={<About />} />
            <Route path="*" element={<Home />} />
       </Routes>
    </div>
}

export default App
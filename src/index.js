import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
//require('dotenv').config(); // Needed for process.env to work outside of react.
import App from "./App";

const container = document.getElementById("app");
const root = createRoot(container)

root.render(<App />);

root.render( <BrowserRouter> 
                <App />
            </BrowserRouter>
    );


// const app = document.getElementById("app");
// ReactDOM.render(<BrowserRouter> <App /> </BrowserRouter>, app)


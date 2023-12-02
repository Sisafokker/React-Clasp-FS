import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ContextProvider } from './Context';

const container = document.getElementById("app");
const root = createRoot(container)

root.render(<App />);

root.render( 
    <ContextProvider>
        <BrowserRouter> 
                <App />
            </BrowserRouter>
    </ContextProvider>,
    );

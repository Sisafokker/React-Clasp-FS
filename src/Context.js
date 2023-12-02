// Context.js GLOBAL States passed among all components.
import React, { useState } from "react";
 
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [user, setUser, setTokenClient] = useState({});

    return (
        <Context.Provider value={ { user, setUser, setTokenClient } }>
            {children}
        </Context.Provider>
    );
};
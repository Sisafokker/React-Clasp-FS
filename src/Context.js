// Context.js GLOBAL States passed among all components.
import React, { useState } from "react";
 
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [tokenClient, setTokenClient] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <Context.Provider value={ { user, setUser, setTokenClient, isMenuOpen, setIsMenuOpen } }>
            {children}
        </Context.Provider>
    );
};
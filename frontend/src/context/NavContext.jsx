import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const NavBarContext = createContext();

export const NavBarProvider = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);

    return (
        <NavBarContext.Provider value={[navOpen, setNavOpen]}>
            {children}
        </NavBarContext.Provider>
    );
};
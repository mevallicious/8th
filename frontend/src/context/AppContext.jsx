import { createContext, useState, useContext } from "react";
import productsData from "../data/products";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currIndex, setCurrIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <AppContext.Provider value={{ 
      products: productsData, 
      currIndex, setCurrIndex, 
      isPreviewOpen, setIsPreviewOpen 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
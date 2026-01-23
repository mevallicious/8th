import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import { AppProvider } from "./context/AppContext";


// 🔥 Styles sabse pehle import kar (Zaroori hai)
import "./style.css"; 

// Global Components


// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <AppProvider>
          <Router>
           
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>

          </Router>

      </AppProvider>
    </ReactLenis>
  );
}

export default App;
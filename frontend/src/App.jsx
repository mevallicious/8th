import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import { AppProvider } from "./context/AppContext";
import { CartProvider } from "./context/CartContext";
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import "./style.css"; 
// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./components/Cart";

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <AppProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path='/signin' element={<SignUp/>} />
              <Route path='/login' element={<Login/>}/>
              <Route path='/orders' element={<Login/>}/>
              <Route path="/product/:productId" element={<ProductDetails/>} />
              <Route path="/cart" element={<Cart/>} />
            </Routes>
          </Router>
        </CartProvider>
      </AppProvider>
    </ReactLenis>
  );
}

export default App;
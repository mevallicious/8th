import {React,useContext} from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/Navbar.css";

const NavBar = () => {

  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  return (
    <nav className="model-nav">
      {/* LOGO */}
      <div className="nav-logo">
        <NavLink to="/" className="logo-text">
          Pure Rush
        </NavLink>
      </div>

      {/* CENTER LINKS */}
      <div className="nav-center glass">
        <NavLink to="/" className="nav-pill">
          Home
        </NavLink>
        <NavLink to="/shop" className="nav-pill">
          Product
        </NavLink>
        <NavLink to="/contact" className="nav-pill">
          Contact
        </NavLink>
        <NavLink to="/about" className="nav-pill">
          About
        </NavLink>
        <NavLink to="/orders" className="nav-pill">
          Order
        </NavLink>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="nav-actions">
        <NavLink to="/signin" className="sign-in-btn">
          Sign in
        </NavLink>
        <button className="cart-btn" onClick={() => navigate('/cart')} style={{position: 'relative'}}>
          🛒
          {/* Only show badge if there are items */}
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

    import React, { useState, useContext } from "react";
    import { Link } from "react-router-dom";
    import { CartContext } from "../context/CartContext";
    import NavBar from "./Navbar";
    import CheckoutModel from "./CheckOutModel";// Make sure this matches your exact filename!
    import "../styles/Cart.css";

    const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useContext(CartContext);
    
    // 1. ADDED STATE TO CONTROL THE MODAL
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <div className="cart-page-wrapper">
        <NavBar /> 
        <div className="cart-container">
            
            {/* --- CHECK IF CART IS EMPTY --- */}
            {cartItems.length === 0 ? (
            
            <div className="empty-cart-view">
                <h1>Your cart is empty</h1>
                <Link to="/shop" className="btn-continue-shopping">
                Continue shopping
                </Link>
            </div>

            ) : (
            
            /* --- FILLED CART STATE --- */
            <>
                <div className="cart-header">
                <h1>Your cart</h1>
                <Link to="/shop" className="continue-shopping-link">Continue shopping</Link>
                </div>

                <div className="cart-table-labels">
                <span className="label-product">PRODUCT</span>
                <span className="label-quantity">QUANTITY</span>
                <span className="label-total">TOTAL</span>
                </div>

                <div className="cart-items">
                {cartItems.map((item, index) => (
                    <div className="cart-item" key={index}>
                    
                    {/* Product Details */}
                    <div className="item-details">
                        <img src={item.img} alt={item.name} />
                        <div className="item-info">
                        <p className="item-brand">STUDIO LIV</p>
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price">Rs. {item.price.toLocaleString("en-IN")}.00</p>
                        <p className="item-finish">Finish: {item.finish}</p>
                        </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="item-quantity">
                        <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.name, item.finish, -1)}>−</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => updateQuantity(item.name, item.finish, 1)}>+</button>
                        </div>
                        <button className="delete-btn" onClick={() => removeFromCart(item.name, item.finish)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        </button>
                    </div>

                    {/* Row Total */}
                    <div className="item-total">
                        <p>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}.00</p>
                    </div>

                    </div>
                ))}
                </div>

                {/* Cart Footer */}
                <div className="cart-footer">
                <div className="special-instructions">
                    <p>Order special instructions</p>
                    <textarea rows="4"></textarea>
                </div>

                <div className="cart-summary">
                    <div className="subtotal">
                    <span className="subtotal-label">Estimated total</span>
                    <span className="subtotal-amount">Rs. {cartTotal.toLocaleString("en-IN")}.00</span>
                    </div>
                    <p className="tax-shipping">
                    Tax included. <a href="#">Shipping</a> and discounts calculated at checkout.
                    </p>
                    
                    {/* 2. ADDED onClick TO OPEN THE MODAL */}
                    <button className="checkout-btn" onClick={() => setIsCheckoutOpen(true)}>
                    Check out
                    </button>
                </div>
                </div>
            </>
            )}
        </div>

        {/* 3. DROPPED THE MODAL COMPONENT AT THE BOTTOM */}
        <CheckoutModel 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            items={cartItems} 
            initialTotal={cartTotal}
        />
        
        </div>
    );
    };

    export default Cart;
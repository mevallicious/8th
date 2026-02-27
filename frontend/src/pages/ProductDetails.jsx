import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useParams, useNavigate } from "react-router-dom"; // ADDED useNavigate
import products from "../data/products"; 
import NavBar from "../components/Navbar"; 
import "../styles/ProductDetails.css";
import CheckoutModel from "../components/CheckOutModel";

    const ProductDetails = () => {
    const { productId } = useParams(); 
    const navigate = useNavigate(); // Hook for routing
    const [product, setProduct] = useState(null);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    
    const [selectedFinish, setSelectedFinish] = useState("Natural Oak");
    const [quantity, setQuantity] = useState(1);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    // State for our new detailed popup
    const [showPopup, setShowPopup] = useState(false);

    // Grab addToCart AND cartCount from context!
    const { addToCart, cartCount } = useContext(CartContext);

    useEffect(() => {
        const foundProduct = products.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === productId
        );
        setProduct(foundProduct);
        setIsGuideOpen(false); 
        setShowPopup(false); // Reset popup if URL changes
    }, [productId]);

    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    const increaseQuantity = () => setQuantity(prev => prev + 1);

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedFinish);
        setShowPopup(true); // Open the detailed popup
        
        // Optional: Auto-close after 5 seconds
        setTimeout(() => {
        setShowPopup(false);
        }, 5000);
    };

    if (!product) return <div className="loading" style={{color: "white", padding: "100px"}}>Loading product...</div>;

    const finishes = ["Natural Oak", "Dark Walnut", "Matte Black"];

    return (
        <div className="product-page-wrapper">
        <NavBar />
        
        <div className="product-container">
            {/* LEFT SIDE: Info */}
            <div className="product-info">
            <p className="brand-name">PURE RUSH STUDIO</p> 
            <h1 className="product-title">{product.name}</h1>
            
            <p className="product-price">
                Rs. {product.price.toLocaleString('en-IN')}.00
            </p>
            <p className="tax-info">
                Tax included. <a href="#">White-glove delivery</a> calculated at checkout.
            </p>

            <div className="selector-section">
                <p className="section-label">Wood Finish</p>
                <div className="size-buttons">
                {finishes.map((finish) => (
                    <button
                    key={finish}
                    className={`size-btn ${selectedFinish === finish ? "active" : ""}`}
                    onClick={() => setSelectedFinish(finish)}
                    >
                    {finish}
                    </button>
                ))}
                </div>
            </div>

            <div className="size-guide">
                <div className="size-guide-content" onClick={() => setIsGuideOpen(!isGuideOpen)}>
                <span>📏 Dimensions & Materials</span>
                <span className="arrow">{isGuideOpen ? "⌃" : "⌄"}</span> 
                </div>
                
                {isGuideOpen && (
                <div style={{ paddingBottom: "20px", color: "#a0a0a0", fontSize: "0.9rem", lineHeight: "1.6" }}>
                    <p><strong>Dimensions:</strong> {product.dimensions}</p>
                    <p style={{ marginTop: "10px" }}><strong>Material:</strong> {product.material}</p>
                </div>
                )}
            </div>

            <div className="selector-section">
                <p className="section-label">Quantity</p>
                <div className="quantity-controls">
                <button onClick={decreaseQuantity}>−</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={increaseQuantity}>+</button>
                </div>
            </div>

            <div className="action-buttons">
                <button className="btn-add-cart" onClick={handleAddToCart}>
                Add to cart
                </button>
                <button className="btn-buy-now" onClick={() => setIsCheckoutOpen(true)}>
                Buy it now
                </button>
            </div>
            
            <p style={{marginTop: "20px", fontSize: "0.8rem", color: "#888"}}>
                🛋️ Usually ships in 3-5 business days.
            </p>
            </div>

            {/* RIGHT SIDE: Image */}
            <div className="product-image">
            <img src={product.img} alt={product.name} />
            </div>
        </div>

        {/* --- NEW DETAILED CART POPUP --- */}
        <div className={`cart-popup-overlay ${showPopup ? "show" : ""}`}>
            <div className="cart-popup-modal">
            
            {/* Header */}
            <div className="cart-popup-header">
                <div className="success-message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Item added to your cart</span>
                </div>
                <button className="close-popup-btn" onClick={() => setShowPopup(false)}>✕</button>
            </div>

            {/* Product Info */}
            <div className="cart-popup-product">
                <img src={product.img} alt={product.name} />
                <div className="popup-item-details">
                <p className="popup-brand">PURE RUSH STUDIO</p>
                <h4 className="popup-name">{product.name}</h4>
                <p className="popup-variant">Finish: {selectedFinish}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="cart-popup-actions">
                <button className="btn-view-cart" onClick={() => navigate('/cart')}>
                View cart ({cartCount})
                </button>
                <button className="btn-continue-shopping" onClick={() => setShowPopup(false)}>
                Continue shopping
                </button>
            </div>

            </div>
        </div>

        <CheckoutModel 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            // We pass the current single item since they clicked "Buy it now"
            items={[{ ...product, quantity, finish: selectedFinish }]} 
            initialTotal={product.price * quantity}
        />
        </div>
    );
    };

    export default ProductDetails;
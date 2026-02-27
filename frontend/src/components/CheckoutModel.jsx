    import React, { useState } from "react";
    import "../styles/CheckoutModel.css";

    const CheckoutModel = ({ isOpen, onClose, items, initialTotal }) => {
    const [showCouponPanel, setShowCouponPanel] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState("");

    if (!isOpen) return null;

    // Available dummy coupons
    const availableCoupons = [
        { code: "UN10", description: "10% OFF ON ENTIRE ORDER", type: "percent", value: 10, title: "FLAT 10% OFF" },]

    const handleApplyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
        setShowCouponPanel(false); // Close panel after applying
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
    };

    // Calculate Discount
    const discountAmount = appliedCoupon 
        ? appliedCoupon.type === "percent" 
            ? Math.round((initialTotal * appliedCoupon.value) / 100) 
            : appliedCoupon.value
        : 0;

    const finalTotal = initialTotal - discountAmount;


    return (
        <div className="co-modal-overlay">
        <div className="co-modal-content">
            
            {/* === LEFT PANEL (ORDER SUMMARY OR COUPON PANEL) === */}
            <div className="co-left-panel">
            
            {!showCouponPanel ? (
                // --- ORDER SUMMARY VIEW ---
                <div className="co-summary-view">
                <div className="co-summary-header">
                    <h2>Order Summary</h2>
                    <span>🛍️</span>
                </div>
                
                <div className="co-item-list">
                    {items.map((item, index) => (
                    <div className="co-item" key={index}>
                        <img src={item.img} alt={item.name} />
                        <div className="co-item-info">
                        <p className="co-item-name">{item.name} - {item.finish || "Standard"}</p>
                        <div className="co-item-price-qty">
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: ₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="co-totals">
                    <div className="co-total-row">
                    <span>Subtotal</span>
                    <span>₹{initialTotal.toLocaleString("en-IN")}.00</span>
                    </div>
                    <div className="co-total-row">
                    <span>Shipping</span>
                    <span>To be calculated</span>
                    </div>
                    {appliedCoupon && (
                    <div className="co-total-row discount-row">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}.00</span>
                    </div>
                    )}
                    <div className="co-total-row final-total">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}.00</span>
                    </div>
                </div>

                {/* COUPON SECTION */}
                <div className="co-coupon-section">
                    {appliedCoupon ? (
                    <div className="co-applied-coupon">
                        <div className="co-applied-left">
                        <span className="co-tag-icon">%</span>
                        <span className="co-applied-code">'{appliedCoupon.code}' applied</span>
                        </div>
                        <button className="co-remove-btn" onClick={handleRemoveCoupon}>Remove</button>
                    </div>
                    ) : null}

                    <button 
                    className="co-apply-coupon-btn" 
                    onClick={() => setShowCouponPanel(true)}
                    >
                    <span className="co-tag-icon">%</span> Apply Coupon
                    </button>
                </div>
                </div>
            ) : (
                // --- APPLY COUPON VIEW ---
                <div className="co-coupon-view">
                <div className="co-coupon-header">
                    <h2>Apply Coupon</h2>
                    <button className="co-close-panel" onClick={() => setShowCouponPanel(false)}>✕</button>
                </div>
                
                <div className="co-coupon-input-group">
                    <span className="co-tag-icon">%</span>
                    <input 
                    type="text" 
                    placeholder="Enter Discount Code" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    />
                    <button className="co-apply-text-btn">Apply</button>
                </div>

                <div className="co-available-coupons">
                    {availableCoupons.map((coupon, idx) => (
                    <div className="co-coupon-card" key={idx}>
                        <div className="co-coupon-card-header">{coupon.title}</div>
                        <div className="co-coupon-card-body">
                        <div className="co-coupon-code-row">
                            <span className="co-coupon-code">{coupon.code}</span>
                            <button onClick={() => handleApplyCoupon(coupon)}>APPLY</button>
                        </div>
                        <p className="co-coupon-desc">{coupon.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </div>

            {/* === RIGHT PANEL (CONTACT / CHECKOUT FLOW) === */}
            <div className="co-right-panel">
            <button className="co-close-modal" onClick={onClose}>✕</button>
            
            <div className="co-right-header">
                <h1 className="co-logo">STUDIO LIV </h1>
                
                <div className="co-progress-bar">
                <div className="co-step active">1. Contact</div>
                <div className="co-step">2. Address</div>
                <div className="co-step">3. Payment</div>
                </div>
                <div className="co-progress-line">
                <div className="co-progress-fill"></div>
                </div>
            </div>

            <div className="co-checkout-form">
                <h2>Enter Mobile Number</h2>
                <div className="co-mobile-input">
                <span className="co-country-code">+91</span>
                <input type="tel" placeholder="Mobile Number" />
                </div>
                <label className="co-checkbox-label">
                <input type="checkbox" defaultChecked />
                Send me order updates and offers
                </label>
                <button className="co-get-otp-btn">Get OTP &rarr;</button>
            </div>

            </div>

        </div>
        </div>
    );
    };

    export default CheckoutModel;
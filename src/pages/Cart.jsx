import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const [processing, setProcessing] = useState(false);
    const [removingItem, setRemovingItem] = useState(null);
    const navigate = useNavigate();

    // Color palette matching the design system
    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B',
        success: '#10b981',
        error: '#ef4444'
    };

    // Shared container style
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    // Calculate cart totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping + tax;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > 10) return; // Max 10 items
        updateQuantity(item.id, newQuantity);
    };

    const handleRemoveItem = async (item) => {
        setRemovingItem(item.id);
        // Simulate async removal for animation
        setTimeout(() => {
            removeFromCart(item.id);
            setRemovingItem(null);
        }, 300);
    };

    const handleCheckout = () => {
        setProcessing(true);
        // Simulate checkout process
        setTimeout(() => {
            setProcessing(false);
            navigate('/checkout');
        }, 1000);
    };

    // Loading/Processing State
    if (processing) {
        return (
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                padding: '40px 20px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: `2px solid ${colors.grayMedium}`,
                        borderTopColor: colors.text,
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />

                    <div>
                        <p style={{
                            color: colors.text,
                            fontSize: '16px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            margin: '0 0 8px 0',
                            fontWeight: '400'
                        }}>
                            Processing
                        </p>
                        <p style={{
                            color: colors.grayText,
                            fontSize: '14px',
                            margin: 0,
                            fontWeight: '300'
                        }}>
                            Preparing your checkout
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '100vh',
            padding: '60px 0 100px 0'
        }}>
            <div style={containerStyle}>
                {/* Header */}
                <div style={{
                    marginBottom: '40px',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '60px',
                        height: '1px',
                        backgroundColor: colors.grayMedium,
                        margin: '0 auto 25px auto'
                    }} />

                    <h1 style={{
                        fontSize: 'clamp(32px, 5vw, 42px)',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 12px 0',
                        color: colors.text
                    }}>
                        Your Cart
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: colors.grayText,
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        {cart.length === 0
                            ? "Your cart is empty"
                            : `You have ${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`
                        }
                    </p>
                </div>

                {/* Cart Content */}
                {cart.length === 0 ? (
                    // Empty Cart State
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        backgroundColor: colors.grayLight,
                        borderRadius: '4px',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        <span style={{
                            fontSize: '72px',
                            display: 'block',
                            marginBottom: '24px',
                            opacity: 0.3,
                            color: colors.text
                        }}>
                            🛒
                        </span>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 16px 0',
                            color: colors.text
                        }}>
                            Your Cart is Empty
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: colors.grayText,
                            margin: '0 0 32px 0',
                            lineHeight: 1.6
                        }}>
                            Looks like you haven't added anything to your cart yet. Explore our collection to find something special.
                        </p>
                        <Link to="/products">
                            <button style={{
                                backgroundColor: colors.text,
                                color: colors.background,
                                border: `1px solid ${colors.text}`,
                                padding: '14px 42px',
                                fontSize: '14px',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = colors.background;
                                    e.target.style.color = colors.text;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = colors.text;
                                    e.target.style.color = colors.background;
                                }}
                            >
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                ) : (
                    // Cart with Items
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 380px',
                        gap: '40px',
                        alignItems: 'start'
                    }}>
                        {/* Cart Items */}
                        <div>
                            {/* Cart Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr auto',
                                gap: '20px',
                                padding: '0 0 15px 0',
                                borderBottom: `1px solid ${colors.grayLight}`,
                                color: colors.grayText,
                                fontSize: '13px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                marginBottom: '20px'
                            }}>
                                <span>Product</span>
                                <span style={{ textAlign: 'center' }}>Quantity</span>
                                <span style={{ textAlign: 'right' }}>Price</span>
                                <span style={{ width: '40px' }}></span>
                            </div>

                            {/* Cart Items List */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                marginBottom: '30px'
                            }}>
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 1fr auto',
                                            gap: '20px',
                                            alignItems: 'center',
                                            padding: '20px',
                                            backgroundColor: colors.grayLight,
                                            opacity: removingItem === item.id ? 0.5 : 1,
                                            transition: 'opacity 0.3s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Product Info */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            alignItems: 'center'
                                        }}>
                                            {/* Product Image Placeholder */}
                                            <div style={{
                                                width: '80px',
                                                height: '100px',
                                                backgroundColor: colors.grayMedium,
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                {item.image && (
                                                    <img
                                                        src={`http://localhost:5000/uploads/products/${item.image}`}
                                                        alt={item.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <Link
                                                    to={`/product/${item.id}`}
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: '500',
                                                        color: colors.text,
                                                        textDecoration: 'none',
                                                        marginBottom: '4px',
                                                        display: 'block'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.color = colors.grayText}
                                                    onMouseLeave={(e) => e.target.style.color = colors.text}
                                                >
                                                    {item.name}
                                                </Link>
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: colors.grayText,
                                                    margin: 0
                                                }}>
                                                    {item.category || 'Elegant Piece'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            <button
                                                onClick={() => handleQuantityChange(item, (item.quantity || 1) - 1)}
                                                disabled={item.quantity <= 1}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: 'transparent',
                                                    border: `1px solid ${colors.grayMedium}`,
                                                    cursor: item.quantity <= 1 ? 'default' : 'pointer',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: item.quantity <= 1 ? 0.5 : 1,
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (item.quantity > 1) {
                                                        e.target.style.backgroundColor = colors.grayLight;
                                                        e.target.style.borderColor = colors.text;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (item.quantity > 1) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.borderColor = colors.grayMedium;
                                                    }
                                                }}
                                            >
                                                −
                                            </button>

                                            <span style={{
                                                minWidth: '30px',
                                                textAlign: 'center',
                                                fontSize: '15px'
                                            }}>
                                                {item.quantity || 1}
                                            </span>

                                            <button
                                                onClick={() => handleQuantityChange(item, (item.quantity || 1) + 1)}
                                                disabled={item.quantity >= 10}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    backgroundColor: 'transparent',
                                                    border: `1px solid ${colors.grayMedium}`,
                                                    cursor: item.quantity >= 10 ? 'default' : 'pointer',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: item.quantity >= 10 ? 0.5 : 1,
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (item.quantity < 10) {
                                                        e.target.style.backgroundColor = colors.grayLight;
                                                        e.target.style.borderColor = colors.text;
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (item.quantity < 10) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.borderColor = colors.grayMedium;
                                                    }
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div style={{
                                            textAlign: 'right',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            color: colors.text
                                        }}>
                                            {formatCurrency(item.price * (item.quantity || 1))}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            disabled={removingItem === item.id}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                backgroundColor: 'transparent',
                                                border: `1px solid ${colors.grayLight}`,
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                color: colors.grayText,
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = colors.error;
                                                e.target.style.color = colors.background;
                                                e.target.style.borderColor = colors.error;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = colors.grayText;
                                                e.target.style.borderColor = colors.grayLight;
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Shopping Link */}
                            <Link
                                to="/products"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: colors.grayText,
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = colors.text}
                                onMouseLeave={(e) => e.target.style.color = colors.grayText}
                            >
                                ← Continue Shopping
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div style={{
                            backgroundColor: colors.grayLight,
                            padding: '30px',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '400',
                                fontFamily: '"Times New Roman", serif',
                                margin: '0 0 25px 0',
                                paddingBottom: '15px',
                                borderBottom: `1px solid ${colors.grayMedium}`
                            }}>
                                Order Summary
                            </h2>

                            {/* Summary Details */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                marginBottom: '25px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '15px',
                                    color: colors.grayText
                                }}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '15px',
                                    color: colors.grayText
                                }}>
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                                </div>

                                {shipping > 0 && (
                                    <p style={{
                                        fontSize: '12px',
                                        color: colors.grayText,
                                        margin: '-5px 0 0 0'
                                    }}>
                                        Free shipping on orders over $100
                                    </p>
                                )}

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '15px',
                                    color: colors.grayText
                                }}>
                                    <span>Estimated Tax</span>
                                    <span>{formatCurrency(tax)}</span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    color: colors.text,
                                    paddingTop: '15px',
                                    marginTop: '10px',
                                    borderTop: `1px solid ${colors.grayMedium}`
                                }}>
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div style={{
                                marginBottom: '25px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        style={{
                                            flex: 1,
                                            padding: '12px 15px',
                                            border: `1px solid ${colors.grayMedium}`,
                                            backgroundColor: colors.background,
                                            fontSize: '14px',
                                            transition: 'border-color 0.3s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = colors.text}
                                        onBlur={(e) => e.target.style.borderColor = colors.grayMedium}
                                    />
                                    <button style={{
                                        padding: '12px 20px',
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${colors.text}`,
                                        color: colors.text,
                                        fontSize: '13px',
                                        letterSpacing: '1px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = colors.text;
                                            e.target.style.color = colors.background;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = colors.text;
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                style={{
                                    width: '100%',
                                    backgroundColor: colors.text,
                                    color: colors.background,
                                    border: `1px solid ${colors.text}`,
                                    padding: '16px 24px',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    marginBottom: '15px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = colors.background;
                                    e.target.style.color = colors.text;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = colors.text;
                                    e.target.style.color = colors.background;
                                }}
                            >
                                Proceed to Checkout
                            </button>

                            {/* Payment Methods */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '15px',
                                padding: '15px 0 0 0',
                                borderTop: `1px solid ${colors.grayMedium}`
                            }}>
                                <span style={{ fontSize: '20px' }}>💳</span>
                                <span style={{ fontSize: '20px' }}>📱</span>
                                <span style={{ fontSize: '20px' }}>💵</span>
                                <span style={{ fontSize: '20px' }}>🛡️</span>
                            </div>

                            <p style={{
                                fontSize: '12px',
                                color: colors.grayText,
                                textAlign: 'center',
                                margin: '15px 0 0 0'
                            }}>
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @media (max-width: 968px) {
                    div[style*="grid-template-columns: 1fr 380px"] {
                        grid-template-columns: 1fr !important;
                    }
                    
                    div[style*="position: sticky"] {
                        position: static !important;
                        margin-top: 40px;
                    }
                }
                
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 2fr 1fr 1fr auto"] {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }
                    
                    div[style*="display: grid; gap: 20px; align-items: center;"] {
                        display: flex !important;
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    div[style*="display: flex; gap: 15px; align-items: center;"] {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    div[style*="justify-content: center; gap: 8px;"] {
                        justify-content: center;
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: 60px 0 100px 0"] {
                        padding: 40px 0 60px 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
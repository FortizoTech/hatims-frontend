import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/assetMapper";
import { API_BASE_URL } from "../api/api";

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Color palette matching the overall design
    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B'
    };

    // Construct image URL with premium fallback
    const imageUrl = product?.image
        ? `${API_BASE_URL}/uploads/products/${product.image}`
        : getProductImage(product?.id || 0);

    const productName = product?.name || "Untitled";
    const productPrice = product?.price ? `$${product.price}` : "Price upon request";
    const productTag = product?.category || "New Arrival";

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Prevent Link navigation
        setIsAdding(true);

        try {
            await addToCart(product);

            // Visual feedback
            setTimeout(() => {
                setIsAdding(false);
            }, 1000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
        }
    };

    return (
        <div style={{
            position: 'relative',
            backgroundColor: colors.background,
            transition: 'transform 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
            }}>

            {/* Product Tag */}
            <span style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: colors.accent,
                color: colors.text,
                padding: '6px 14px',
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                zIndex: 10,
                fontWeight: '400',
                pointerEvents: 'none' // Allows clicks to pass through to Link
            }}>
                {productTag}
            </span>

            {/* Image Container - Links to product detail */}
            <Link
                to={`/product/${product.id}`}
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: colors.grayLight,
                    aspectRatio: '4/5',
                    width: '100%'
                }}>
                    {/* Loading Placeholder */}
                    {!imageLoaded && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: colors.grayLight,
                            zIndex: 2
                        }}>
                            <div style={{
                                width: '30px',
                                height: '30px',
                                border: `2px solid ${colors.grayMedium}`,
                                borderTopColor: colors.text,
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite'
                            }} />
                        </div>
                    )}

                    {/* Product Image */}
                    <img
                        src={imageUrl}
                        alt={productName}
                        onLoad={() => setImageLoaded(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.4s ease, transform 0.7s ease',
                            display: 'block'
                        }}
                        onMouseEnter={(e) => {
                            if (imageLoaded) {
                                e.target.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div style={{
                padding: '20px 0 0 0',
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Link
                    to={`/product/${product.id}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 6px 0',
                        color: colors.text,
                        lineHeight: 1.4,
                        transition: 'color 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.target.style.color = colors.grayText}
                        onMouseLeave={(e) => e.target.style.color = colors.text}>
                        {productName}
                    </h3>
                </Link>

                <p style={{
                    fontSize: '18px',
                    color: colors.grayText,
                    fontWeight: '300',
                    margin: '0 0 18px 0'
                }}>
                    {productPrice}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    style={{
                        backgroundColor: isAdding ? colors.accent : 'transparent',
                        color: isAdding ? colors.text : colors.text,
                        border: `1px solid ${colors.text}`,
                        padding: '12px 24px',
                        fontSize: '13px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        cursor: isAdding ? 'default' : 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        maxWidth: '220px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        if (!isAdding) {
                            e.target.style.backgroundColor = colors.text;
                            e.target.style.color = colors.background;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isAdding) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = colors.text;
                        }
                    }}
                >
                    {isAdding ? (
                        <>
                            <span style={{
                                display: 'inline-block',
                                width: '16px',
                                height: '16px',
                                border: `2px solid ${colors.text}`,
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite'
                            }} />
                            ADDED
                        </>
                    ) : (
                        'ADD TO CART'
                    )}
                </button>
            </div>

            {/* Global styles for animations */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @media (max-width: 640px) {
                    div[style*="padding: 20px 0 0 0"] {
                        padding: 15px 0 0 0 !important;
                    }
                    
                    h3 {
                        font-size: 18px !important;
                    }
                    
                    button {
                        padding: 10px 20px !important;
                        max-width: 180px !important;
                    }
                }
            `}</style>
        </div>
    );
}
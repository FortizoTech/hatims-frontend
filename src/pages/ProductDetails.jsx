import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/assetMapper";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const { addToCart } = useContext(CartContext);

    // Color palette matching the design system
    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B'
    };

    // Shared container style
    const containerStyle = {
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setIsAdding(true);

        try {
            // Add product with quantity
            await addToCart({ ...product, quantity });

            // Visual feedback
            setTimeout(() => {
                setIsAdding(false);
            }, 1000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    // Loading State
    if (loading) {
        return (
            <div style={{
                minHeight: '80vh',
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
                            Loading Product
                        </p>
                        <p style={{
                            color: colors.grayText,
                            fontSize: '14px',
                            margin: 0,
                            fontWeight: '300'
                        }}>
                            Please wait while we prepare the details
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                padding: '40px 20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <span style={{
                        fontSize: '64px',
                        display: 'block',
                        marginBottom: '24px',
                        opacity: 0.5,
                        color: colors.text
                    }}>
                        ✦
                    </span>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 16px 0',
                        color: colors.text
                    }}>
                        Product Not Found
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: '0 0 32px 0',
                        lineHeight: 1.6
                    }}>
                        {error || "The product you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: 'transparent',
                            color: colors.text,
                            border: `1px solid ${colors.text}`,
                            padding: '14px 36px',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
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
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Mock additional images (you can replace with actual product images array)
    const productImages = [
        product.image,
        product.image, // Replace with additional images if available
        product.image, // Replace with additional images if available
    ];

    const imageUrl = product?.image
        ? `http://localhost:5000/uploads/products/${product.image}`
        : getProductImage(product?.id || 0);

    return (
        <div style={{
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '100vh',
            padding: '80px 0 120px 0'
        }}>
            <div style={containerStyle}>
                {/* Breadcrumb */}
                <div style={{
                    marginBottom: '40px',
                    fontSize: '14px',
                    color: colors.grayText
                }}>
                    <a href="/" style={{ color: colors.grayText, textDecoration: 'none' }}>Home</a>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <a href="/products" style={{ color: colors.grayText, textDecoration: 'none' }}>Products</a>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ color: colors.text }}>{product.name}</span>
                </div>

                {/* Product Details Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(30px, 5vw, 60px)',
                    marginBottom: '80px'
                }}>
                    {/* Left Column - Images */}
                    <div>
                        {/* Main Image */}
                        <div style={{
                            backgroundColor: colors.grayLight,
                            overflow: 'hidden',
                            marginBottom: '20px',
                            aspectRatio: '4/5'
                        }}>
                            <img
                                src={imageUrl}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {productImages.length > 1 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '10px'
                            }}>
                                {productImages.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        style={{
                                            backgroundColor: colors.grayLight,
                                            aspectRatio: '1/1',
                                            cursor: 'pointer',
                                            border: selectedImage === index
                                                ? `2px solid ${colors.text}`
                                                : `2px solid transparent`,
                                            transition: 'border-color 0.3s ease',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedImage !== index) {
                                                e.currentTarget.style.opacity = '0.8';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                    >
                                        <img
                                            src={imageUrl} // Replace with actual thumbnails
                                            alt={`${product.name} view ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div style={{
                        padding: '20px 0'
                    }}>
                        {/* Product Tag/Category */}
                        {product.category && (
                            <span style={{
                                display: 'inline-block',
                                backgroundColor: colors.accent,
                                color: colors.text,
                                padding: '4px 12px',
                                fontSize: '12px',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                marginBottom: '20px'
                            }}>
                                {product.category}
                            </span>
                        )}

                        {/* Product Name */}
                        <h1 style={{
                            fontSize: 'clamp(32px, 4vw, 42px)',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 20px 0',
                            lineHeight: 1.2,
                            color: colors.text
                        }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p style={{
                            fontSize: 'clamp(24px, 3vw, 28px)',
                            color: colors.text,
                            fontWeight: '300',
                            margin: '0 0 30px 0',
                            borderBottom: `1px solid ${colors.grayLight}`,
                            paddingBottom: '30px'
                        }}>
                            ${product.price}
                        </p>

                        {/* Description */}
                        <div style={{
                            marginBottom: '40px'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                margin: '0 0 15px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Description
                            </h3>
                            <p style={{
                                fontSize: '16px',
                                color: colors.grayText,
                                lineHeight: 1.8,
                                margin: 0
                            }}>
                                {product.description || "Experience the perfect blend of luxury and comfort with this meticulously crafted piece. Made from the finest materials, it's designed to elevate your everyday elegance."}
                            </p>
                        </div>

                        {/* Additional Details */}
                        <div style={{
                            marginBottom: '40px'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '500',
                                margin: '0 0 15px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Details
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {[
                                    '100% Premium Quality Fabric',
                                    'Handcrafted with care',
                                    'Ethically sourced materials',
                                    'Easy care instructions'
                                ].map((detail, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '10px',
                                        color: colors.grayText,
                                        fontSize: '15px'
                                    }}>
                                        <span style={{
                                            color: colors.text,
                                            fontSize: '18px'
                                        }}>✦</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quantity Selector */}
                        <div style={{
                            marginBottom: '30px'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                margin: '0 0 15px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Quantity
                            </h3>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px'
                            }}>
                                <button
                                    onClick={decrementQuantity}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${colors.grayMedium}`,
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = colors.grayLight;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    −
                                </button>
                                <span style={{
                                    fontSize: '18px',
                                    minWidth: '40px',
                                    textAlign: 'center'
                                }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: 'transparent',
                                        border: `1px solid ${colors.grayMedium}`,
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = colors.grayLight;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                backgroundColor: isAdding ? colors.accent : colors.text,
                                color: isAdding ? colors.text : colors.background,
                                border: `1px solid ${colors.text}`,
                                padding: '18px 32px',
                                fontSize: '16px',
                                fontWeight: '500',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: isAdding ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '20px'
                            }}
                            onMouseEnter={(e) => {
                                if (!isAdding) {
                                    e.target.style.backgroundColor = colors.background;
                                    e.target.style.color = colors.text;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isAdding) {
                                    e.target.style.backgroundColor = colors.text;
                                    e.target.style.color = colors.background;
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
                                    ADDED TO CART
                                </>
                            ) : (
                                'ADD TO CART'
                            )}
                        </button>

                        {/* Additional Info */}
                        <div style={{
                            fontSize: '14px',
                            color: colors.grayText,
                            borderTop: `1px solid ${colors.grayLight}`,
                            paddingTop: '30px',
                            marginTop: '30px'
                        }}>
                            <p style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                margin: '0 0 10px 0'
                            }}>
                                <Truck size={16} />
                                Free shipping on orders over $100
                            </p>
                            <p style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                margin: 0
                            }}>
                                <RefreshCw size={16} />
                                30-day easy returns
                            </p>
                        </div>
                    </div>
                </div>

                {/* You May Also Like Section */}
                <section style={{
                    borderTop: `1px solid ${colors.grayLight}`,
                    paddingTop: '60px'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(24px, 3vw, 32px)',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        textAlign: 'center',
                        margin: '0 0 40px 0'
                    }}>
                        You May Also Like
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        {/* Placeholder for related products */}
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} style={{
                                textAlign: 'center',
                                opacity: 0.6
                            }}>
                                <div style={{
                                    backgroundColor: colors.grayLight,
                                    aspectRatio: '4/5',
                                    marginBottom: '15px'
                                }} />
                                <p style={{
                                    fontSize: '16px',
                                    color: colors.grayText
                                }}>
                                    Related Product
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: 80px 0 120px 0"] {
                        padding: 40px 0 80px 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}

// Icons component for shipping/returns
function Truck(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );
}

function RefreshCw(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}
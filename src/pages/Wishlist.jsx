import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/assetMapper";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    // Color palette matching the design system
    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B',
        heart: '#e11d48' // Soft red for heart icon
    };

    // Shared container style
    const containerStyle = {
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await API.get("/wishlist");
                setWishlist(res.data);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setError("Failed to load your wishlist. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleRemoveFromWishlist = async (wishlistItemId, productId) => {
        try {
            setRemovingId(wishlistItemId);
            await API.delete(`/wishlist/${wishlistItemId}`);

            // Remove item from local state with animation
            setWishlist(prev => prev.filter(item => item.wishlist_id !== wishlistItemId));
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            alert("Failed to remove item. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (product, wishlistItemId) => {
        try {
            setAddingToCart(wishlistItemId);
            await addToCart(product);

            // Optional: Show success message or keep item in wishlist
            // You might want to keep it in wishlist even after adding to cart
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    // Loading State
    if (loading) {
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
                            Loading Wishlist
                        </p>
                        <p style={{
                            color: colors.grayText,
                            fontSize: '14px',
                            margin: 0,
                            fontWeight: '300'
                        }}>
                            Retrieving your saved items
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Not Logged In State
    if (!user) {
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
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <span style={{
                        fontSize: '72px',
                        display: 'block',
                        marginBottom: '24px',
                        opacity: 0.3,
                        color: colors.text
                    }}>
                        ♡
                    </span>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 16px 0',
                        color: colors.text
                    }}>
                        Sign in to View Your Wishlist
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: '0 0 32px 0',
                        lineHeight: 1.6
                    }}>
                        Create an account or sign in to save your favorite items and access them anywhere.
                    </p>
                    <Link to="/login">
                        <button style={{
                            backgroundColor: colors.text,
                            color: colors.background,
                            border: `1px solid ${colors.text}`,
                            padding: '14px 42px',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginRight: '15px'
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
                            Sign In
                        </button>
                    </Link>
                    <Link to="/register">
                        <button style={{
                            backgroundColor: 'transparent',
                            color: colors.text,
                            border: `1px solid ${colors.text}`,
                            padding: '14px 42px',
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
                            Create Account
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
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
                        Unable to Load Wishlist
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: '0 0 32px 0',
                        lineHeight: 1.6
                    }}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
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
                        Try Again
                    </button>
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
                    marginBottom: '50px',
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
                        color: colors.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px'
                    }}>
                        Your Wishlist
                        <span style={{
                            fontSize: '32px',
                            color: colors.heart
                        }}>
                            ♡
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: colors.grayText,
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        {wishlist.length === 0
                            ? "Your wishlist is empty"
                            : `You have ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} saved`
                        }
                    </p>
                </div>

                {/* Wishlist Grid */}
                {wishlist.length === 0 ? (
                    // Empty State
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
                            ♡
                        </span>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 16px 0',
                            color: colors.text
                        }}>
                            Your Wishlist is Empty
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: colors.grayText,
                            margin: '0 0 32px 0',
                            lineHeight: 1.6
                        }}>
                            Discover pieces you love and save them here for later. Start exploring our collection.
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
                                Explore Collection
                            </button>
                        </Link>
                    </div>
                ) : (
                    // Products Grid
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '40px 30px'
                    }}>
                        {wishlist.map((item) => (
                            <div
                                key={item.wishlist_id}
                                style={{
                                    position: 'relative',
                                    backgroundColor: colors.background,
                                    transition: 'all 0.3s ease',
                                    opacity: removingId === item.wishlist_id ? 0.5 : 1,
                                    pointerEvents: removingId === item.wishlist_id ? 'none' : 'auto'
                                }}
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveFromWishlist(item.wishlist_id, item.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        width: '36px',
                                        height: '36px',
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.grayLight}`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        fontSize: '18px',
                                        color: colors.heart,
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = colors.heart;
                                        e.target.style.color = colors.background;
                                        e.target.style.borderColor = colors.heart;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = colors.background;
                                        e.target.style.color = colors.heart;
                                        e.target.style.borderColor = colors.grayLight;
                                    }}
                                >
                                    {removingId === item.wishlist_id ? '⋯' : '✕'}
                                </button>

                                {/* Product Image */}
                                <Link to={`/product/${item.id}`}>
                                    <div style={{
                                        overflow: 'hidden',
                                        backgroundColor: colors.grayLight,
                                        aspectRatio: '4/5',
                                        marginBottom: '20px'
                                    }}>
                                        <img
                                            src={item.image ? `http://localhost:5000/uploads/products/${item.image}` : getProductImage(item?.id || 0)}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.6s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div style={{
                                    textAlign: 'center'
                                }}>
                                    <Link
                                        to={`/product/${item.id}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'inherit'
                                        }}
                                    >
                                        <h3 style={{
                                            fontSize: '20px',
                                            fontWeight: '400',
                                            fontFamily: '"Times New Roman", serif',
                                            margin: '0 0 8px 0',
                                            color: colors.text,
                                            transition: 'color 0.3s ease'
                                        }}
                                            onMouseEnter={(e) => e.target.style.color = colors.grayText}
                                            onMouseLeave={(e) => e.target.style.color = colors.text}>
                                            {item.name}
                                        </h3>
                                    </Link>

                                    <p style={{
                                        fontSize: '18px',
                                        color: colors.grayText,
                                        fontWeight: '300',
                                        margin: '0 0 16px 0'
                                    }}>
                                        {formatCurrency(item.price)}
                                    </p>

                                    {/* Action Buttons */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        justifyContent: 'center'
                                    }}>
                                        <button
                                            onClick={() => handleAddToCart(item, item.wishlist_id)}
                                            disabled={addingToCart === item.wishlist_id}
                                            style={{
                                                flex: 1,
                                                maxWidth: '140px',
                                                backgroundColor: addingToCart === item.wishlist_id ? colors.accent : 'transparent',
                                                color: addingToCart === item.wishlist_id ? colors.text : colors.text,
                                                border: `1px solid ${colors.text}`,
                                                padding: '10px 16px',
                                                fontSize: '12px',
                                                letterSpacing: '1px',
                                                textTransform: 'uppercase',
                                                cursor: addingToCart === item.wishlist_id ? 'default' : 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (addingToCart !== item.wishlist_id) {
                                                    e.target.style.backgroundColor = colors.text;
                                                    e.target.style.color = colors.background;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (addingToCart !== item.wishlist_id) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = colors.text;
                                                }
                                            }}
                                        >
                                            {addingToCart === item.wishlist_id ? (
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '12px',
                                                    height: '12px',
                                                    border: `2px solid ${colors.text}`,
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.6s linear infinite'
                                                }} />
                                            ) : 'Add to Cart'}
                                        </button>

                                        <Link to={`/product/${item.id}`}>
                                            <button style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: 'transparent',
                                                border: `1px solid ${colors.grayMedium}`,
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = colors.grayLight;
                                                    e.target.style.borderColor = colors.text;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.borderColor = colors.grayMedium;
                                                }}
                                            >
                                                →
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recently Viewed Section (Optional) */}
                {wishlist.length > 0 && (
                    <section style={{
                        marginTop: '80px',
                        borderTop: `1px solid ${colors.grayLight}`,
                        paddingTop: '60px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            textAlign: 'center',
                            margin: '0 0 40px 0',
                            color: colors.text
                        }}>
                            Recently Viewed
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '30px',
                            opacity: 0.7
                        }}>
                            {/* Placeholder for recently viewed items */}
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} style={{
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        backgroundColor: colors.grayLight,
                                        aspectRatio: '4/5',
                                        marginBottom: '12px'
                                    }} />
                                    <p style={{
                                        fontSize: '14px',
                                        color: colors.grayText
                                    }}>
                                        Product Name
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))"] {
                        gap: 30px 20px !important;
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: 60px 0 100px 0"] {
                        padding: 40px 0 60px 0 !important;
                    }
                    
                    div[style*="display: flex; gap: 12px;"] {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    button[style*="max-width: 140px"] {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Shared container style for consistent max-width
    const containerStyle = {
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await API.get("/products");
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                    {/* Elegant loading spinner */}
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
                            Loading Collection
                        </p>
                        <p style={{
                            color: colors.grayText,
                            fontSize: '14px',
                            margin: 0,
                            fontWeight: '300'
                        }}>
                            Please wait while we prepare your selection
                        </p>
                    </div>
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
                        fontSize: '48px',
                        display: 'block',
                        marginBottom: '20px',
                        opacity: 0.5
                    }}>
                        ✦
                    </span>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 16px 0',
                        color: colors.text
                    }}>
                        Something went wrong
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
            padding: '80px 0 120px 0'
        }}>
            {/* Page Header */}
            <div style={{
                ...containerStyle,
                marginBottom: '80px',
                textAlign: 'center',
                position: 'relative'
            }}>
                {/* Decorative line */}
                <div style={{
                    width: '60px',
                    height: '1px',
                    backgroundColor: colors.grayMedium,
                    margin: '0 auto 30px auto'
                }} />

                <span style={{
                    fontSize: '13px',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: colors.grayText,
                    display: 'block',
                    marginBottom: '16px',
                    fontWeight: '300'
                }}>
                    Discover
                </span>

                <h1 style={{
                    fontSize: 'clamp(36px, 6vw, 56px)',
                    fontWeight: '400',
                    fontFamily: '"Times New Roman", serif',
                    margin: '0 0 20px 0',
                    color: colors.text,
                    lineHeight: 1.1
                }}>
                    All Products
                </h1>

                <p style={{
                    fontSize: '18px',
                    color: colors.grayText,
                    maxWidth: '600px',
                    margin: '0 auto',
                    fontWeight: '300',
                    lineHeight: 1.8
                }}>
                    {products.length === 0
                        ? "The collection is being curated"
                        : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'} crafted for timeless elegance`
                    }
                </p>
            </div>

            {/* Products Grid */}
            <div style={containerStyle}>
                {products.length === 0 ? (
                    // Empty State
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        backgroundColor: colors.grayLight,
                        borderRadius: '4px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <span style={{
                            fontSize: '64px',
                            display: 'block',
                            marginBottom: '24px',
                            opacity: 0.3,
                            color: colors.text
                        }}>
                            ◇
                        </span>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 16px 0',
                            color: colors.text
                        }}>
                            Collection Coming Soon
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: colors.grayText,
                            margin: '0 0 32px 0',
                            lineHeight: 1.6,
                            maxWidth: '400px',
                            margin: '0 auto 32px auto'
                        }}>
                            We're carefully curating our collection. Please check back later for new arrivals.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: 'transparent',
                                color: colors.text,
                                border: `1px solid ${colors.text}`,
                                padding: '12px 32px',
                                fontSize: '13px',
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
                            Refresh
                        </button>
                    </div>
                ) : (
                    // Product Grid
                    <>
                        {/* Results count - subtle */}
                        <div style={{
                            marginBottom: '40px',
                            fontSize: '15px',
                            color: colors.grayText,
                            fontWeight: '300',
                            letterSpacing: '0.5px',
                            borderBottom: `1px solid ${colors.grayLight}`,
                            paddingBottom: '20px'
                        }}>
                            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                        </div>

                        {/* Responsive Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '50px 30px'
                        }}>
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    div[style*="padding: 80px 0 120px 0"] {
                        padding: 60px 0 80px 0 !important;
                    }
                    
                    div[style*="margin-bottom: 80px"] {
                        margin-bottom: 50px !important;
                    }
                }

                @media (max-width: 480px) {
                    div[style*="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))"] {
                        gap: 40px 20px !important;
                    }
                    
                    h1 {
                        font-size: 32px !important;
                    }
                    
                    p {
                        font-size: 16px !important;
                    }
                }

                /* Smooth scrolling for the whole page */
                body {
                    scroll-behavior: smooth;
                }
            `}</style>
        </div>
    );
}
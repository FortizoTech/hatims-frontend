import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, RefreshCw } from 'lucide-react';
import API, { API_BASE_URL } from '../api/api';
import { brandHero, mochaJersey, getProductImage, getLifestyleImage } from '../utils/assetMapper';

export default function Home() {

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [lookbookImages, setLookbookImages] = useState([]);

    // Color palette
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

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await API.get('/products');


                // Get first 3 products for featured collection
                // You can modify this logic based on your needs (e.g., filter by featured flag)
                setFeaturedProducts(res.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load collection. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        const fetchLookbookImages = async () => {
            try {
                const res = await API.get('/products/images');
                setLookbookImages(res.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching lookbook images:', error);
            }
        };
        fetchLookbookImages();
    }, []);

    // Handle newsletter subscription
    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setSubscriptionStatus({ type: 'error', message: 'Please enter a valid email address' });
            return;
        }

        try {
            // You'll need to create this endpoint in your backend
            // await API.post('/newsletter/subscribe', { email });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubscriptionStatus({ type: 'success', message: 'Thank you for subscribing!' });
            setEmail('');

            // Clear success message after 5 seconds
            setTimeout(() => setSubscriptionStatus(null), 5000);
        } catch {
            setSubscriptionStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        }
    };

    // Features data
    const features = [
        { icon: "✦", title: "Premium Quality", description: "Handpicked premium fabrics for ultimate comfort" },
        { icon: "◈", title: "Authentic Collection", description: "Carefully curated luxury hijabs and accessories" },
        { icon: "◉", title: "Worldwide Shipping", description: "Free shipping on orders over $100" },
        { icon: "↻", title: "Easy Returns", description: "30-day return policy for your peace of mind" }
    ];

    return (
        <div style={{
            backgroundColor: colors.background,
            color: colors.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: 1.6,
            minHeight: '100vh'
        }}>
            {/* Header / Hero Section */}
            <header style={{
                backgroundColor: colors.accent,
                backgroundImage: `url(${brandHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 'clamp(80px, 12vw, 120px) 0 clamp(60px, 10vw, 100px) 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Overlay for better text readability */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(250, 234, 198, 0.4)', // Light tint of the accent color
                    zIndex: 1
                }} />
                <div style={{ ...containerStyle, position: 'relative', zIndex: 2 }}>
                    <div style={{
                        maxWidth: '650px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}>
                        <span style={{
                            fontSize: 'clamp(12px, 2vw, 14px)',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            color: colors.text,
                            opacity: 0.7,
                            display: 'block',
                            marginBottom: '20px'
                        }}>
                            LUXURY REDEFINED
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(42px, 8vw, 72px)',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            lineHeight: 1.1,
                            margin: '0 0 25px 0',
                            color: colors.text
                        }}>
                            Welcome to HATIMS
                        </h1>
                        <p style={{
                            fontSize: 'clamp(16px, 2.5vw, 20px)',
                            color: colors.text,
                            opacity: 0.8,
                            margin: '0 0 40px 0',
                            maxWidth: '550px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            Discover our exquisite collection of luxury hijabs and modest fashion,
                            crafted for the modern woman.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <Link to="/products">
                                <button style={{
                                    backgroundColor: colors.text,
                                    color: colors.background,
                                    border: `1px solid ${colors.text}`,
                                    padding: 'clamp(14px, 2vw, 16px) clamp(32px, 4vw, 42px)',
                                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                                    fontWeight: '500',
                                    letterSpacing: '1px',
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
                                    }}>
                                    EXPLORE COLLECTION <ArrowRight style={{ display: 'inline', marginLeft: '8px' }} size={16} />
                                </button>
                            </Link>
                            <button style={{
                                backgroundColor: 'transparent',
                                color: colors.text,
                                border: `1px solid ${colors.text}`,
                                padding: 'clamp(14px, 2vw, 16px) clamp(32px, 4vw, 42px)',
                                fontSize: 'clamp(14px, 1.5vw, 16px)',
                                fontWeight: '500',
                                letterSpacing: '1px',
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
                                }}>
                                WATCH LOOKBOOK
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{
                padding: 'clamp(60px, 10vw, 100px) 0',
                backgroundColor: colors.background
            }}>
                <div style={containerStyle}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'clamp(40px, 6vw, 60px) clamp(20px, 4vw, 40px)',
                        textAlign: 'center'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                padding: '20px 0'
                            }}>
                                <div style={{
                                    fontSize: 'clamp(36px, 5vw, 42px)',
                                    marginBottom: '25px',
                                    color: colors.text,
                                    opacity: 0.8
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(20px, 2.5vw, 22px)',
                                    fontWeight: '500',
                                    fontFamily: '"Times New Roman", serif',
                                    margin: '0 0 15px 0'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: 'clamp(14px, 1.8vw, 16px)',
                                    color: colors.grayText,
                                    lineHeight: 1.7,
                                    maxWidth: '300px',
                                    margin: '0 auto'
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section style={{
                padding: 'clamp(60px, 10vw, 100px) 0',
                backgroundColor: colors.grayLight
            }}>
                <div style={containerStyle}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 'clamp(40px, 8vw, 70px)'
                    }}>
                        <span style={{
                            fontSize: 'clamp(12px, 1.5vw, 14px)',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            color: colors.text,
                            opacity: 0.6,
                            display: 'block',
                            marginBottom: '15px'
                        }}>
                            CURATED FOR YOU
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 20px 0'
                        }}>
                            Featured Collection
                        </h2>
                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 18px)',
                            color: colors.grayText,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Each piece is thoughtfully designed to bring out your unique elegance
                        </p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '400px'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: `2px solid ${colors.grayMedium}`,
                                    borderTopColor: colors.text,
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                <p style={{ color: colors.grayText }}>Loading collection...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            backgroundColor: colors.background,
                            borderRadius: '4px'
                        }}>
                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>✦</span>
                            <p style={{ color: colors.grayText, marginBottom: '20px' }}>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: colors.text,
                                    border: `1px solid ${colors.text}`,
                                    padding: '12px 32px',
                                    fontSize: '14px',
                                    letterSpacing: '1px',
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
                                TRY AGAIN
                            </button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && !error && (
                        <>
                            {featuredProducts.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    backgroundColor: colors.background,
                                    borderRadius: '4px'
                                }}>
                                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px', opacity: 0.5 }}>◇</span>
                                    <p style={{ color: colors.grayText }}>No featured products available at the moment.</p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: 'clamp(30px, 4vw, 40px)'
                                }}>
                                    {featuredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <div style={{
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                backgroundColor: colors.background
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '20px',
                                                    right: '20px',
                                                    backgroundColor: colors.accent,
                                                    color: colors.text,
                                                    padding: '6px 14px',
                                                    fontSize: '11px',
                                                    letterSpacing: '1px',
                                                    zIndex: 2,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {product.category || 'New'}
                                                </span>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <img
                                                        src={product.name.toLowerCase().includes('mocha') ? mochaJersey : (product.image ? `${API_BASE_URL}/uploads/products/${product.image}` : '/api/placeholder/600/700')}
                                                        alt={product.name}
                                                        style={{
                                                            width: '100%',
                                                            height: 'clamp(350px, 50vw, 500px)',
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.6s ease',
                                                            display: 'block'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                    />
                                                </div>
                                                <div style={{
                                                    padding: '25px 0 0 0',
                                                    textAlign: 'center'
                                                }}>
                                                    <h3 style={{
                                                        fontSize: 'clamp(20px, 2.5vw, 24px)',
                                                        fontWeight: '400',
                                                        fontFamily: '"Times New Roman", serif',
                                                        margin: '0 0 8px 0'
                                                    }}>
                                                        {product.name}
                                                    </h3>
                                                    <p style={{
                                                        fontSize: 'clamp(18px, 2vw, 20px)',
                                                        color: colors.text,
                                                        fontWeight: '300',
                                                        margin: '0 0 20px 0'
                                                    }}>
                                                        ${product.price}
                                                    </p>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        borderBottom: `1px solid ${colors.text}`,
                                                        padding: '0 0 4px 0',
                                                        fontSize: '14px',
                                                        letterSpacing: '1px',
                                                        transition: 'opacity 0.3s ease'
                                                    }}
                                                        onMouseEnter={(e) => e.target.style.opacity = '0.6'}
                                                        onMouseLeave={(e) => e.target.style.opacity = '1'}>
                                                        VIEW DETAILS
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* View All Link */}
                            {featuredProducts.length > 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '60px'
                                }}>
                                    <Link to="/products">
                                        <button style={{
                                            backgroundColor: 'transparent',
                                            color: colors.text,
                                            border: `1px solid ${colors.text}`,
                                            padding: '14px 42px',
                                            fontSize: '14px',
                                            letterSpacing: '2px',
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
                                            }}>
                                            VIEW ALL PRODUCTS
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* About Us Section */}
            <section style={{
                padding: 'clamp(80px, 12vw, 120px) 0',
                backgroundColor: colors.background
            }}>
                <div style={containerStyle}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '60px',
                        alignItems: 'center'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={getLifestyleImage(2)}
                                alt="About Hatims"
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '-30px',
                                right: '-30px',
                                width: '200px',
                                height: '200px',
                                backgroundColor: colors.accent,
                                zIndex: -1,
                                display: window.innerWidth < 1024 ? 'none' : 'block'
                            }} />
                        </div>
                        <div>
                            <span style={{
                                fontSize: '13px',
                                letterSpacing: '4px',
                                textTransform: 'uppercase',
                                color: colors.grayText,
                                display: 'block',
                                marginBottom: '20px'
                            }}>Our Story</span>
                            <h2 style={{
                                fontSize: 'clamp(28px, 5vw, 42px)',
                                fontFamily: '"Times New Roman", serif',
                                marginBottom: '25px',
                                fontWeight: '400'
                            }}>About HATIMS</h2>
                            <p style={{
                                fontSize: '17px',
                                color: colors.grayText,
                                lineHeight: '1.8',
                                marginBottom: '20px'
                            }}>
                                Founded with a vision to celebrate elegance and modesty, HATIMS is more than just a brand; it's a testament to the modern woman's grace. We believe that modesty and luxury should go hand in hand, and our collections are meticulously crafted to reflect this philosophy.
                            </p>
                            <p style={{
                                fontSize: '17px',
                                color: colors.grayText,
                                lineHeight: '1.8'
                            }}>
                                From the finest silk satins to premium jersey blends, every piece in our collection is chosen with an unwavering commitment to quality. Our journey began with a simple mission: to provide sophisticated, high-quality modest wear that empowers women to express their identity with confidence and style.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lookbook Section */}
            <section style={{
                padding: '100px 0',
                backgroundColor: colors.grayLight
            }}>
                <div style={containerStyle}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '60px'
                    }}>
                        <span style={{
                            fontSize: '12px',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            color: colors.grayText,
                            display: 'block',
                            marginBottom: '15px'
                        }}>
                            Inspiration
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(32px, 5vw, 48px)',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 20px 0',
                            color: colors.text
                        }}>
                            The HATIMS Lookbook
                        </h2>
                        <p style={{ color: colors.grayText, maxWidth: '600px', margin: '0 auto 40px auto' }}>
                            Discover how our community styles their favorite HATIMS pieces.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                        marginBottom: '50px'
                    }}>
                        {lookbookImages.length > 0 ? (
                            lookbookImages.map((img, idx) => (
                                <div key={idx} style={{
                                    height: '450px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: colors.grayMedium
                                }}>
                                    <img
                                        src={`${API_BASE_URL}/uploads/products/${img.image_url}`}
                                        alt={`Lookbook ${idx}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                </div>
                            ))
                        ) : (
                            // Fallback if no images found
                            [0, 1, 2].map((i) => (
                                <div key={i} style={{ height: '450px', backgroundColor: colors.grayMedium, opacity: 0.5 }} />
                            ))
                        )}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/lookbook" style={{
                            display: 'inline-block',
                            padding: '15px 40px',
                            border: `1px solid ${colors.text}`,
                            color: colors.text,
                            textDecoration: 'none',
                            letterSpacing: '2px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = colors.text;
                                e.target.style.color = colors.background;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = colors.text;
                            }}>
                            VIEW FULL LOOKBOOK
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{
                padding: 'clamp(80px, 12vw, 120px) 0',
                backgroundColor: colors.background
            }}>
                <div style={{ ...containerStyle, maxWidth: '900px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{
                            fontSize: 'clamp(28px, 5vw, 42px)',
                            fontFamily: '"Times New Roman", serif',
                            marginBottom: '15px',
                            fontWeight: '400'
                        }}>Frequently Asked Questions</h2>
                        <p style={{ color: colors.grayText }}>Everything you need to know about our products and services.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { q: "What materials do you use for your hijabs?", a: "We source only the finest fabrics, including high-quality silk satins, premium viscose blends, and breathable jerseys. Each material is selected for its comfort, drape, and durability." },
                            { q: "Do you ship worldwide?", a: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location. Free worldwide shipping is available on orders over $150." },
                            { q: "What is your return policy?", a: "We want you to be completely satisfied with your purchase. You can return any unworn items in their original packaging within 30 days of delivery for a full refund or exchange." },
                            { q: "How should I care for my HATIMS pieces?", a: "We recommend hand washing your hijabs in cold water with a gentle detergent to maintain their color and texture. For silk items, dry cleaning is recommended." }
                        ].map((faq, idx) => (
                            <div key={idx} style={{
                                padding: '30px',
                                border: `1px solid ${colors.grayMedium}`,
                                borderRadius: '4px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    marginBottom: '15px',
                                    color: colors.text
                                }}>{faq.q}</h3>
                                <p style={{
                                    fontSize: '16px',
                                    color: colors.grayText,
                                    lineHeight: '1.6',
                                    margin: 0
                                }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section style={{
                padding: 'clamp(80px, 12vw, 120px) 0',
                backgroundColor: colors.background,
                borderTop: `1px solid ${colors.grayMedium}`,
                borderBottom: `1px solid ${colors.grayMedium}`
            }}>
                <div style={containerStyle}>
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(24px, 4vw, 38px)',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 25px 0'
                        }}>
                            Join the HATIMS Family
                        </h2>
                        <p style={{
                            fontSize: 'clamp(16px, 2vw, 18px)',
                            color: colors.grayText,
                            margin: '0 0 45px 0'
                        }}>
                            Subscribe to receive updates about new collections, exclusive offers, and styling tips.
                        </p>

                        {/* Subscription Status */}
                        {subscriptionStatus && (
                            <div style={{
                                marginBottom: '20px',
                                padding: '12px',
                                backgroundColor: subscriptionStatus.type === 'success' ? colors.accent : '#fee',
                                color: subscriptionStatus.type === 'success' ? colors.text : '#c00',
                                fontSize: '14px'
                            }}>
                                {subscriptionStatus.message}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubscribe}
                            style={{
                                display: 'flex',
                                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                                gap: '15px',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                style={{
                                    flex: 1,
                                    padding: '16px 24px',
                                    border: `1px solid ${colors.grayMedium}`,
                                    backgroundColor: colors.background,
                                    fontSize: '16px',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = colors.text}
                                onBlur={(e) => e.target.style.borderColor = colors.grayMedium}
                            />
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: colors.text,
                                    color: colors.background,
                                    border: `1px solid ${colors.text}`,
                                    padding: '16px 42px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
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
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer style={{
                backgroundColor: colors.background,
                padding: '60px 0',
                borderTop: `1px solid ${colors.grayMedium}`
            }}>
                <div style={{ ...containerStyle, textAlign: 'center' }}>
                    <h3 style={{
                        fontSize: '32px',
                        fontFamily: '"Times New Roman", serif',
                        fontWeight: '400',
                        marginBottom: '30px',
                        letterSpacing: '2px'
                    }}>HATIMS</h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        marginBottom: '30px',
                        flexWrap: 'wrap'
                    }}>
                        {["About Us", "Contact", "FAQs", "Shipping", "Privacy"].map((link, idx) => (
                            <a key={idx} href="#" style={{
                                color: colors.grayText,
                                textDecoration: 'none',
                                fontSize: '14px',
                                letterSpacing: '1px',
                                transition: 'color 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.color = colors.text}
                                onMouseLeave={(e) => e.target.style.color = colors.grayText}>
                                {link.toUpperCase()}
                            </a>
                        ))}
                    </div>

                    <p style={{
                        color: colors.grayText,
                        fontSize: '13px',
                        letterSpacing: '1px',
                        margin: 0
                    }}>
                        © {new Date().getFullYear()} HATIMS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>

            {/* Global Styles */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                button, input {
                    font-family: inherit;
                    outline: none;
                }
                
                a {
                    text-decoration: none;
                }
            `}</style>
        </div>
    );
}
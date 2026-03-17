import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API, { API_BASE_URL } from "../api/api";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/assetMapper";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct]       = useState(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [quantity, setQuantity]     = useState(1);
    const [isAdding, setIsAdding]     = useState(false);

    const { addToCart } = useContext(CartContext);

    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B'
    };

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
                setSelectedIndex(0);
                const res = await API.get(`/products/${id}`);
                const activeProduct = res.data;
                setProduct(activeProduct);
                
                // Fetch related products (same category)
                if (activeProduct.category_id) {
                    try {
                        const relatedRes = await API.get(`/products`); // we'll filter them client-side for now
                        const allProducts = relatedRes.data;
                        const filtered = allProducts.filter(p => 
                            p.category_id === activeProduct.category_id && p.id !== activeProduct.id
                        );
                        // take up to 4 related products
                        setRelatedProducts(filtered.slice(0, 4));
                    } catch (relatedErr) {
                        console.error("Error fetching related products:", relatedErr);
                    }
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Build the ordered list of image URLs from the API response
    const buildImageList = (prod) => {
        if (!prod) return [];
        const buildUrl = (src) => {
            if (!src) return null;
            if (src.startsWith("http") || src.startsWith("/")) return src;
            return `${API_BASE_URL}/uploads/products/${src}`;
        };

        if (prod.images?.length) {
            return prod.images.map((i) => buildUrl(i.image_url)).filter(Boolean);
        }
        if (prod.image) return [buildUrl(prod.image)];
        return [getProductImage(prod.id || 0)];
    };

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart({ ...product, quantity });
            setTimeout(() => setIsAdding(false), 1000);
        } catch (err) {
            console.error("Error adding to cart:", err);
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
                        <p style={{ color: colors.text, fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px 0', fontWeight: '400' }}>
                            Loading Product
                        </p>
                        <p style={{ color: colors.grayText, fontSize: '14px', margin: 0, fontWeight: '300' }}>
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
                <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <span style={{ fontSize: '64px', display: 'block', marginBottom: '24px', opacity: 0.5, color: colors.text }}>✦</span>
                    <h2 style={{ fontSize: '28px', fontWeight: '400', fontFamily: '"Times New Roman", serif', margin: '0 0 16px 0', color: colors.text }}>
                        Product Not Found
                    </h2>
                    <p style={{ fontSize: '16px', color: colors.grayText, margin: '0 0 32px 0', lineHeight: 1.6 }}>
                        {error || "The product you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: 'transparent', color: colors.text,
                            border: `1px solid ${colors.text}`, padding: '14px 36px',
                            fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = colors.text; e.target.style.color = colors.background; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.text; }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const imageList = buildImageList(product);
    const activeImage = imageList[selectedIndex] || imageList[0];

    const goNext = () => setSelectedIndex(prev => (prev + 1) % imageList.length);
    const goPrev = () => setSelectedIndex(prev => (prev - 1 + imageList.length) % imageList.length);

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
                <div style={{ marginBottom: '40px', fontSize: '14px', color: colors.grayText }}>
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
                    {/* ─── Left Column: Image Gallery ─── */}
                    <div>
                        {/* Main Image with optional arrow navigation */}
                        <div style={{
                            position: 'relative',
                            backgroundColor: colors.grayLight,
                            overflow: 'hidden',
                            marginBottom: '16px',
                            aspectRatio: '4/5'
                        }}>
                            <img
                                key={activeImage}
                                src={activeImage}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    animation: 'fadeIn 0.4s ease'
                                }}
                            />

                            {/* Arrow Buttons — only when multiple images */}
                            {imageList.length > 1 && (
                                <>
                                    <button
                                        onClick={goPrev}
                                        aria-label="Previous image"
                                        style={{
                                            position: 'absolute',
                                            left: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            color: colors.text,
                                            transition: 'background-color 0.25s ease',
                                            zIndex: 4
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)'}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        onClick={goNext}
                                        aria-label="Next image"
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            color: colors.text,
                                            transition: 'background-color 0.25s ease',
                                            zIndex: 4
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)'}
                                    >
                                        ›
                                    </button>

                                    {/* Counter badge */}
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '14px',
                                        right: '14px',
                                        backgroundColor: 'rgba(0,0,0,0.45)',
                                        color: '#fff',
                                        fontSize: '12px',
                                        letterSpacing: '1px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        zIndex: 4
                                    }}>
                                        {selectedIndex + 1} / {imageList.length}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {imageList.length > 1 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${Math.min(imageList.length, 5)}, 1fr)`,
                                gap: '10px'
                            }}>
                                {imageList.map((url, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedIndex(index)}
                                        role="button"
                                        aria-label={`View image ${index + 1}`}
                                        style={{
                                            backgroundColor: colors.grayLight,
                                            aspectRatio: '1/1',
                                            cursor: 'pointer',
                                            border: selectedIndex === index
                                                ? `2px solid ${colors.text}`
                                                : `2px solid transparent`,
                                            transition: 'border-color 0.25s ease, opacity 0.25s ease',
                                            overflow: 'hidden',
                                            opacity: selectedIndex === index ? 1 : 0.65
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedIndex !== index) e.currentTarget.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedIndex !== index) e.currentTarget.style.opacity = '0.65';
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`${product.name} – view ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─── Right Column: Product Info ─── */}
                    <div style={{ padding: '20px 0' }}>
                        {/* Category tag */}
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

                        {/* Stock */}
                        {product.stock !== undefined && (
                            <p style={{
                                fontSize: '14px',
                                color: product.stock > 0 ? '#4CAF50' : '#e53935',
                                margin: '0 0 24px 0',
                                letterSpacing: '0.5px'
                            }}>
                                {product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
                            </p>
                        )}

                        {/* Description */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 15px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Description
                            </h3>
                            <p style={{ fontSize: '16px', color: colors.grayText, lineHeight: 1.8, margin: 0 }}>
                                {product.description || "Experience the perfect blend of luxury and comfort with this meticulously crafted piece. Made from the finest materials, it's designed to elevate your everyday elegance."}
                            </p>
                        </div>

                        {/* Details */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 15px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Details
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {['100% Premium Quality Fabric', 'Handcrafted with care', 'Ethically sourced materials', 'Easy care instructions'].map((detail, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: colors.grayText, fontSize: '15px' }}>
                                        <span style={{ color: colors.text, fontSize: '18px' }}>✦</span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quantity Selector */}
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 15px 0', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Quantity
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <button
                                    onClick={decrementQuantity}
                                    style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: `1px solid ${colors.grayMedium}`, cursor: 'pointer', fontSize: '18px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.grayLight}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >−</button>
                                <span style={{ fontSize: '18px', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                                <button
                                    onClick={incrementQuantity}
                                    style={{ width: '40px', height: '40px', backgroundColor: 'transparent', border: `1px solid ${colors.grayMedium}`, cursor: 'pointer', fontSize: '18px', transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = colors.grayLight}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >+</button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
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
                                cursor: (isAdding || product.stock === 0) ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '20px',
                                opacity: product.stock === 0 ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => { if (!isAdding && product.stock !== 0) { e.currentTarget.style.backgroundColor = colors.background; e.currentTarget.style.color = colors.text; } }}
                            onMouseLeave={(e) => { if (!isAdding && product.stock !== 0) { e.currentTarget.style.backgroundColor = colors.text; e.currentTarget.style.color = colors.background; } }}
                        >
                            {isAdding ? (
                                <>
                                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: `2px solid ${colors.text}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                    ADDED TO CART
                                </>
                            ) : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>

                        {/* Shipping / Returns */}
                        <div style={{ fontSize: '14px', color: colors.grayText, borderTop: `1px solid ${colors.grayLight}`, paddingTop: '30px', marginTop: '30px' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 10px 0' }}>
                                <Truck size={16} /> Free shipping on orders over $100
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                                <RefreshCw size={16} /> 30-day easy returns
                            </p>
                        </div>
                    </div>
                </div>

                {/* You May Also Like */}
                {relatedProducts.length > 0 && (
                    <section style={{ borderTop: `1px solid ${colors.grayLight}`, paddingTop: '60px' }}>
                        <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: '400', fontFamily: '"Times New Roman", serif', textAlign: 'center', margin: '0 0 40px 0' }}>
                            You May Also Like
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                            {relatedProducts.map(related => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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

// Icons
function Truck(props) {
    return (
        <svg width="24" height="24" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    );
}

function RefreshCw(props) {
    return (
        <svg width="24" height="24" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}
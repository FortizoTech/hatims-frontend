import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../utils/assetMapper";
import { API_BASE_URL } from "../api/api";

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        accentDark: '#E5D5B5',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B'
    };

    // --- Image resolution ---
    // Build all images from the product_images table (images[]) first,
    // then fall back to the legacy `image` field, then to a local asset.
    const buildUrl = (img) => {
        if (!img) return null;
        // Already a full URL (from product_images.image_url)?
        if (img.startsWith("http") || img.startsWith("/")) return img;
        return `${API_BASE_URL}/uploads/products/${img}`;
    };

    const imagesArray = product?.images?.length
        ? product.images.map((i) => buildUrl(i.image_url)).filter(Boolean)
        : product?.image
            ? [`${API_BASE_URL}/uploads/products/${product.image}`]
            : [getProductImage(product?.id || 0)];

    const primaryUrl = imagesArray[0];
    const hoverUrl   = imagesArray.length > 1 ? imagesArray[1] : null;

    const productName  = product?.name  || "Untitled";
    const productPrice = product?.price ? `$${product.price}` : "Price upon request";
    const productTag   = product?.category || "New Arrival";

    const handleAddToCart = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            await addToCart(product);
            setTimeout(() => setIsAdding(false), 1000);
        } catch (err) {
            console.error("Error adding to cart:", err);
            setIsAdding(false);
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                backgroundColor: colors.background,
                transition: 'transform 0.4s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                setIsHovered(true);
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                setIsHovered(false);
            }}
        >
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
                pointerEvents: 'none'
            }}>
                {productTag}
            </span>

            {/* Image Container */}
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

                    {/* Primary Image */}
                    <img
                        src={primaryUrl}
                        alt={productName}
                        onLoad={() => setImageLoaded(true)}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            opacity: (imageLoaded && hoverUrl) ? (isHovered ? 0 : 1) : (imageLoaded ? 1 : 0),
                            transition: 'opacity 0.55s ease, transform 0.7s ease',
                            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                        }}
                    />

                    {/* Hover Image (second image) — only rendered when available */}
                    {hoverUrl && (
                        <img
                            src={hoverUrl}
                            alt={`${productName} – alternate view`}
                            onLoad={() => setHoverImageLoaded(true)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                opacity: (hoverImageLoaded && isHovered) ? 1 : 0,
                                transition: 'opacity 0.55s ease, transform 0.7s ease',
                                transform: isHovered ? 'scale(1.04)' : 'scale(1.08)'
                            }}
                        />
                    )}

                    {/* Dot indicators — show when multiple images exist */}
                    {imagesArray.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '6px',
                            zIndex: 5,
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}>
                            {imagesArray.slice(0, 4).map((_, i) => (
                                <span key={i} style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: i === (isHovered ? 1 : 0)
                                        ? colors.background
                                        : 'rgba(255,255,255,0.5)',
                                    display: 'block',
                                    transition: 'background-color 0.3s ease'
                                }} />
                            ))}
                        </div>
                    )}
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
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3
                        style={{
                            fontSize: '20px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 6px 0',
                            color: colors.text,
                            lineHeight: 1.4,
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = colors.grayText}
                        onMouseLeave={(e) => e.target.style.color = colors.text}
                    >
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
                        color: colors.text,
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
                            e.currentTarget.style.backgroundColor = colors.text;
                            e.currentTarget.style.color = colors.background;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isAdding) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.text;
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

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @media (max-width: 640px) {
                    h3 { font-size: 18px !important; }
                }
            `}</style>
        </div>
    );
}
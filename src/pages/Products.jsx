import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    // Listen for URL search params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchParam = queryParams.get("search");
        if (searchParam) {
            setSearchQuery(searchParam);
        } else {
            setSearchQuery("");
        }
    }, [location.search]);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [maxPrice, setMaxPrice] = useState(10000); 
    const [priceRangeFilter, setPriceRangeFilter] = useState(10000); // What the user actually moves the slider to
    const [sortBy, setSortBy] = useState("newest");

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

    const containerStyle = {
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch products and categories concurrently
                const [productsRes, categoriesRes] = await Promise.all([
                    API.get("/products"),
                    API.get("/categories").catch(() => ({ data: [] })) // Fallback if categories endpoint fails
                ]);
                
                const fetchedProducts = productsRes.data || [];
                setProducts(fetchedProducts);
                setCategories(categoriesRes.data || []);
                
                // Determine absolute max price for the slider from the fetched products
                if (fetchedProducts.length > 0) {
                    const highestPrice = Math.max(...fetchedProducts.map(p => Number(p.price) || 0));
                    // Round up to nearest 100 for a clean slider max
                    const cleanMax = Math.ceil(highestPrice / 100) * 100 || 1000;
                    setMaxPrice(cleanMax);
                    setPriceRangeFilter(cleanMax);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load collection. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoize the filtered and sorted products
    const filteredAndSortedProducts = useMemo(() => {
        // 1. Filter
        let result = products.filter(product => {
            // Category filter
            if (selectedCategory !== "all" && product.category_id !== Number(selectedCategory)) {
                return false;
            }
            
            // Price filter
            if (Number(product.price) > priceRangeFilter) {
                return false;
            }

            // Search query filter
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                if (!product.name.toLowerCase().includes(query) && 
                    !(product.description && product.description.toLowerCase().includes(query))) {
                    return false;
                }
            }

            return true;
        });

        // 2. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case "price_asc":
                    return Number(a.price) - Number(b.price);
                case "price_desc":
                    return Number(b.price) - Number(a.price);
                case "name_asc":
                    return a.name.localeCompare(b.name);
                case "name_desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                default:
                    // Assuming higher ID means newer, or sorting by created_at if available
                    if (a.created_at && b.created_at) {
                        return new Date(b.created_at) - new Date(a.created_at);
                    }
                    return b.id - a.id;
            }
        });

        return result;
    }, [products, selectedCategory, priceRangeFilter, searchQuery, sortBy]);

    // Loading State
    if (loading) {
        return (
            <div style={{
                minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: '40px 20px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', border: `2px solid ${colors.grayMedium}`, borderTopColor: colors.text, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <div>
                        <p style={{ color: colors.text, fontSize: '16px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px 0', fontWeight: '400' }}>Loading Collection</p>
                        <p style={{ color: colors.grayText, fontSize: '14px', margin: 0, fontWeight: '300' }}>Please wait while we prepare your selection</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: '40px 20px' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px', opacity: 0.5 }}>✦</span>
                    <h2 style={{ fontSize: '24px', fontWeight: '400', fontFamily: '"Times New Roman", serif', margin: '0 0 16px 0', color: colors.text }}>Something went wrong</h2>
                    <p style={{ fontSize: '16px', color: colors.grayText, margin: '0 0 32px 0', lineHeight: 1.6 }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ backgroundColor: 'transparent', color: colors.text, border: `1px solid ${colors.text}`, padding: '14px 36px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = colors.text; e.target.style.color = colors.background; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.text; }}
                    >Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: colors.background, color: colors.text,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            minHeight: '100vh', padding: '80px 0 120px 0'
        }}>
            {/* Page Header */}
            <div style={{ ...containerStyle, marginBottom: '60px', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: '60px', height: '1px', backgroundColor: colors.grayMedium, margin: '0 auto 30px auto' }} />
                <span style={{ fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', color: colors.grayText, display: 'block', marginBottom: '16px', fontWeight: '300' }}>
                    Discover
                </span>
                <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: '400', fontFamily: '"Times New Roman", serif', margin: '0 0 20px 0', color: colors.text, lineHeight: 1.1 }}>
                    All Products
                </h1>
                <p style={{ fontSize: '18px', color: colors.grayText, maxWidth: '600px', margin: '0 auto', fontWeight: '300', lineHeight: 1.8 }}>
                    {products.length === 0 ? "The collection is being curated" : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'} crafted for timeless elegance`}
                </p>
            </div>

            <div style={{
                ...containerStyle,
                display: 'grid',
                gridTemplateColumns: '250px 1fr',
                gap: '40px',
                alignItems: 'start'
            }} className="layout-grid">
                
                {/* --- SIDEBAR FILTERS --- */}
                <aside style={{
                    position: 'sticky',
                    top: '100px',
                    paddingRight: '20px',
                    borderRight: `1px solid ${colors.grayLight}`
                }} className="filters-sidebar">
                    
                    {/* Search */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '500' }}>Search</h3>
                        <input 
                            type="text" 
                            placeholder="Search collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 14px', border: `1px solid ${colors.grayMedium}`,
                                backgroundColor: 'transparent', color: colors.text, outline: 'none',
                                fontSize: '14px', transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = colors.text}
                            onBlur={(e) => e.target.style.borderColor = colors.grayMedium}
                        />
                    </div>

                    {/* Categories */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '500' }}>Category</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: selectedCategory === "all" ? colors.text : colors.grayText, cursor: 'pointer', transition: 'color 0.2s' }}>
                                <input 
                                    type="radio" name="category" value="all" 
                                    checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")}
                                    style={{ accentColor: colors.text }} 
                                />
                                All Categories
                            </label>
                            {categories.map(cat => (
                                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: selectedCategory === String(cat.id) ? colors.text : colors.grayText, cursor: 'pointer', transition: 'color 0.2s' }}>
                                    <input 
                                        type="radio" name="category" value={cat.id} 
                                        checked={selectedCategory === String(cat.id)} onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{ accentColor: colors.text }} 
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', fontWeight: '500' }}>Max Price: ${priceRangeFilter}</h3>
                        <input 
                            type="range" min="0" max={maxPrice} step="10"
                            value={priceRangeFilter}
                            onChange={(e) => setPriceRangeFilter(Number(e.target.value))}
                            style={{
                                width: '100%', accentColor: colors.text, cursor: 'pointer'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: colors.grayText }}>
                            <span>$0</span>
                            <span>${maxPrice}</span>
                        </div>
                    </div>

                    {/* Reset Filters */}
                    <button 
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                            setPriceRangeFilter(maxPrice);
                            setSortBy("newest");
                        }}
                        style={{
                            width: '100%', padding: '10px', backgroundColor: 'transparent',
                            border: `1px solid ${colors.grayMedium}`, color: colors.grayText,
                            fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => { e.target.style.borderColor = colors.text; e.target.style.color = colors.text; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = colors.grayMedium; e.target.style.color = colors.grayText; }}
                    >
                        Reset Filters
                    </button>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main>
                    {/* Toolbar (Sort & Counts) */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: '40px', paddingBottom: '20px', borderBottom: `1px solid ${colors.grayLight}`,
                        flexWrap: 'wrap', gap: '20px'
                    }}>
                        <div style={{ fontSize: '15px', color: colors.grayText, fontWeight: '300', letterSpacing: '0.5px' }}>
                            Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', color: colors.grayText, textTransform: 'uppercase', letterSpacing: '1px' }}>Sort by:</span>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px', border: `1px solid ${colors.grayMedium}`, backgroundColor: 'transparent',
                                    color: colors.text, outline: 'none', fontSize: '14px', cursor: 'pointer'
                                }}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredAndSortedProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: colors.grayLight, borderRadius: '4px' }}>
                            <span style={{ fontSize: '48px', display: 'block', marginBottom: '24px', opacity: 0.3, color: colors.text }}>◇</span>
                            <h2 style={{ fontSize: '20px', fontWeight: '400', fontFamily: '"Times New Roman", serif', margin: '0 0 16px 0', color: colors.text }}>No matches found</h2>
                            <p style={{ fontSize: '15px', color: colors.grayText, maxWidth: '400px', margin: '0 auto' }}>
                                Try adjusting your filters or search query to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px 30px' }}>
                            {filteredAndSortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 900px) {
                    .layout-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .filters-sidebar {
                        position: relative !important;
                        top: 0 !important;
                        padding-right: 0 !important;
                        border-right: none !important;
                        border-bottom: 1px solid ${colors.grayLight} !important;
                        padding-bottom: 30px !important;
                        margin-bottom: 10px !important;
                    }
                }

                @media (max-width: 768px) {
                    div[style*="padding: 80px 0 120px 0"] { padding: 60px 0 80px 0 !important; }
                    div[style*="margin-bottom: 60px"] { margin-bottom: 40px !important; }
                }

                @media (max-width: 480px) {
                    div[style*="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))"] {
                        gap: 40px 20px !important;
                    }
                    h1 { font-size: 32px !important; }
                }
            `}</style>
        </div>
    );
}
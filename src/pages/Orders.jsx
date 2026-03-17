import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filter, setFilter] = useState('all'); // all, processing, completed, cancelled

    const { user } = useContext(AuthContext);

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
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };

    // Shared container style
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%'
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await API.get("/orders");
                // Ensure orders is an array
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load your orders. Please try again.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const getStatusColor = (status) => {
        if (!status) return colors.grayText;

        switch (status.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return colors.success;
            case 'processing':
            case 'shipped':
                return colors.warning;
            case 'cancelled':
            case 'refunded':
                return colors.error;
            case 'pending':
                return colors.info;
            default:
                return colors.grayText;
        }
    };

    const getStatusIcon = (status) => {
        if (!status) return '○';

        switch (status.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return '✓';
            case 'processing':
            case 'shipped':
                return '⟳';
            case 'cancelled':
            case 'refunded':
                return '✕';
            case 'pending':
                return '⋯';
            default:
                return '○';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Date not available';
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getFilteredOrders = () => {
        if (filter === 'all') return orders;
        return orders.filter(order =>
            order.status?.toLowerCase() === filter.toLowerCase()
        );
    };

    const getOrderStats = () => {
        const total = orders.length;
        const completed = orders.filter(o => o.status?.toLowerCase() === 'completed' || o.status?.toLowerCase() === 'delivered').length;
        const processing = orders.filter(o => o.status?.toLowerCase() === 'processing' || o.status?.toLowerCase() === 'shipped').length;

        return { total, completed, processing };
    };

    const stats = getOrderStats();
    const filteredOrders = getFilteredOrders();

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
                            Loading Orders
                        </p>
                        <p style={{
                            color: colors.grayText,
                            fontSize: '14px',
                            margin: 0,
                            fontWeight: '300'
                        }}>
                            Retrieving your order history
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
                        Unable to Load Orders
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
                        📦
                    </span>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '400',
                        fontFamily: '"Times New Roman", serif',
                        margin: '0 0 16px 0',
                        color: colors.text
                    }}>
                        Sign in to View Your Orders
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: colors.grayText,
                        margin: '0 0 32px 0',
                        lineHeight: 1.6
                    }}>
                        Track your packages, view past purchases, and manage your returns by signing in.
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
                    textAlign: 'center'
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
                        Order History
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: colors.grayText,
                        margin: 0,
                        fontWeight: '300'
                    }}>
                        {orders.length === 0
                            ? "You haven't placed any orders yet"
                            : `You have ${orders.length} ${orders.length === 1 ? 'order' : 'orders'} total`
                        }
                    </p>
                </div>

                {/* Stats Cards */}
                {orders.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            backgroundColor: colors.grayLight,
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '14px',
                                color: colors.grayText,
                                margin: '0 0 8px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Total Orders
                            </p>
                            <p style={{
                                fontSize: '36px',
                                fontWeight: '300',
                                fontFamily: '"Times New Roman", serif',
                                margin: 0,
                                color: colors.text
                            }}>
                                {stats.total}
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: colors.grayLight,
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '14px',
                                color: colors.grayText,
                                margin: '0 0 8px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Completed
                            </p>
                            <p style={{
                                fontSize: '36px',
                                fontWeight: '300',
                                fontFamily: '"Times New Roman", serif',
                                margin: 0,
                                color: colors.success
                            }}>
                                {stats.completed}
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: colors.grayLight,
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '14px',
                                color: colors.grayText,
                                margin: '0 0 8px 0',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}>
                                Processing
                            </p>
                            <p style={{
                                fontSize: '36px',
                                fontWeight: '300',
                                fontFamily: '"Times New Roman", serif',
                                margin: 0,
                                color: colors.warning
                            }}>
                                {stats.processing}
                            </p>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                {orders.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '30px',
                        borderBottom: `1px solid ${colors.grayLight}`,
                        paddingBottom: '20px',
                        flexWrap: 'wrap'
                    }}>
                        {['all', 'processing', 'completed', 'cancelled'].map((filterOption) => (
                            <button
                                key={filterOption}
                                onClick={() => setFilter(filterOption)}
                                style={{
                                    backgroundColor: filter === filterOption ? colors.text : 'transparent',
                                    color: filter === filterOption ? colors.background : colors.grayText,
                                    border: 'none',
                                    padding: '8px 20px',
                                    fontSize: '14px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (filter !== filterOption) {
                                        e.target.style.backgroundColor = colors.grayLight;
                                        e.target.style.color = colors.text;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (filter !== filterOption) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = colors.grayText;
                                    }
                                }}
                            >
                                {filterOption}
                            </button>
                        ))}
                    </div>
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
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
                            📦
                        </span>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '400',
                            fontFamily: '"Times New Roman", serif',
                            margin: '0 0 16px 0',
                            color: colors.text
                        }}>
                            No Orders Yet
                        </h2>
                        <p style={{
                            fontSize: '16px',
                            color: colors.grayText,
                            margin: '0 0 32px 0',
                            lineHeight: 1.6
                        }}>
                            Looks like you haven't placed any orders. Start exploring our collection to find your perfect piece.
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
                                Shop Now
                            </button>
                        </Link>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    // No matching orders for filter
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: colors.grayLight,
                        borderRadius: '4px'
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: colors.grayText,
                            marginBottom: '20px'
                        }}>
                            No {filter} orders found
                        </p>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                backgroundColor: 'transparent',
                                color: colors.text,
                                border: `1px solid ${colors.text}`,
                                padding: '10px 30px',
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
                            View All Orders
                        </button>
                    </div>
                ) : (
                    // Orders List
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                style={{
                                    border: `1px solid ${colors.grayLight}`,
                                    backgroundColor: colors.background,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                                onClick={() => toggleOrderExpansion(order.id)}
                                onMouseEnter={(e) => {
                                    if (expandedOrder !== order.id) {
                                        e.currentTarget.style.borderColor = colors.grayMedium;
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (expandedOrder !== order.id) {
                                        e.currentTarget.style.borderColor = colors.grayLight;
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {/* Order Summary */}
                                <div style={{
                                    padding: '24px',
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto',
                                    gap: '20px',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    {/* Order Icon with Status */}
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor: getStatusColor(order.status),
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFFFFF',
                                        fontSize: '20px'
                                    }}>
                                        {getStatusIcon(order.status)}
                                    </div>

                                    {/* Order Info */}
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '8px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{
                                                fontWeight: '500',
                                                fontSize: '16px'
                                            }}>
                                                Order #{order.id}
                                            </span>
                                            <span style={{
                                                padding: '4px 10px',
                                                backgroundColor: getStatusColor(order.status),
                                                color: '#FFFFFF',
                                                fontSize: '11px',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                borderRadius: '20px'
                                            }}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '24px',
                                            flexWrap: 'wrap',
                                            color: colors.grayText,
                                            fontSize: '14px'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                📅 {formatDate(order.created_at)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                💳 {formatCurrency(order.total_amount)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                📦 {order.items_count || order.items?.length || 0} items
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expand Indicator */}
                                    <div style={{
                                        color: colors.grayText,
                                        fontSize: '14px',
                                        transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.3s ease'
                                    }}>
                                        ▼
                                    </div>
                                </div>

                                {/* Expanded Order Details */}
                                {expandedOrder === order.id && (
                                    <div style={{
                                        padding: '24px',
                                        borderTop: `1px solid ${colors.grayLight}`,
                                        backgroundColor: colors.grayLight,
                                        animation: 'slideDown 0.3s ease'
                                    }}>
                                        {/* Order Items */}
                                        {order.items && order.items.length > 0 && (
                                            <div style={{ marginBottom: '30px' }}>
                                                <h4 style={{
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    margin: '0 0 20px 0',
                                                    color: colors.text
                                                }}>
                                                    Order Items
                                                </h4>

                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '12px'
                                                }}>
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: '50px 1fr auto',
                                                                gap: '15px',
                                                                alignItems: 'center',
                                                                padding: '12px',
                                                                backgroundColor: colors.background
                                                            }}
                                                        >
                                                            {/* Product Image Placeholder */}
                                                            <div style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                backgroundColor: colors.grayMedium,
                                                                borderRadius: '2px'
                                                            }} />

                                                            {/* Product Details */}
                                                            <div>
                                                                <Link
                                                                    to={`/product/${item.product_id}`}
                                                                    style={{
                                                                        fontSize: '15px',
                                                                        fontWeight: '500',
                                                                        color: colors.text,
                                                                        textDecoration: 'none',
                                                                        marginBottom: '4px',
                                                                        display: 'block'
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onMouseEnter={(e) => e.target.style.color = colors.grayText}
                                                                    onMouseLeave={(e) => e.target.style.color = colors.text}
                                                                >
                                                                    {item.name || `Product #${item.product_id}`}
                                                                </Link>
                                                                <p style={{
                                                                    fontSize: '13px',
                                                                    color: colors.grayText,
                                                                    margin: 0
                                                                }}>
                                                                    Qty: {item.quantity || 1} × {formatCurrency(item.price || 0)}
                                                                </p>
                                                            </div>

                                                            {/* Item Total */}
                                                            <div style={{
                                                                fontWeight: '500',
                                                                color: colors.text
                                                            }}>
                                                                {formatCurrency((item.quantity || 1) * (item.price || 0))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Summary Details */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '20px',
                                            marginBottom: '30px'
                                        }}>
                                            {/* Shipping Address */}
                                            <div>
                                                <h5 style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    margin: '0 0 12px 0',
                                                    color: colors.grayText
                                                }}>
                                                    Shipping Address
                                                </h5>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: colors.text,
                                                    lineHeight: 1.6,
                                                    margin: 0
                                                }}>
                                                    {order.shipping_address || 'No address provided'}
                                                </p>
                                            </div>

                                            {/* Payment Summary */}
                                            <div>
                                                <h5 style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    margin: '0 0 12px 0',
                                                    color: colors.grayText
                                                }}>
                                                    Payment Summary
                                                </h5>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: colors.text,
                                                    lineHeight: 1.8
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Subtotal:</span>
                                                        <span>{formatCurrency(order.subtotal || order.total_amount)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>Shipping:</span>
                                                        <span>{formatCurrency(order.shipping_cost || 0)}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '500', marginTop: '8px' }}>
                                                        <span>Total:</span>
                                                        <span>{formatCurrency(order.total_amount)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div>
                                                <h5 style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    letterSpacing: '1px',
                                                    textTransform: 'uppercase',
                                                    margin: '0 0 12px 0',
                                                    color: colors.grayText
                                                }}>
                                                    Timeline
                                                </h5>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: colors.grayText,
                                                    lineHeight: 1.8
                                                }}>
                                                    <div>Order placed: {formatDate(order.created_at)}</div>
                                                    {order.updated_at && (
                                                        <div>Last updated: {formatDate(order.updated_at)}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '15px',
                                            justifyContent: 'flex-end',
                                            borderTop: `1px solid ${colors.grayMedium}`,
                                            paddingTop: '20px'
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Handle track package
                                                }}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    color: colors.text,
                                                    border: `1px solid ${colors.text}`,
                                                    padding: '10px 24px',
                                                    fontSize: '13px',
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
                                                Track Order
                                            </button>
                                            <Link to={`/products`}>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        backgroundColor: colors.text,
                                                        color: colors.background,
                                                        border: `1px solid ${colors.text}`,
                                                        padding: '10px 24px',
                                                        fontSize: '13px',
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
                                                    }}
                                                >
                                                    Shop Again
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    div[style*="grid-template-columns: auto 1fr auto"] {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                    }
                    
                    div[style*="display: flex; gap: 24px;"] {
                        justify-content: center;
                    }
                    
                    div[style*="justify-content: flex-end"] {
                        justify-content: center !important;
                    }
                }
                
                @media (max-width: 480px) {
                    div[style*="padding: 60px 0 100px 0"] {
                        padding: 40px 0 60px 0 !important;
                    }
                    
                    div[style*="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, User, Search, X, Menu } from "lucide-react";

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <style>{`
                .navbar {
                    width: 100%;
                    border-bottom: 1px solid #e5e7eb;
                    background: white;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .nav-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    position: relative;
                }

                /* Left Menu */
                .nav-menu {
                    display: flex;
                    gap: 1.5rem;
                }

                .nav-link {
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    color: #1f2937;
                    transition: all 0.2s;
                    position: relative;
                }

                .nav-link:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: -4px;
                    left: 0;
                    background-color: #b45309;
                    transition: width 0.2s;
                }

                .nav-link:hover {
                    color: #b45309;
                }

                .nav-link:hover:after {
                    width: 100%;
                }

                /* Logo */
                .logo-link {
                    text-decoration: none;
                    color: inherit;
                }

                .logo {
                    font-size: 1.5rem;
                    letter-spacing: 0.3em;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                    transition: color 0.2s;
                    position: relative;
                }

                .logo:hover {
                    color: #b45309;
                }

                /* Right Icons */
                .nav-icons {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .icon-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .icon-link, .search-icon {
                    display: flex;
                    align-items: center;
                    color: #1f2937;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .icon-link:hover, .search-icon:hover {
                    color: #b45309;
                    transform: scale(1.1);
                }

                .icon {
                    width: 1.25rem;
                    height: 1.25rem;
                }

                /* Cart Badge */
                .cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #b45309;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 600;
                    width: 1.25rem;
                    height: 1.25rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid white;
                }

                /* Search Overlay */
                .search-overlay {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-bottom: 1px solid #e5e7eb;
                    animation: slideDown 0.3s ease;
                }

                .search-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .search-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #b45309;
                    box-shadow: 0 0 0 2px rgba(180, 83, 9, 0.1);
                }

                .close-search {
                    cursor: pointer;
                    color: #6b7280;
                    transition: color 0.2s;
                }

                .close-search:hover {
                    color: #b45309;
                }

                /* Mobile Menu */
                .mobile-menu-button {
                    display: none;
                    cursor: pointer;
                }

                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 73px;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-bottom: 1px solid #e5e7eb;
                    animation: slideDown 0.3s ease;
                }

                .mobile-menu-item {
                    display: block;
                    padding: 1rem;
                    text-decoration: none;
                    color: #1f2937;
                    font-weight: 500;
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.2s;
                }

                .mobile-menu-item:hover {
                    background: #fef3c7;
                    color: #b45309;
                }

                .mobile-menu-item:last-child {
                    border-bottom: none;
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

                /* Responsive Design */
                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0.75rem 1rem;
                    }

                    .nav-menu {
                        display: none;
                    }

                    .mobile-menu-button {
                        display: block;
                    }

                    .logo {
                        font-size: 1.25rem;
                        letter-spacing: 0.2em;
                    }

                    .nav-icons {
                        gap: 0.75rem;
                    }

                    .icon {
                        width: 1rem;
                        height: 1rem;
                    }

                    .mobile-menu {
                        display: block;
                    }
                }

                @media (max-width: 480px) {
                    .logo {
                        font-size: 1rem;
                        letter-spacing: 0.15em;
                    }

                    .nav-icons {
                        gap: 0.5rem;
                    }

                    .cart-badge {
                        width: 1rem;
                        height: 1rem;
                        font-size: 0.6rem;
                        top: -6px;
                        right: -6px;
                    }
                }
            `}</style>

            <nav className="navbar">
                <div className="nav-container">
                    {/* Left Menu - Desktop */}
                    <div className="nav-menu">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/products" className="nav-link">Shop</Link>
                        <Link to="/orders" className="nav-link">Orders</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu className="icon" />
                    </div>

                    {/* Logo */}
                    <Link to="/" className="logo-link">
                        <h1 className="logo">HATIMS</h1>
                    </Link>

                    {/* Right Icons */}
                    <div className="nav-icons">
                        <div className="icon-wrapper">
                            <Search
                                className="search-icon icon"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            />
                        </div>

                        <Link to="/wishlist" className="icon-link">
                            <Heart className="icon" />
                        </Link>

                        <Link to="/cart" className="icon-link">
                            <div className="icon-wrapper">
                                <ShoppingBag className="icon" />
                                <span className="cart-badge">0</span>
                            </div>
                        </Link>

                        <Link to="/login" className="icon-link">
                            <User className="icon" />
                        </Link>
                    </div>
                </div>

                {/* Search Overlay */}
                {isSearchOpen && (
                    <div className="search-overlay">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="search-input"
                                autoFocus
                            />
                            <X
                                className="close-search icon"
                                onClick={() => setIsSearchOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link to="/" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/products" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link to="/orders" className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                    </div>
                )}
            </nav>
        </>
    );
}
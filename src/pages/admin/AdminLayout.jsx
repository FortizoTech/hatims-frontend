import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/Hatims_Logo.png";

export default function AdminLayout() {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/products", icon: Package, label: "Products" },
        { path: "/admin/categories", icon: Tags, label: "Categories" },
        { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
        { path: "/admin/users", icon: Users, label: "Users" }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
            {/* Sidebar Navigation */}
            <aside style={{ 
                width: '260px', 
                backgroundColor: '#ffffff', 
                borderRight: '1px solid #E0E0E0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #E0E0E0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={logo} alt="HATIMS" style={{ height: '32px', objectFit: 'contain' }} />
                        <span style={{ 
                            fontSize: '18px', 
                            letterSpacing: '1px', 
                            fontWeight: '600', 
                            color: '#282829' 
                        }}>ADMIN</span>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    color: isActive ? '#FFFFFF' : '#6B6B6B',
                                    backgroundColor: isActive ? '#282829' : 'transparent',
                                    fontWeight: isActive ? '500' : '400',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '24px 16px', borderTop: '1px solid #E0E0E0' }}>
                    <button 
                        onClick={() => { logout(); window.location.href = '/login'; }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#e53e3e',
                            cursor: 'pointer',
                            fontSize: '16px',
                            textAlign: 'left'
                        }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <Link to="/" style={{
                        display: 'block',
                        marginTop: '12px',
                        textAlign: 'center',
                        color: '#6B6B6B',
                        textDecoration: 'none',
                        fontSize: '14px'
                    }}>
                        Back to Main App
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

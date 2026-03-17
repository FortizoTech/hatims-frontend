import { useState, useEffect } from "react";
import API from "../../api/api";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        ordersCount: 0,
        productsCount: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, ordersRes, productsRes] = await Promise.all([
                    API.get("/users/count"),
                    API.get("/orders/all"),
                    API.get("/products")
                ]);

                const orders = ordersRes.data;
                const totalRevenue = orders
                    .filter(o => o.status === 'delivered' || o.status === 'shipped' || o.status === 'paid')
                    .reduce((sum, o) => sum + Number(o.total_amount), 0);

                setStats({
                    usersCount: usersRes.data.count,
                    ordersCount: orders.length,
                    productsCount: productsRes.data.length,
                    revenue: totalRevenue
                });

            } catch (error) {
                console.error("Failed to fetch dashboard metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const statCards = [
        { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "#10b981", bg: "#d1fae5" },
        { label: "Total Orders", value: stats.ordersCount, icon: ShoppingCart, color: "#3b82f6", bg: "#dbeafe" },
        { label: "Total Products", value: stats.productsCount, icon: Package, color: "#f59e0b", bg: "#fef3c7" },
        { label: "Registered Users", value: stats.usersCount, icon: Users, color: "#8b5cf6", bg: "#ede9fe" }
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }}>Dashboard Overview</h2>
                <p style={{ color: '#6b7280', margin: 0 }}>Welcome back. Here is what's happening with your store today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} style={{
                            backgroundColor: 'white',
                            padding: '24px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: card.bg,
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{card.label}</p>
                                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '40px', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Quick Actions</h3>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>Navigate quickly using the sidebar on the left. Make sure to frequently check the Orders panel to process fulfillments.</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <a href="/admin/products" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#111827', color: 'white', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>Manage Products</a>
                    <a href="/admin/orders" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#111827', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>View Orders</a>
                </div>
            </div>
        </div>
    );
}

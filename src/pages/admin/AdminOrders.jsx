import { useState, useEffect } from "react";
import API from "../../api/api";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/all");
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            // Optimistically update local state instead of doing a full refetch
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Could not update order status.");
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { color: '#d97706', bg: '#fef3c7', icon: Clock }; // Amber
            case 'paid': return { color: '#0284c7', bg: '#e0f2fe', icon: Package }; // Light Blue
            case 'shipped': return { color: '#4f46e5', bg: '#e0e7ff', icon: Truck }; // Indigo
            case 'delivered': return { color: '#16a34a', bg: '#dcfce7', icon: CheckCircle }; // Green
            case 'cancelled': return { color: '#dc2626', bg: '#fee2e2', icon: XCircle }; // Red
            default: return { color: '#6b7280', bg: '#f3f4f6', icon: Package };
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>Order Management</h2>
                <p style={{ color: '#6b7280', margin: 0 }}>Review and update the fulfillment status of all customer orders.</p>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Order ID</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Customer</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Date</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Total Amount</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px', width: '180px' }}>Update Status</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {orders.map(order => {
                            const config = getStatusConfig(order.status);
                            const StatusIcon = config.icon;
                            
                            return (
                                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                                        #{order.id.toString().padStart(4, '0')}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '500', color: '#111827' }}>{order.user_name}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.user_email}</div>
                                    </td>
                                    <td style={{ padding: '16px', color: '#4b5563', fontSize: '14px' }}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                                            backgroundColor: config.bg,
                                            color: config.color
                                        }}>
                                            <StatusIcon size={14} />
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                backgroundColor: 'white',
                                                fontSize: '13px',
                                                color: '#374151',
                                                cursor: 'pointer',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </div>
    );
}

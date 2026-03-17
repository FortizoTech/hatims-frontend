import { useState, useEffect } from "react";
import API from "../../api/api";
import { User, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            // Fetch users list and total count concurrently
            const [usersRes, countRes] = await Promise.all([
                API.get("/users"),
                API.get("/users/count")
            ]);
            setUsers(usersRes.data);
            setCount(countRes.data.count);
        } catch (error) {
            console.error("Failed to fetch users data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>Registered Users</h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>Total accounts on platform: <strong style={{ color: '#282829' }}>{count}</strong></p>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>User</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Contact</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Role</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Joined</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500', color: '#111827' }}>{u.name}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: #{u.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: '#4b5563', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <Mail size={14} style={{ color: '#9ca3af' }}/> {u.email}
                                    </div>
                                    {u.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Phone size={14} style={{ color: '#9ca3af' }}/> {u.phone}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ 
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                                        backgroundColor: u.role === 'admin' ? '#fef2f2' : '#f0fdf4',
                                        color: u.role === 'admin' ? '#991b1b' : '#166534'
                                    }}>
                                        {u.role === 'admin' && <ShieldCheck size={12} />}
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} />
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                        No users have registered yet.
                    </div>
                )}
            </div>
        </div>
    );
}

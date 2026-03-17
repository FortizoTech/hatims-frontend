import { useState, useEffect } from "react";
import API from "../../api/api";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: ""
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                API.get("/products"),
                API.get("/categories")
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Failed to fetch product data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category_id);
        
        images.forEach(image => {
            data.append("images", image);
        });

        try {
            await API.post("/products", data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsCreating(false);
            setFormData({ name: "", description: "", price: "", stock: "", category_id: "" });
            setImages([]);
            fetchData();
        } catch (error) {
            console.error("Failed to create product:", error);
            alert("Failed to create product. Check console.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`/products/${id}`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete product:", error);
            alert("Failed to delete product.");
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Unknown';
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>Manage Products</h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>Create, update, and remove products from the catalog.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    style={{
                        padding: '10px 16px', backgroundColor: '#1f2937', color: 'white',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} style={{
                    backgroundColor: 'white', padding: '24px', borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
                }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <h3 style={{ margin: '0 0 16px 0' }}>Create New Product</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Category</label>
                        <select required name="category_id" value={formData.category_id} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: 'white' }}>
                            <option value="">Select Category...</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Price ($)</label>
                        <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Stock Quantity</label>
                        <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleInputChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px', minHeight: '80px' }} />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Product Images</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>You can select multiple images at once. The first image will be the primary image.</span>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#b45309', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Save Product
                        </button>
                        <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px', width: '60px' }}>Image</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Product Details</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Category</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Price</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Stock</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px' }}>
                                    {p.image ? (
                                        <img src={`http://localhost:5000/uploads/products/${p.image}`} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                                    ) : (
                                        <div style={{ width: '48px', height: '48px', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>{p.name}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {p.description}
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: '#4b5563', fontSize: '14px' }}>
                                    {getCategoryName(p.category_id)}
                                </td>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                                    ${Number(p.price).toFixed(2)}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                                        backgroundColor: p.stock > 10 ? '#dcfce7' : p.stock > 0 ? '#fef3c7' : '#fee2e2',
                                        color: p.stock > 10 ? '#16a34a' : p.stock > 0 ? '#d97706' : '#dc2626'
                                    }}>
                                        {p.stock} in stock
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <button 
                                        onClick={() => handleDelete(p.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                        title="Delete Product"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                        No products found. Start by adding one.
                    </div>
                )}
            </div>
        </div>
    );
}

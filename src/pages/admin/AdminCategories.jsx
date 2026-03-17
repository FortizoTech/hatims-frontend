import { useState, useEffect } from "react";
import API from "../../api/api";
import { Plus, Trash2, Edit } from "lucide-react";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await API.get("/categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post("/categories", { name, description });
            setName("");
            setDescription("");
            setIsCreating(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to create category:", error);
            alert("Failed to create category.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await API.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Failed to delete category. It might be linked to existing products.");
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Manage Categories</h2>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <h3 style={{ margin: 0 }}>Create New Category</h3>
                    <input 
                        required
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    <textarea 
                        required
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '4px', minHeight: '80px' }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#b45309', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Save
                        </button>
                        <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '10px 24px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Name</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px' }}>Description</th>
                            <th style={{ padding: '16px', fontWeight: '500', color: '#6b7280', fontSize: '14px', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {categories.map(cat => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px', fontWeight: '500' }}>{cat.name}</td>
                                <td style={{ padding: '16px', color: '#6b7280' }}>{cat.description}</td>
                                <td style={{ padding: '16px' }}>
                                    <button 
                                        onClick={() => handleDelete(cat.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                        title="Delete Category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                        No categories found. Start by adding one.
                    </div>
                )}
            </div>
        </div>
    );
}

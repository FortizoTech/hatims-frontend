import React, { useEffect, useState } from 'react';
import API, { API_BASE_URL } from '../api/api';

export default function LookBook() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const colors = {
        background: '#FFFFFF',
        text: '#282829',
        accent: '#FAEAC6',
        grayLight: '#F5F5F5',
        grayMedium: '#E0E0E0',
        grayText: '#6B6B6B'
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await API.get('/products/images');
                setImages(res.data);
            } catch (error) {
                console.error('Error fetching lookbook images:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh', padding: '60px 24px', paddingTop: '100px' }}>
            <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ 
                        fontSize: 'clamp(32px, 5vw, 48px)', 
                        fontFamily: '"Times New Roman", serif', 
                        fontWeight: '400',
                        marginBottom: '10px'
                    }}>The HATIMS Lookbook</h1>
                    <p style={{ color: colors.grayText, fontSize: '18px' }}>A curated gallery of elegance and inspiration.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: `2px solid ${colors.grayMedium}`,
                            borderTopColor: colors.text,
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 1s linear infinite'
                        }} />
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                        gridAutoRows: '400px'
                    }}>
                        {images.map((img, idx) => (
                            <div key={img.id} style={{ 
                                overflow: 'hidden', 
                                backgroundColor: colors.grayLight,
                                position: 'relative'
                            }}>
                                <img 
                                    src={`${API_BASE_URL}/uploads/products/${img.image_url}`} 
                                    alt={`Lookbook ${idx}`}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

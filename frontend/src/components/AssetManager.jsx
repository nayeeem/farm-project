import React, { useState, useEffect } from 'react';
import api from '../api';

const AssetManager = () => {
    const [assets, setAssets] = useState([]);
    const [assetForm, setAssetForm] = useState({ name: '', type: '', value: 0 });

    const fetchAssets = async () => {
        try {
            const response = await api.get('/assets/');
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assets/', assetForm);
            setAssetForm({ name: '', type: '', value: 0 });
            fetchAssets();
        } catch (error) {
            console.error('Error creating asset:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await api.delete(`/assets/${id}`);
                fetchAssets();
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    const getTotalValue = () => {
        return assets.reduce((sum, asset) => sum + asset.value, 0);
    };

    const getAssetIcon = (type) => {
        const icons = {
            'land': '🌾',
            'machinery': '🚜',
            'vehicle': '🚗',
            'building': '🏠',
            'equipment': '🔧',
            'livestock': '🐄',
        };
        return icons[type.toLowerCase()] || '📦';
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Asset Management</h2>
                <div style={{
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                }}>
                    Total Value: ${getTotalValue().toFixed(2)}
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3>Add New Asset</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Asset Name</label>
                            <input
                                type="text"
                                value={assetForm.name}
                                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                                placeholder="e.g., Tractor, Land Plot A"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
                            <select
                                value={assetForm.type}
                                onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                                required
                            >
                                <option value="">Select type</option>
                                <option value="land">Land</option>
                                <option value="machinery">Machinery</option>
                                <option value="vehicle">Vehicle</option>
                                <option value="building">Building</option>
                                <option value="equipment">Equipment</option>
                                <option value="livestock">Livestock</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Value ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={assetForm.value}
                                onChange={(e) => setAssetForm({ ...assetForm, value: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Asset</button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className="card"
                        style={{
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                            {getAssetIcon(asset.type)}
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{asset.name}</h3>
                        <p style={{
                            textAlign: 'center',
                            textTransform: 'capitalize',
                            color: 'var(--primary-color)',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>
                            {asset.type}
                        </p>
                        <div style={{
                            padding: '0.75rem',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '0.5rem',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Value</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                ${asset.value.toFixed(2)}
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1rem' }}>
                            Purchased: {new Date(asset.purchase_date).toLocaleDateString()}
                        </div>
                        <button
                            className="btn btn-danger"
                            style={{ width: '100%' }}
                            onClick={() => handleDelete(asset.id)}
                        >
                            Delete Asset
                        </button>
                    </div>
                ))}
            </div>

            {assets.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                    <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>No assets found. Add your first asset above!</p>
                </div>
            )}
        </div>
    );
};

export default AssetManager;

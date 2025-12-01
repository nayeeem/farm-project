import React, { useState, useEffect } from 'react';
import api from '../api';

const LandManager = () => {
    const [lands, setLands] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLand, setEditingLand] = useState(null);
    const [landForm, setLandForm] = useState({
        name: '',
        location: '',
        size: 0,
        soil_type: '',
        tax_amount: 0,
        farmer_id: ''
    });

    const fetchLands = async () => {
        try {
            const response = await api.get('/lands/');
            setLands(response.data);
        } catch (error) {
            console.error('Error fetching lands:', error);
        }
    };

    const fetchFarmers = async () => {
        try {
            const response = await api.get('/farmers/');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    useEffect(() => {
        fetchLands();
        fetchFarmers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...landForm,
                farmer_id: landForm.farmer_id ? parseInt(landForm.farmer_id) : null,
                tax_amount: parseFloat(landForm.tax_amount) || 0
            };

            if (editingLand) {
                await api.put(`/lands/${editingLand.id}`, payload);
            } else {
                await api.post('/lands/', payload);
            }

            setLandForm({ name: '', location: '', size: 0, soil_type: '', tax_amount: 0, farmer_id: '' });
            setEditingLand(null);
            setIsFormOpen(false);
            fetchLands();
        } catch (error) {
            console.error('Error saving land:', error);
        }
    };

    const handleEdit = (land) => {
        setEditingLand(land);
        setLandForm({
            name: land.name,
            location: land.location,
            size: land.size,
            soil_type: land.soil_type || '',
            tax_amount: land.tax_amount || 0,
            farmer_id: land.farmer_id || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this land?')) {
            try {
                await api.delete(`/lands/${id}`);
                fetchLands();
            } catch (error) {
                console.error('Error deleting land:', error);
            }
        }
    };

    const handleAssignFarmer = async (landId, farmerId) => {
        try {
            await api.put(`/lands/${landId}/assign/${farmerId}`);
            fetchLands();
        } catch (error) {
            console.error('Error assigning farmer:', error);
        }
    };

    const getFarmerName = (farmerId) => {
        const farmer = farmers.find(f => f.id === farmerId);
        return farmer ? farmer.name : 'Unassigned';
    };

    const handleCreate = () => {
        setEditingLand(null);
        setLandForm({ name: '', location: '', size: 0, soil_type: '', tax_amount: 0, farmer_id: '' });
        setIsFormOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Land Management</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    + Add Land
                </button>
            </div>

            {isFormOpen && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3>{editingLand ? 'Edit Land' : 'Add New Land'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Land Name</label>
                                <input
                                    type="text"
                                    value={landForm.name}
                                    onChange={(e) => setLandForm({ ...landForm, name: e.target.value })}
                                    placeholder="e.g., North Field"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                                <input
                                    type="text"
                                    value={landForm.location}
                                    onChange={(e) => setLandForm({ ...landForm, location: e.target.value })}
                                    placeholder="e.g., Section A"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Size (acres)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={landForm.size}
                                    onChange={(e) => setLandForm({ ...landForm, size: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Soil Type</label>
                                <input
                                    type="text"
                                    value={landForm.soil_type}
                                    onChange={(e) => setLandForm({ ...landForm, soil_type: e.target.value })}
                                    placeholder="e.g., Clay, Loam"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Annual Tax ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={landForm.tax_amount}
                                    onChange={(e) => setLandForm({ ...landForm, tax_amount: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Assign to Farmer</label>
                                <select
                                    value={landForm.farmer_id}
                                    onChange={(e) => setLandForm({ ...landForm, farmer_id: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {farmers.map((farmer) => (
                                        <option key={farmer.id} value={farmer.id}>
                                            {farmer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingLand ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingLand(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {lands.map((land) => (
                    <div
                        key={land.id}
                        className="card"
                        style={{
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
                            🌾
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{land.name}</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8' }}>Location:</span>
                                <span style={{ fontWeight: '600' }}>{land.location}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8' }}>Size:</span>
                                <span style={{ fontWeight: '600' }}>{land.size} acres</span>
                            </div>
                            {land.soil_type && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#94a3b8' }}>Soil Type:</span>
                                    <span style={{ fontWeight: '600' }}>{land.soil_type}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#94a3b8' }}>Annual Tax:</span>
                                <span style={{ fontWeight: '600', color: 'var(--accent-color)' }}>${land.tax_amount?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: '#94a3b8' }}>Assigned to:</span>
                                <span style={{
                                    fontWeight: '600',
                                    color: land.farmer_id ? 'var(--secondary-color)' : '#94a3b8'
                                }}>
                                    {getFarmerName(land.farmer_id)}
                                </span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                                    Reassign Farmer:
                                </label>
                                <select
                                    value={land.farmer_id || ''}
                                    onChange={(e) => handleAssignFarmer(land.id, e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Unassigned</option>
                                    {farmers.map((farmer) => (
                                        <option key={farmer.id} value={farmer.id}>
                                            {farmer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => handleEdit(land)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                                onClick={() => handleDelete(land.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {lands.length === 0 && !isFormOpen && (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
                    <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>No lands found. Add your first land above!</p>
                </div>
            )}
        </div>
    );
};

export default LandManager;

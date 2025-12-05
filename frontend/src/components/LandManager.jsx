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
                <div className="card" style={{ marginBottom: '1.5rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                        {editingLand ? 'Edit Land' : 'Add New Land'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
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
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
                            <button type="submit" className="btn btn-primary">
                                {editingLand ? 'Update Land' : 'Create Land'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Size (Acres)</th>
                            <th>Soil Type</th>
                            <th>Annual Tax</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lands.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    No lands found. Add your first land to get started.
                                </td>
                            </tr>
                        ) : (
                            lands.map((land) => (
                                <tr key={land.id}>
                                    <td style={{ fontWeight: 500 }}>{land.name}</td>
                                    <td>{land.location}</td>
                                    <td>{land.size}</td>
                                    <td>{land.soil_type || '-'}</td>
                                    <td>${land.tax_amount?.toFixed(2) || '0.00'}</td>
                                    <td>
                                        <span className={land.farmer_id ? 'badge-success' : 'badge-neutral'} style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: land.farmer_id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                            color: land.farmer_id ? '#34d399' : '#cbd5e1'
                                        }}>
                                            {getFarmerName(land.farmer_id)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                                onClick={() => handleEdit(land)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                                onClick={() => handleDelete(land.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LandManager;

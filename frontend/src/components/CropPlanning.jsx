import React, { useState, useEffect } from 'react';
import api from '../api';

const CropPlanning = () => {
    const [crops, setCrops] = useState([]);
    const [lands, setLands] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);
    const [cropForm, setCropForm] = useState({
        land_id: '',
        crop_name: '',
        variety: '',
        planting_date: '',
        expected_harvest_date: '',
        expected_yield: 0,
        notes: ''
    });

    const fetchCrops = async () => {
        try {
            const response = await api.get('/crops/');
            setCrops(response.data);
        } catch (error) {
            console.error('Error fetching crops:', error);
        }
    };

    const fetchCropsByLand = async (landId) => {
        try {
            const response = await api.get(`/crops/land/${landId}/4months`);
            setCrops(response.data);
        } catch (error) {
            console.error('Error fetching crops for land:', error);
        }
    };

    const fetchLands = async () => {
        try {
            const response = await api.get('/lands/');
            setLands(response.data);
        } catch (error) {
            console.error('Error fetching lands:', error);
        }
    };

    useEffect(() => {
        fetchCrops();
        fetchLands();
    }, []);

    const handleLandChange = (landId) => {
        setSelectedLand(landId);
        if (landId) {
            fetchCropsByLand(landId);
        } else {
            fetchCrops();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...cropForm,
                land_id: parseInt(cropForm.land_id),
                expected_yield: parseFloat(cropForm.expected_yield) || 0
            };

            if (editingCrop) {
                await api.put(`/crops/${editingCrop.id}`, payload);
            } else {
                await api.post('/crops/', payload);
            }

            setCropForm({ land_id: '', crop_name: '', variety: '', planting_date: '', expected_harvest_date: '', expected_yield: 0, notes: '' });
            setEditingCrop(null);
            setIsFormOpen(false);

            if (selectedLand) {
                fetchCropsByLand(selectedLand);
            } else {
                fetchCrops();
            }
        } catch (error) {
            console.error('Error saving crop:', error);
        }
    };

    const handleEdit = (crop) => {
        setEditingCrop(crop);
        setCropForm({
            land_id: crop.land_id,
            crop_name: crop.crop_name,
            variety: crop.variety || '',
            planting_date: crop.planting_date ? new Date(crop.planting_date).toISOString().split('T')[0] : '',
            expected_harvest_date: crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toISOString().split('T')[0] : '',
            expected_yield: crop.expected_yield || 0,
            notes: crop.notes || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this crop plan?')) {
            try {
                await api.delete(`/crops/${id}`);
                if (selectedLand) {
                    fetchCropsByLand(selectedLand);
                } else {
                    fetchCrops();
                }
            } catch (error) {
                console.error('Error deleting crop:', error);
            }
        }
    };

    const handleMarkHarvested = async (crop) => {
        try {
            await api.put(`/crops/${crop.id}`, {
                status: 'Harvested',
                actual_harvest_date: new Date().toISOString()
            });
            if (selectedLand) {
                fetchCropsByLand(selectedLand);
            } else {
                fetchCrops();
            }
        } catch (error) {
            console.error('Error updating crop:', error);
        }
    };

    const getLandName = (landId) => {
        const land = lands.find(l => l.id === landId);
        return land ? land.name : 'Unknown';
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Planned': 'background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3)',
            'Growing': 'background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3)',
            'Harvested': 'background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3)',
        };
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                ...Object.fromEntries(colors[status]?.split(';').map(s => s.split(':').map(p => p.trim())) || [])
            }}>
                {status}
            </span>
        );
    };

    const handleCreate = () => {
        setEditingCrop(null);
        setCropForm({ land_id: selectedLand || '', crop_name: '', variety: '', planting_date: '', expected_harvest_date: '', expected_yield: 0, notes: '' });
        setIsFormOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Crop Planning (4-Month View)</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    + Plan Crop
                </button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Filter by Land:</label>
                <select
                    value={selectedLand}
                    onChange={(e) => handleLandChange(e.target.value)}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <option value="">All Lands</option>
                    {lands.map((land) => (
                        <option key={land.id} value={land.id}>
                            {land.name} - {land.location}
                        </option>
                    ))}
                </select>
            </div>

            {isFormOpen && (
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3>{editingCrop ? 'Edit Crop Plan' : 'Plan New Crop'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Land</label>
                                <select
                                    value={cropForm.land_id}
                                    onChange={(e) => setCropForm({ ...cropForm, land_id: e.target.value })}
                                    required
                                    disabled={!!editingCrop}
                                >
                                    <option value="">Select a land</option>
                                    {lands.map((land) => (
                                        <option key={land.id} value={land.id}>
                                            {land.name} - {land.location}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Crop Name</label>
                                <input
                                    type="text"
                                    value={cropForm.crop_name}
                                    onChange={(e) => setCropForm({ ...cropForm, crop_name: e.target.value })}
                                    placeholder="e.g., Wheat, Rice, Corn"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Variety</label>
                                <input
                                    type="text"
                                    value={cropForm.variety}
                                    onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                                    placeholder="e.g., Basmati, Hybrid"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Planting Date</label>
                                <input
                                    type="date"
                                    value={cropForm.planting_date}
                                    onChange={(e) => setCropForm({ ...cropForm, planting_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Expected Harvest Date</label>
                                <input
                                    type="date"
                                    value={cropForm.expected_harvest_date}
                                    onChange={(e) => setCropForm({ ...cropForm, expected_harvest_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Expected Yield (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={cropForm.expected_yield}
                                    onChange={(e) => setCropForm({ ...cropForm, expected_yield: parseFloat(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notes</label>
                                <textarea
                                    value={cropForm.notes}
                                    onChange={(e) => setCropForm({ ...cropForm, notes: e.target.value })}
                                    rows="2"
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                {editingCrop ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setEditingCrop(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h3>Crop Schedule</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Land</th>
                            <th>Crop</th>
                            <th>Variety</th>
                            <th>Planting Date</th>
                            <th>Harvest Date</th>
                            <th>Expected Yield</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map((crop) => (
                            <tr key={crop.id}>
                                <td>{getLandName(crop.land_id)}</td>
                                <td style={{ fontWeight: '600' }}>{crop.crop_name}</td>
                                <td>{crop.variety || '-'}</td>
                                <td>{new Date(crop.planting_date).toLocaleDateString()}</td>
                                <td>{new Date(crop.expected_harvest_date).toLocaleDateString()}</td>
                                <td>{crop.expected_yield ? `${crop.expected_yield} kg` : '-'}</td>
                                <td>{getStatusBadge(crop.status)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => handleEdit(crop)}>Edit</button>
                                        {crop.status !== 'Harvested' && (
                                            <button className="btn btn-primary" style={{ padding: '0.5rem' }} onClick={() => handleMarkHarvested(crop)}>Harvest</button>
                                        )}
                                        <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(crop.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {crops.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No crops planned. Start planning your crops!</p>}
            </div>
        </div>
    );
};

export default CropPlanning;

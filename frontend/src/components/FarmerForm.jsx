import React, { useState, useEffect } from 'react';
import api from '../api';

const FarmerForm = ({ farmer, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (farmer) {
            setFormData({
                name: farmer.name,
                phone: farmer.phone || '',
                address: farmer.address || '',
            });
        }
    }, [farmer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (farmer) {
                await api.put(`/farmers/${farmer.id}`, formData);
            } else {
                await api.post('/farmers/', formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving farmer:', error);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h3>{farmer ? 'Edit Farmer' : 'Add New Farmer'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                        {farmer ? 'Update' : 'Create'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FarmerForm;

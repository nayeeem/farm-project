import React, { useState, useEffect } from 'react';
import api from '../api';
import FarmerForm from './FarmerForm';

const FarmerList = () => {
    const [farmers, setFarmers] = useState([]);
    const [editingFarmer, setEditingFarmer] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchFarmers = async () => {
        try {
            const response = await api.get('/farmers/');
            setFarmers(response.data);
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this farmer?')) {
            try {
                await api.delete(`/farmers/${id}`);
                fetchFarmers();
            } catch (error) {
                console.error('Error deleting farmer:', error);
            }
        }
    };

    const handleEdit = (farmer) => {
        setEditingFarmer(farmer);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingFarmer(null);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingFarmer(null);
        fetchFarmers();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Farmers</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    + Add Farmer
                </button>
            </div>

            {isFormOpen && (
                <div style={{ marginBottom: '2rem' }}>
                    <FarmerForm farmer={editingFarmer} onClose={handleFormClose} />
                </div>
            )}

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.map((farmer) => (
                            <tr key={farmer.id}>
                                <td>{farmer.name}</td>
                                <td>{farmer.phone}</td>
                                <td>{farmer.address}</td>
                                <td>
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.5rem' }} onClick={() => handleEdit(farmer)}>Edit</button>
                                    <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(farmer.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {farmers.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No farmers found.</p>}
            </div>
        </div>
    );
};

export default FarmerList;

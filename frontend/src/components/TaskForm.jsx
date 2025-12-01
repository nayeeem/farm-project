import React, { useState, useEffect } from 'react';
import api from '../api';

const TaskForm = ({ task, onClose, farmers }) => {
    const [formData, setFormData] = useState({
        description: '',
        status: 'Pending',
        farmer_id: '',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                description: task.description,
                status: task.status || 'Pending',
                farmer_id: task.farmer_id,
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (task) {
                await api.put(`/tasks/${task.id}`, {
                    description: formData.description,
                    status: formData.status,
                });
            } else {
                await api.post('/tasks/', formData);
            }
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <div className="card animate-fade-in">
            <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Farmer</label>
                        <select
                            name="farmer_id"
                            value={formData.farmer_id}
                            onChange={handleChange}
                            required
                            disabled={!!task}
                        >
                            <option value="">Select a farmer</option>
                            {farmers.map((farmer) => (
                                <option key={farmer.id} value={farmer.id}>
                                    {farmer.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary">
                        {task ? 'Update' : 'Create'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;

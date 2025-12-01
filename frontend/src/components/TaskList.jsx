import React, { useState, useEffect } from 'react';
import api from '../api';
import TaskForm from './TaskForm';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
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
        fetchTasks();
        fetchFarmers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingTask(null);
        fetchTasks();
    };

    const getFarmerName = (farmerId) => {
        const farmer = farmers.find(f => f.id === farmerId);
        return farmer ? farmer.name : 'Unknown';
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3)',
            'In Progress': 'background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3)',
            'Completed': 'background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3)',
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

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Tasks</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    + Add Task
                </button>
            </div>

            {isFormOpen && (
                <div style={{ marginBottom: '2rem' }}>
                    <TaskForm task={editingTask} onClose={handleFormClose} farmers={farmers} />
                </div>
            )}

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Farmer</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.description}</td>
                                <td>{getFarmerName(task.farmer_id)}</td>
                                <td>{getStatusBadge(task.status)}</td>
                                <td>
                                    <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.5rem' }} onClick={() => handleEdit(task)}>Edit</button>
                                    <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(task.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tasks.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No tasks found.</p>}
            </div>
        </div>
    );
};

export default TaskList;

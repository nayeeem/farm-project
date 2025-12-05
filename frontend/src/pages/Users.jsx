import React, { useState, useEffect } from 'react';
import api from '../api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ username: '', password: '', role: 'farmer', is_active: true });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
            }
        }
    };

    const handleEdit = (user) => {
        setCurrentUser({ ...user, password: '' }); // Don't show password
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentUser({ username: '', password: '', role: 'farmer', is_active: true });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const updateData = { ...currentUser };
                if (!updateData.password) delete updateData.password;
                await api.put(`/users/${currentUser.id}`, updateData);
            } else {
                await api.post('/users/', currentUser);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to save user", error);
            alert("Failed to save user: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>User Management</h2>
                <button onClick={handleAdd} className="btn btn-primary">Add User</button>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                            <td>
                                <button onClick={() => handleEdit(user)} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>Edit</button>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h3>{isEditing ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={currentUser.username}
                                    onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password {isEditing && '(Leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    value={currentUser.password}
                                    onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    className="form-control"
                                    required={!isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={currentUser.role}
                                    onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                                    className="form-control"
                                >
                                    <option value="farmer">Farmer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={currentUser.is_active}
                                        onChange={(e) => setCurrentUser({ ...currentUser, is_active: e.target.checked })}
                                    /> Active
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;

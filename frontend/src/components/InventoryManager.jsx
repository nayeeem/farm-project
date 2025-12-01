import React, { useState, useEffect } from 'react';
import api from '../api';

const InventoryManager = () => {
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('items'); // items, buy, sell, transactions
    const [itemForm, setItemForm] = useState({ name: '', type: 'crop', quantity: 0, price: 0 });
    const [transactionForm, setTransactionForm] = useState({
        item_id: '',
        type: 'buy',
        quantity: 0,
        price_per_unit: 0,
        buyer_name: ''
    });
    const [editingItem, setEditingItem] = useState(null);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items/');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/items/transactions/');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchTransactions();
    }, []);

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/items/${editingItem.id}`, itemForm);
                setEditingItem(null);
            } else {
                await api.post('/items/', itemForm);
            }
            setItemForm({ name: '', type: 'crop', quantity: 0, price: 0 });
            fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/items/transactions/', transactionForm);
            setTransactionForm({ item_id: '', type: 'buy', quantity: 0, price_per_unit: 0, buyer_name: '' });
            fetchItems();
            fetchTransactions();
            setActiveTab('transactions');
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/items/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setItemForm({ name: item.name, type: item.type, quantity: item.quantity, price: item.price });
        setActiveTab('items');
    };

    const getItemName = (itemId) => {
        const item = items.find(i => i.id === itemId);
        return item ? item.name : 'Unknown';
    };

    return (
        <div className="animate-fade-in">
            <h2>Inventory Management</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid rgba(148, 163, 184, 0.1)' }}>
                {['items', 'buy', 'sell', 'transactions'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: activeTab === tab ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
                            color: activeTab === tab ? 'white' : 'var(--text-color)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            borderRadius: '0.5rem 0.5rem 0 0',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Items Tab */}
            {activeTab === 'items' && (
                <div>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <form onSubmit={handleItemSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                    <input
                                        type="text"
                                        value={itemForm.name}
                                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
                                    <select
                                        value={itemForm.type}
                                        onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                                    >
                                        <option value="crop">Crop</option>
                                        <option value="seed">Seed</option>
                                        <option value="fertilizer">Fertilizer</option>
                                        <option value="equipment">Equipment</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
                                    <input
                                        type="number"
                                        value={itemForm.quantity}
                                        onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price per Unit</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={itemForm.price}
                                        onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                                {editingItem && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditingItem(null);
                                            setItemForm({ name: '', type: 'crop', quantity: 0, price: 0 });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="card">
                        <h3>Item List</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Price/Unit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-secondary" style={{ marginRight: '0.5rem', padding: '0.5rem' }} onClick={() => handleEditItem(item)}>Edit</button>
                                            <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {items.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No items found.</p>}
                    </div>
                </div>
            )}

            {/* Buy Tab */}
            {activeTab === 'buy' && (
                <div className="card">
                    <h3>Buy Items</h3>
                    <form onSubmit={handleTransactionSubmit}>
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Item</label>
                                <select
                                    value={transactionForm.item_id}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, item_id: e.target.value, type: 'buy' })}
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (Stock: {item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
                                <input
                                    type="number"
                                    value={transactionForm.quantity}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price per Unit</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={transactionForm.price_per_unit}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, price_per_unit: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                                <strong>Total: ${(transactionForm.quantity * transactionForm.price_per_unit).toFixed(2)}</strong>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Complete Purchase</button>
                    </form>
                </div>
            )}

            {/* Sell Tab */}
            {activeTab === 'sell' && (
                <div className="card">
                    <h3>Sell Items</h3>
                    <form onSubmit={handleTransactionSubmit}>
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Item</label>
                                <select
                                    value={transactionForm.item_id}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, item_id: e.target.value, type: 'sell' })}
                                    required
                                >
                                    <option value="">Select an item</option>
                                    {items.filter(i => i.quantity > 0).map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} (Available: {item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Buyer Name</label>
                                <input
                                    type="text"
                                    value={transactionForm.buyer_name}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, buyer_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
                                <input
                                    type="number"
                                    value={transactionForm.quantity}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price per Unit</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={transactionForm.price_per_unit}
                                    onChange={(e) => setTransactionForm({ ...transactionForm, price_per_unit: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                                <strong>Total Revenue: ${(transactionForm.quantity * transactionForm.price_per_unit).toFixed(2)}</strong>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Complete Sale</button>
                    </form>
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
                <div className="card">
                    <h3>Transaction History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Price/Unit</th>
                                <th>Total</th>
                                <th>Buyer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{getItemName(transaction.item_id)}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            background: transaction.type === 'buy' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                            color: transaction.type === 'buy' ? '#ef4444' : '#10b981',
                                            textTransform: 'capitalize'
                                        }}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td>{transaction.quantity}</td>
                                    <td>${transaction.price_per_unit.toFixed(2)}</td>
                                    <td>${transaction.total_price.toFixed(2)}</td>
                                    <td>{transaction.buyer_name || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No transactions found.</p>}
                </div>
            )}
        </div>
    );
};

export default InventoryManager;

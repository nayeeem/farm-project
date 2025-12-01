import React, { useState, useEffect } from 'react';
import api from '../api';

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [farmerReport, setFarmerReport] = useState([]);
    const [itemReport, setItemReport] = useState([]);
    const [transactionSummary, setTransactionSummary] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [summaryRes, farmerRes, itemRes, transactionRes] = await Promise.all([
                api.get('/reports/summary'),
                api.get('/reports/farmers'),
                api.get('/reports/items'),
                api.get('/reports/transactions/summary')
            ]);

            setSummary(summaryRes.data);
            setFarmerReport(farmerRes.data);
            setItemReport(itemRes.data);
            setTransactionSummary(transactionRes.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const StatCard = ({ title, value, subtitle, color = 'var(--primary-color)' }) => (
        <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color, marginBottom: '0.25rem' }}>{value}</div>
            {subtitle && <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{subtitle}</div>}
        </div>
    );

    if (!summary) return <div className="animate-fade-in">Loading reports...</div>;

    return (
        <div className="animate-fade-in">
            <h2>Reports & Analytics</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid rgba(148, 163, 184, 0.1)' }}>
                {['summary', 'farmers', 'items', 'transactions'].map(tab => (
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

            {/* Summary Tab */}
            {activeTab === 'summary' && (
                <div>
                    <h3>Overall Summary</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <StatCard title="Total Farmers" value={summary.farmers.total} color="var(--primary-color)" />
                        <StatCard title="Total Tasks" value={summary.tasks.total} subtitle={`${summary.tasks.completed} completed`} color="var(--secondary-color)" />
                        <StatCard title="Total Items" value={summary.items.total} subtitle={`$${summary.items.inventory_value} value`} color="var(--accent-color)" />
                        <StatCard title="Total Assets" value={summary.assets.total} subtitle={`$${summary.assets.total_value} value`} color="#f59e0b" />
                    </div>

                    <h3>Task Status</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <StatCard title="Pending" value={summary.tasks.pending} color="#fbbf24" />
                        <StatCard title="In Progress" value={summary.tasks.in_progress} color="#3b82f6" />
                        <StatCard title="Completed" value={summary.tasks.completed} color="#10b981" />
                    </div>

                    <h3>Financial Overview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <StatCard
                            title="Total Purchases"
                            value={`$${summary.transactions.total_purchase_amount}`}
                            subtitle={`${summary.transactions.purchases} transactions`}
                            color="#ef4444"
                        />
                        <StatCard
                            title="Total Sales"
                            value={`$${summary.transactions.total_sales_amount}`}
                            subtitle={`${summary.transactions.sales} transactions`}
                            color="#10b981"
                        />
                        <StatCard
                            title="Net Profit"
                            value={`$${summary.transactions.net_profit}`}
                            color={summary.transactions.net_profit >= 0 ? '#10b981' : '#ef4444'}
                        />
                    </div>
                </div>
            )}

            {/* Farmers Tab */}
            {activeTab === 'farmers' && (
                <div className="card">
                    <h3>Farmer Performance Report</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Total Tasks</th>
                                <th>Completed</th>
                                <th>Pending</th>
                                <th>Completion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmerReport.map((farmer) => {
                                const completionRate = farmer.total_tasks > 0
                                    ? ((farmer.completed_tasks / farmer.total_tasks) * 100).toFixed(1)
                                    : 0;
                                return (
                                    <tr key={farmer.id}>
                                        <td>{farmer.name}</td>
                                        <td>{farmer.phone || '-'}</td>
                                        <td>{farmer.total_tasks}</td>
                                        <td style={{ color: '#10b981' }}>{farmer.completed_tasks}</td>
                                        <td style={{ color: '#fbbf24' }}>{farmer.pending_tasks}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    flex: 1,
                                                    height: '8px',
                                                    background: 'rgba(148, 163, 184, 0.2)',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${completionRate}%`,
                                                        height: '100%',
                                                        background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                                        transition: 'width 0.3s ease'
                                                    }} />
                                                </div>
                                                <span style={{ minWidth: '45px', textAlign: 'right' }}>{completionRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {farmerReport.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No farmer data available.</p>}
                </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && (
                <div className="card">
                    <h3>Inventory Report</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Current Stock</th>
                                <th>Price/Unit</th>
                                <th>Inventory Value</th>
                                <th>Total Bought</th>
                                <th>Total Sold</th>
                                <th>Transactions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemReport.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                                    <td>{item.current_quantity}</td>
                                    <td>${item.price_per_unit.toFixed(2)}</td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>${item.inventory_value}</td>
                                    <td style={{ color: '#ef4444' }}>{item.total_bought}</td>
                                    <td style={{ color: '#10b981' }}>{item.total_sold}</td>
                                    <td>{item.buy_transactions + item.sell_transactions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {itemReport.length === 0 && <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No item data available.</p>}
                </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && transactionSummary && (
                <div>
                    <h3>Transaction Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="card">
                            <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>Purchase Summary</h4>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Transactions</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transactionSummary.buy.transaction_count}</div>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Quantity</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transactionSummary.buy.total_quantity}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Amount</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                                    ${transactionSummary.buy.total_amount}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h4 style={{ color: '#10b981', marginBottom: '1rem' }}>Sales Summary</h4>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Transactions</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transactionSummary.sell.transaction_count}</div>
                            </div>
                            <div style={{ marginBottom: '0.75rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Quantity</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{transactionSummary.sell.total_quantity}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Amount</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                                    ${transactionSummary.sell.total_amount}
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{
                            background: transactionSummary.profit >= 0
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
                                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
                        }}>
                            <h4 style={{ marginBottom: '1rem' }}>Net Profit/Loss</h4>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: transactionSummary.profit >= 0 ? '#10b981' : '#ef4444',
                                textAlign: 'center',
                                padding: '2rem 0'
                            }}>
                                ${transactionSummary.profit}
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
                                {transactionSummary.profit >= 0 ? '📈 Profitable' : '📉 Loss'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;

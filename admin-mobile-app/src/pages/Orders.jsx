import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('pending');

  const orders = [
    { id: '5501', user: 'Zaid Khan', items: 'Oud Wood (1)', total: '$120', status: 'pending', date: '10 min ago' },
    { id: '5502', user: 'Sara Ali', items: 'Saffron (2)', total: '$240', status: 'delivered', date: '2 hours ago' },
  ];

  const Tab = ({ label, id }) => (
    <div 
      onClick={() => setActiveTab(id)}
      style={{ 
        padding: '8px 15px', 
        borderRadius: '20px', 
        fontSize: '0.85rem',
        cursor: 'pointer',
        background: activeTab === id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
        color: activeTab === id ? 'black' : 'white',
        fontWeight: activeTab === id ? '600' : '400',
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </div>
  );

  return (
    <div className="animate-fade">
      <h2 style={{ marginBottom: '1.5rem' }}>Order Stream</h2>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
        <Tab label="Pending" id="pending" />
        <Tab label="Shipping" id="shipping" />
        <Tab label="Delivered" id="delivered" />
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {orders.filter(o => o.status === activeTab || activeTab === 'all').map((order) => (
          <div key={order.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: #{order.id} • {order.date}</span>
              <span style={{ 
                fontSize: '0.7rem', 
                padding: '2px 8px', 
                borderRadius: '10px', 
                background: order.status === 'pending' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: order.status === 'pending' ? 'var(--primary)' : 'var(--success)',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {order.status}
              </span>
            </div>
            <h4 style={{ margin: '0 0 5px 0' }}>{order.user}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>{order.items}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{order.total}</span>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

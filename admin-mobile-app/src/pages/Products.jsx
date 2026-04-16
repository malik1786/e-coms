import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Stock Management</h2>
        <button className="btn-primary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={20} /> Add
        </button>
      </header>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="input-field" 
          style={{ paddingLeft: '45px', marginBottom: 0 }}
        />
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {products.length > 0 ? products.map((product) => (
          <div key={product._id} className="glass-card" style={{ display: 'flex', gap: '15px', padding: '12px' }}>
            <img 
              src={product.image || 'https://via.placeholder.com/60'} 
              alt={product.name}
              style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>{product.name}</h4>
              <p style={{ margin: '3px 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {product.category} • {product.size}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${product.price}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Edit size={18} style={{ color: 'var(--text-dim)' }} />
                  <Trash2 size={18} style={{ color: '#ef4444' }} />
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            No products found in inventory.
          </div>
        )}
      </div>
    </div>
  );
}

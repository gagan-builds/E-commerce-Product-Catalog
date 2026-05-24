import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Search, Plus, Trash2, Edit3, X, Check, Activity, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    lowStockCount: 0,
    categorySales: [],
    topProducts: [],
    lowStockProducts: []
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // CRUD Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form State
  const [formProduct, setFormProduct] = useState({
    name: '',
    price: '',
    category: 'Tech',
    stock: '',
    image: '',
    description: '',
    featured: false,
    specs: [],
    colors: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newColor, setNewColor] = useState('#1A1A1A');

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [prodRes, statsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stats')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingProduct(null);
    setFormProduct({
      name: '',
      price: '',
      category: 'Tech',
      stock: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', // default Unsplash headphone image
      description: '',
      featured: false,
      specs: [],
      colors: ['#1A1A1A', '#E5E5E5']
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description,
      featured: !!product.featured,
      specs: product.specs || [],
      colors: product.colors || []
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? It will be permanently removed.')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadDashboardData();
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formProduct.name.trim()) errors.name = 'Product name is required';
    if (!formProduct.price || parseFloat(formProduct.price) <= 0) errors.price = 'Valid price is required';
    if (formProduct.stock === '' || parseInt(formProduct.stock) < 0) errors.stock = 'Valid stock amount is required';
    if (!formProduct.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formProduct,
        price: parseFloat(formProduct.price),
        stock: parseInt(formProduct.stock)
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product details.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSpec = () => {
    if (!newSpecName.trim() || !newSpecValue.trim()) return;
    setFormProduct(prev => ({
      ...prev,
      specs: [...prev.specs, { name: newSpecName, value: newSpecValue }]
    }));
    setNewSpecName('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index) => {
    setFormProduct(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (formProduct.colors.includes(newColor)) return;
    setFormProduct(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
  };

  const handleRemoveColor = (color) => {
    setFormProduct(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor e-commerce performance and manage product inventory.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal} style={{ gap: '8px' }}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <section className="admin-grid">
        <div className="admin-kpi-card glass">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Revenue</span>
            <div className="admin-kpi-value">${stats.totalSales.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Live sales volume
            </span>
          </div>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '16px', borderRadius: '12px' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="admin-kpi-card glass">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Orders Completed</span>
            <div className="admin-kpi-value">{stats.totalOrders}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer transactions</span>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '16px', borderRadius: '12px' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="admin-kpi-card glass">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Avg Order Value</span>
            <div className="admin-kpi-value">${stats.averageOrderValue.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Basket size average</span>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '16px', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
        </div>

        <div className="admin-kpi-card glass">
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Low Stock Items</span>
            <div className="admin-kpi-value" style={{ color: stats.lowStockCount > 0 ? 'var(--danger)' : 'var(--accent)' }}>
              {stats.lowStockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: stats.lowStockCount > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
              {stats.lowStockCount > 0 ? 'Urgent refill required' : 'Stock level healthy'}
            </span>
          </div>
          <div style={{ 
            background: stats.lowStockCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            color: stats.lowStockCount > 0 ? 'var(--danger)' : 'var(--accent)', 
            padding: '16px', 
            borderRadius: '12px' 
          }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </section>

      <section className="admin-charts-row">
        <div className="admin-chart-card glass">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
            Revenue by Category
          </h3>
          
          <div className="chart-bar-container">
            {stats.categorySales.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '48px' }}>No completed transactions yet.</p>
            ) : (
              stats.categorySales.map((cat, i) => {
                const percentage = stats.totalSales > 0 ? (cat.value / stats.totalSales) * 100 : 0;
                
                return (
                  <div key={i} className="chart-bar-item">
                    <span className="chart-bar-label">{cat.category}</span>
                    <div className="chart-bar-track">
                      <div 
                        className="chart-bar-fill" 
                        style={{ 
                          width: `${Math.max(10, percentage)}%`,
                          background: `var(--chart-bar-${(i % 3) + 1})`
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', width: '80px', textAlign: 'right' }}>
                      ${cat.value.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="admin-chart-card glass">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
            Top Products (Units Sold)
          </h3>
          
          <div className="chart-bar-container">
            {stats.topProducts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '48px' }}>No completed orders yet.</p>
            ) : (
              stats.topProducts.map((prod, i) => {
                const maxSold = Math.max(...stats.topProducts.map(p => p.quantity));
                const percentage = maxSold > 0 ? (prod.quantity / maxSold) * 100 : 0;
                
                return (
                  <div key={i} className="chart-bar-item">
                    <span className="chart-bar-label">{prod.name}</span>
                    <div className="chart-bar-track">
                      <div 
                        className="chart-bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, var(--primary), var(--accent))'
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', width: '50px', textAlign: 'right' }}>
                      {prod.quantity} sold
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Product Inventory</h2>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 16px 8px 36px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-main)'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="admin-table-container glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                    No products found matching &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '4px', 
                            background: product.image ? `url(${product.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))' 
                          }} 
                        />
                        <strong style={{ color: 'var(--text-main)' }}>{product.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{product.category}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>${product.price.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: '700', 
                        color: product.stock < 10 ? 'var(--danger)' : 'var(--accent)'
                      }}>
                        {product.stock} units
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="action-btn"
                          onClick={() => openEditModal(product)}
                          aria-label="Edit product"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="action-btn" 
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-container glass" style={{ maxWidth: '650px' }}>
            <button className="action-btn modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
              <X size={20} />
            </button>

            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingProduct ? <Edit3 size={24} style={{ color: 'var(--primary)' }} /> : <Plus size={24} style={{ color: 'var(--primary)' }} />}
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formProduct.name}
                    onChange={handleFormInputChange}
                    placeholder="e.g., Wireless Smart ANC Earbuds"
                    className="form-input"
                  />
                  {formErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formProduct.category}
                      onChange={handleFormInputChange}
                      className="form-select"
                    >
                      <option value="Tech">Tech</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formProduct.price}
                      onChange={handleFormInputChange}
                      placeholder="99.99"
                      className="form-input"
                    />
                    {formErrors.price && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Inventory Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formProduct.stock}
                      onChange={handleFormInputChange}
                      placeholder="15"
                      className="form-input"
                    />
                    {formErrors.stock && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.stock}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formProduct.image}
                    onChange={handleFormInputChange}
                    placeholder="e.g., https://images.unsplash.com/photo-..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    name="description"
                    value={formProduct.description}
                    onChange={handleFormInputChange}
                    placeholder="Provide a detailed sales pitch..."
                    rows="3"
                    className="form-textarea"
                    style={{ resize: 'vertical' }}
                  />
                  {formErrors.description && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{formErrors.description}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Color Swatches</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {formProduct.colors.map(color => (
                      <span 
                        key={color} 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          background: 'var(--input-bg)', 
                          border: '1px solid var(--input-border)', 
                          padding: '4px 8px', 
                          borderRadius: '16px',
                          fontSize: '0.8rem'
                        }}
                      >
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color, border: '1px solid var(--text-muted)' }} />
                        {color}
                        <button type="button" onClick={() => handleRemoveColor(color)} style={{ color: 'var(--danger)', fontWeight: '600' }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="color" 
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      style={{ width: '40px', height: '36px', border: '1px solid var(--input-border)', borderRadius: '4px', cursor: 'pointer', padding: 0 }}
                    />
                    <button type="button" onClick={handleAddColor} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                      Add Color
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Specifications Table</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                    {formProduct.specs.map((spec, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--input-bg)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--input-border)' }}>
                        <span><strong>{spec.name}:</strong> {spec.value}</span>
                        <button type="button" onClick={() => handleRemoveSpec(index)} style={{ color: 'var(--danger)', fontWeight: '600' }}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Spec Name (e.g. Battery)"
                      value={newSpecName}
                      onChange={(e) => setNewSpecName(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 40 Hours)"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                    />
                    <button type="button" onClick={handleAddSpec} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                      Add Spec
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formProduct.featured}
                    onChange={handleFormInputChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="featured" className="form-label" style={{ cursor: 'pointer' }}>Promote as Featured Product on Storefront</label>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', gap: '8px', marginTop: '12px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving Product...</>
                  ) : (
                    <>
                      <Check size={18} />
                      Save Product Details
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

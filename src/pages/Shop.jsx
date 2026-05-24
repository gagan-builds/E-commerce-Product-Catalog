import React, { useState, useEffect } from 'react';
import { Star, Eye, ShoppingCart, RefreshCw, SlidersHorizontal, Check, X, Minus, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { API_BASE } from '../config';

export default function Shop() {
  const { addToCart } = useApp();

  // Read search term from URL query parameter directly
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(300);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Quick View Modal States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewColor, setQuickViewColor] = useState('');

  // Selected card color state
  const [cardSelectedColors, setCardSelectedColors] = useState({});

  // Sync search query from URL on load and path change
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') || '');
    };
    
    handleUrlChange(); // Run on mount
    
    // Listen for browser popstate
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Fetch products from API based on states
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.set('search', searchQuery);
        if (activeCategory !== 'All') queryParams.set('category', activeCategory);
        queryParams.set('minPrice', '0');
        queryParams.set('maxPrice', priceRange.toString());
        queryParams.set('minRating', minRating.toString());
        if (inStockOnly) queryParams.set('inStock', 'true');
        queryParams.set('sort', sortBy);

        const res = await fetch(`${API_BASE}/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadProducts();
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, priceRange, minRating, inStockOnly, sortBy]);

  // Open Quick View Modal
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
    setQuickViewColor(product.colors && product.colors.length > 0 ? product.colors[0] : '#000000');
  };

  // Close Quick View Modal
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleCardColorSelect = (productId, color) => {
    setCardSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const handleQuickAdd = (product) => {
    const selectedColor = cardSelectedColors[product.id] || (product.colors && product.colors[0]) || '#000000';
    addToCart(product, 1, selectedColor);
  };

  const categories = ['All', 'Tech', 'Lifestyle', 'Home'];

  return (
    <div style={{ padding: '0 0 60px 0' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <span className="badge badge-primary" style={{ marginBottom: '16px' }}>Curated Collection</span>
          <h1 className="hero-title">Elevate Your Everyday Carry</h1>
          <p className="hero-desc">
            Discover a handpicked selection of ultra-premium tech, ergonomic lifestyle gear, and minimalist home design. Beautifully crafted for modern professionals.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="#catalog" className="btn btn-primary">Browse Catalog</a>
            <Link href="/admin" className="btn btn-secondary">Admin Portal</Link>
          </div>
        </div>
      </section>

      {/* Catalog Grid Area */}
      <div id="catalog" className="container">
        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar glass">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <SlidersHorizontal size={18} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <span className="filter-title">Category</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="filter-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>Max Price</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary)' }}>${priceRange}</span>
              </div>
              <div style={{ borderBottom: '1px dashed var(--card-border)', paddingBottom: '12px' }}>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="price-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <span>$20</span>
                  <span>$300</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
              <span className="filter-title">Min Rating</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[0, 4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      fontWeight: minRating === rating ? '600' : '400',
                      color: minRating === rating ? 'var(--primary)' : 'var(--text-main)',
                      background: minRating === rating ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    <span>
                      {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="filter-section">
              <span className="filter-title">Availability</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset Filters */}
            {(activeCategory !== 'All' || priceRange !== 300 || minRating !== 0 || inStockOnly || searchQuery) && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setActiveCategory('All');
                  setPriceRange(300);
                  setMinRating(0);
                  setInStockOnly(false);
                }}
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem' }}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Catalog Grid */}
          <main>
            <div className="products-header">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Showing <strong style={{ color: 'var(--text-main)' }}>{products.length}</strong> products
                {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="popular">Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Customer Rating</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="products-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="product-card" style={{ height: '420px' }}>
                    <div className="shimmer-loader" style={{ height: '240px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="shimmer-loader" style={{ height: '24px', width: '70%' }} />
                      <div className="shimmer-loader" style={{ height: '16px', width: '100%' }} />
                      <div className="shimmer-loader" style={{ height: '16px', width: '40%' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                        <div className="shimmer-loader" style={{ height: '28px', width: '30%' }} />
                        <div className="shimmer-loader" style={{ height: '36px', width: '30%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex-center" style={{ flexDirection: 'column', padding: '80px 24px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', gap: '16px' }}>
                <div style={{ padding: '20px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)' }}>
                  <RefreshCw size={36} className="shimmer-loader" style={{ background: 'none', animation: 'none' }} />
                </div>
                <div>
                  <h3>No products found</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>Try adjusting your filters or search terms.</p>
                </div>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => {
                  const selectedColor = cardSelectedColors[product.id] || (product.colors && product.colors[0]) || '#000000';
                  
                  return (
                    <article key={product.id} className="product-card">
                      <div className="product-badges">
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="badge badge-danger">Low Stock ({product.stock})</span>
                        )}
                        {product.stock === 0 && (
                          <span className="badge badge-danger">Out of Stock</span>
                        )}
                        {product.featured && (
                          <span className="badge badge-primary">Featured</span>
                        )}
                      </div>

                      <div className="product-image-container">
                        <Link href={`/product/${product.id}`}>
                          <div 
                            style={{
                              width: '100%',
                              height: '100%',
                              background: product.image ? `url(${product.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))'
                            }} 
                            className="product-image"
                          />
                        </Link>

                        <div className="product-quickview-overlay">
                          <button 
                            className="btn btn-secondary"
                            onClick={() => openQuickView(product)}
                            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Eye size={16} />
                            Quick View
                          </button>
                        </div>
                      </div>

                      <div className="product-info">
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                          {product.category}
                        </span>
                        
                        <Link href={`/product/${product.id}`}>
                          <h4 className="product-name" style={{ color: 'var(--text-main)' }}>{product.name}</h4>
                        </Link>
                        
                        <p className="product-desc">{product.description}</p>
                        
                        <div className="product-rating">
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                size={14} 
                                className={`rating-star ${star > Math.round(product.rating) ? 'empty' : ''}`} 
                              />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '4px' }}>
                            {product.rating} ({product.reviewsCount})
                          </span>
                        </div>

                        {product.colors && product.colors.length > 0 && (
                          <div className="product-colors">
                            {product.colors.map(color => (
                              <button
                                key={color}
                                className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleCardColorSelect(product.id, color)}
                                aria-label={`Select color ${color}`}
                              />
                            ))}
                          </div>
                        )}

                        <div className="product-footer">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          
                          <button
                            className="btn btn-primary"
                            onClick={() => handleQuickAdd(product)}
                            disabled={product.stock === 0}
                            style={{ 
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              background: product.stock === 0 ? 'var(--input-border)' : 'var(--primary)',
                              color: product.stock === 0 ? 'var(--text-muted)' : 'var(--text-inverse)',
                              cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                            }}
                            aria-label="Add to cart"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      {quickViewProduct && (
        <div className="modal-backdrop" onClick={closeQuickView}>
          <div 
            className="modal-container glass" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '850px' }}
          >
            <button className="action-btn modal-close" onClick={closeQuickView} aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="quickview-layout">
              <div className="quickview-image-sec">
                <div 
                  style={{
                    width: '100%',
                    height: '350px',
                    borderRadius: 'var(--radius-md)',
                    background: quickViewProduct.image ? `url(${quickViewProduct.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))',
                    boxShadow: 'var(--shadow-md)'
                  }} 
                />
              </div>

              <div className="quickview-info-sec">
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                    {quickViewProduct.category}
                  </span>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', lineHeight: '1.2' }}>
                    {quickViewProduct.name}
                  </h2>
                  
                  <div className="product-rating" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={`rating-star ${star > Math.round(quickViewProduct.rating) ? 'empty' : ''}`} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {quickViewProduct.rating} ({quickViewProduct.reviewsCount} customer reviews)
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {quickViewProduct.description}
                  </p>
                </div>

                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                      Select Color
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {quickViewProduct.colors.map(color => (
                        <button
                          key={color}
                          className={`color-swatch ${quickViewColor === color ? 'active' : ''}`}
                          style={{ backgroundColor: color, width: '22px', height: '22px' }}
                          onClick={() => setQuickViewColor(color)}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {quickViewProduct.specs && quickViewProduct.specs.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                      Key Specs
                    </span>
                    <table className="specs-table">
                      <tbody>
                        {quickViewProduct.specs.slice(0, 2).map((spec, i) => (
                          <tr key={i}>
                            <td>{spec.name}</td>
                            <td>{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                    
                    <span style={{ fontSize: '0.85rem', color: quickViewProduct.stock > 0 ? 'var(--accent)' : 'var(--danger)', fontWeight: '600' }}>
                      {quickViewProduct.stock > 0 ? `In Stock (${quickViewProduct.stock} units)` : 'Out of Stock'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {quickViewProduct.stock > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}>
                        <button 
                          onClick={() => setQuickViewQty(prev => Math.max(1, prev - 1))}
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ fontSize: '1rem', fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
                          {quickViewQty}
                        </span>
                        <button 
                          onClick={() => setQuickViewQty(prev => Math.min(quickViewProduct.stock, prev + 1))}
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={quickViewProduct.stock === 0}
                      onClick={() => {
                        addToCart(quickViewProduct, quickViewQty, quickViewColor);
                        closeQuickView();
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                  
                  <Link 
                    href={`/product/${quickViewProduct.id}`}
                    onClick={closeQuickView}
                    style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
                  >
                    View Full Details & Specs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

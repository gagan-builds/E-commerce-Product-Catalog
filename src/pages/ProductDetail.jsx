import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Plus, Minus, ArrowLeft, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, navigateTo } from '../App';
import { API_BASE } from '../config';

export default function ProductDetail() {
  const { addToCart } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  // Simulated Reviews
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Alex Rivera', rating: 5, date: '2026-05-18', comment: 'Absolutely phenomenal quality. The craftsmanship exceeds expectations. Highly recommended!', verified: true },
    { id: 2, author: 'Sophia Chen', rating: 4, date: '2026-05-14', comment: 'Sleek design and very functional. Fits perfectly with my minimalist office layout. Minor delay in shipping but product is top-tier.', verified: true },
    { id: 3, author: 'Marcus Brodie', rating: 5, date: '2026-05-10', comment: 'Premium materials. Worth every penny. The touch response/controls work flawlessly.', verified: false }
  ]);

  // Extract ID from path: /product/prod-1
  const getProductIdFromPath = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  const id = getProductIdFromPath();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedColor(data.colors && data.colors.length > 0 ? data.colors[0] : '#000000');
        } else {
          navigateTo('/shop');
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px' }}>
        <div style={{ display: 'flex', gap: '48px', minHeight: '400px' }}>
          <div className="shimmer-loader" style={{ flex: 1.2, height: '450px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="shimmer-loader" style={{ height: '36px', width: '60%' }} />
            <div className="shimmer-loader" style={{ height: '24px', width: '40%' }} />
            <div className="shimmer-loader" style={{ height: '80px', width: '100%' }} />
            <div className="shimmer-loader" style={{ height: '50px', width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: '600' }} className="nav-link">
        <ArrowLeft size={18} />
        Back to Catalog
      </Link>

      <div className="detail-layout">
        <div className="detail-image-sec">
          <div 
            style={{
              width: '100%',
              height: '100%',
              background: product.image ? `url(${product.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))'
            }} 
          />
        </div>

        <div className="detail-info-sec">
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{product.category}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              {product.name}
            </h1>

            <div className="product-rating" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={`rating-star ${star > Math.round(product.rating) ? 'empty' : ''}`} 
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {product.rating} ({product.reviewsCount} verified customer reviews)
              </span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '24px' }}>
              ${product.price.toFixed(2)}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem', marginBottom: '28px' }}>
              {product.description}
            </p>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', display: 'block', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Color Options
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color, width: '28px', height: '28px' }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--card-border)', paddingTop: '28px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Availability:</span>
              <span style={{ fontSize: '0.95rem', color: product.stock > 0 ? 'var(--accent)' : 'var(--danger)', fontWeight: '700' }}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Currently Out of Stock'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {product.stock > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-sm)', padding: '10px 20px' }}>
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', minWidth: '28px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    style={{ color: 'var(--text-muted)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '16px' }}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Add to Shopping Cart
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px', borderTop: '1px solid var(--card-border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <Truck size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Free Delivery</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Orders over $50</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>2-Yr Warranty</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Full coverage</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <RefreshCw size={20} style={{ color: 'var(--warning)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Easy Returns</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>30-day window</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '64px', borderTop: '1px solid var(--card-border)', paddingTop: '40px' }}>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
          <button 
            onClick={() => setActiveTab('specs')}
            style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: activeTab === 'specs' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'specs' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Technical Specifications
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              paddingBottom: '12px',
              borderBottom: activeTab === 'reviews' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)'
            }}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div style={{ maxWidth: '650px', animation: 'fadeIn var(--transition-normal)' }}>
            {product.specs && product.specs.length > 0 ? (
              <table className="specs-table" style={{ fontSize: '0.95rem' }}>
                <tbody>
                  {product.specs.map((spec, i) => (
                    <tr key={i}>
                      <td style={{ padding: '16px' }}>{spec.name}</td>
                      <td style={{ padding: '16px', color: 'var(--text-main)' }}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No technical specifications available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', animation: 'fadeIn var(--transition-normal)' }}>
            {reviews.map((review) => (
              <div 
                key={review.id} 
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  padding: '24px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {review.author}
                      {review.verified && (
                        <span 
                          style={{
                            fontSize: '0.65rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}
                        >
                          Verified Purchase
                        </span>
                      )}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{review.date}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={`rating-star ${star > review.rating ? 'empty' : ''}`} 
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from '../App';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartTotal
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)} />

      <div className="drawer glass">
        <div className="drawer-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} style={{ color: 'var(--primary)' }} />
            Your Cart
          </h2>
          <button className="action-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <div className="flex-center" style={{ flexDirection: 'column', height: '80%', gap: '16px', textAlign: 'center' }}>
              <div style={{ padding: '24px', borderRadius: '50%', background: 'var(--card-border)', color: 'var(--text-muted)' }}>
                <ShoppingBag size={48} />
              </div>
              <div>
                <h3 style={{ marginBottom: '8px' }}>Your cart is empty</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add some premium items to get started.</p>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '12px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.color}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--card-border)'
                  }}
                >
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.image ? `url(${item.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))',
                      flexShrink: 0
                    }} 
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category}</span>
                        <span 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            border: '1px solid var(--text-muted)'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.color, item.quantity - 1)} 
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.color, item.quantity + 1)}
                          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id, item.color)} 
                          style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Promo code (WELCOME10 / SAVEMORE)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 32px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--text-main)'
                  }}
                />
                <Tag size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Apply
              </button>
            </form>

            {couponError && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '-8px', marginBottom: '12px' }}>{couponError}</p>}
            {couponSuccess && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '-8px', marginBottom: '12px' }}>{couponSuccess}</p>}

            {appliedCoupon && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  padding: '8px 12px', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={12} />
                  Code Applied: {appliedCoupon.code}
                </span>
                <button 
                  onClick={removeCoupon} 
                  style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '0.75rem' }}
                >
                  Remove
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)' }}>
                  <span>Discount</span>
                  <span>-${cartDiscount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
                <span>${cartTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px dashed var(--card-border)', paddingTop: '10px', marginTop: '4px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={() => setIsCartOpen(false)} style={{ display: 'block' }}>
              <button className="btn btn-primary" style={{ width: '100%', gap: '8px' }}>
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

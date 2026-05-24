import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { navigateTo, Link } from '../App';
import { CreditCard, ShoppingBag, Truck, ShieldCheck, CheckCircle2, ArrowRight, Tag, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartTotal,
    clearCart,
    appliedCoupon
  } = useApp();

  // Customer Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // If cart is empty and we haven't completed the order, redirect to shop
  useEffect(() => {
    if (cart.length === 0 && !completedOrder) {
      navigateTo('/shop');
    }
  }, [cart, completedOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        setFormData(prev => ({ ...prev, cardNumber: parts.join(' ') }));
      } else {
        setFormData(prev => ({ ...prev, cardNumber: v }));
      }
      return;
    }

    // Format expiry Date with /
    if (name === 'cardExpiry') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        setFormData(prev => ({ ...prev, cardExpiry: `${v.substring(0, 2)}/${v.substring(2, 4)}` }));
      } else {
        setFormData(prev => ({ ...prev, cardExpiry: v }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.address.trim()) errors.address = 'Shipping address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.zip.trim() || formData.zip.length < 5) errors.zip = 'Valid zip code is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) errors.cardNumber = 'Valid 16-digit card number is required';
    if (!formData.cardName.trim()) errors.cardName = 'Name on card is required';
    if (formData.cardExpiry.length < 5) errors.cardExpiry = 'Expiry date (MM/YY) is required';
    if (formData.cardCvv.length < 3) errors.cardCvv = 'CVV is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          phone: formData.phone
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color
        })),
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        total: cartTotal
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const orderResult = await res.json();
        setCompletedOrder(orderResult);
        clearCart();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit order. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="container" style={{ padding: '80px 24px', maxWidth: '650px', textAlign: 'center' }}>
        <div 
          className="glass" 
          style={{ 
            padding: '48px', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            animation: 'scaleUp var(--transition-normal)'
          }}
        >
          <div style={{ color: 'var(--accent)' }}>
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Order Confirmed!</h1>
            <p style={{ color: 'var(--text-muted)' }}>Thank you for shopping with Cartify. Your receipt details are below.</p>
          </div>

          <div 
            style={{ 
              width: '100%', 
              background: 'var(--input-bg)', 
              border: '1px solid var(--input-border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '24px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--card-border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{completedOrder.id}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date:</span>
              <span>{new Date(completedOrder.createdAt).toLocaleDateString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--card-border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Deliver to:</span>
              <span style={{ textAlign: 'right' }}>
                <strong>{completedOrder.customer.name}</strong><br />
                {completedOrder.customer.address}<br />
                {completedOrder.customer.city}, {completedOrder.customer.zip}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px dashed var(--card-border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Items</span>
              {completedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span></span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
              <span>${completedOrder.subtotal.toFixed(2)}</span>
            </div>
            {completedOrder.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent)' }}>
                <span>Discount:</span>
                <span>-${completedOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tax (8%):</span>
              <span>${completedOrder.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', borderTop: '1px dashed var(--card-border)', paddingTop: '10px' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--primary)' }}>${completedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/shop" className="btn btn-primary" style={{ width: '100%' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '32px', letterSpacing: '-0.02em' }}>Checkout</h1>
      
      <div className="checkout-layout">
        <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Shipping Section */}
          <div className="checkout-card">
            <h2 className="checkout-section-title">
              <Truck size={20} style={{ color: 'var(--primary)' }} />
              Shipping Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="form-input"
                />
                {formErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane.doe@example.com"
                  className="form-input"
                />
                {formErrors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 019-2834"
                  className="form-input"
                />
                {formErrors.phone && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.phone}</span>}
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Horizon Lane"
                  className="form-input"
                />
                {formErrors.address && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.address}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="San Francisco"
                  className="form-input"
                />
                {formErrors.city && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="94107"
                  maxLength="5"
                  className="form-input"
                />
                {formErrors.zip && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.zip}</span>}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="checkout-card">
            <h2 className="checkout-section-title">
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              Payment Details
            </h2>

            {/* Interactive Animated Credit Card */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div 
                style={{
                  width: '320px',
                  height: '190px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  padding: '24px',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(20px)' }} />
                <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', filter: 'blur(20px)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '30px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }} />
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', fontStyle: 'italic' }}>VISA</span>
                </div>

                <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', letterSpacing: '0.1em', textShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '16px 0' }}>
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Card Holder</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em' }}>{formData.cardName || 'YOUR NAME'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Expires</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{formData.cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="form-input"
                />
                {formErrors.cardName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.cardName}</span>}
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="4111 2222 3333 4444"
                  maxLength="19"
                  className="form-input"
                />
                {formErrors.cardNumber && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className="form-input"
                />
                {formErrors.cardExpiry && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.cardExpiry}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="•••"
                  maxLength="4"
                  className="form-input"
                />
                {formErrors.cardCvv && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}><AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />{formErrors.cardCvv}</span>}
              </div>
            </div>
          </div>
        </form>

        <aside>
          <div className="checkout-card" style={{ position: 'sticky', top: '100px' }}>
            <h2 className="checkout-section-title">
              <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '250px', overflowY: 'auto', paddingRight: '8px' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '4px', 
                        background: item.image ? `url(${item.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary), var(--accent))' 
                      }} 
                    />
                    <div>
                      <strong style={{ display: 'block', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {appliedCoupon && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  padding: '8px 12px', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '20px',
                  fontSize: '0.8rem',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}
              >
                <Tag size={12} />
                Promo Code Applied: {appliedCoupon.code} (-${cartDiscount.toFixed(2)})
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', fontSize: '0.9rem', borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
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
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%)</span>
                <span>${cartTax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span style={{ color: 'var(--accent)', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', borderTop: '1px dashed var(--card-border)', paddingTop: '12px', marginTop: '4px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', gap: '8px' }}
            >
              {isSubmitting ? (
                <>Processing Order...</>
              ) : (
                <>
                  Confirm & Pay ${cartTotal.toFixed(2)}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
              <span>Secure checkout. 256-bit SSL encryption.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

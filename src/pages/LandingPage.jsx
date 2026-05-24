import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Compass, Truck, Mail, Plus, Minus, Tag, Check } from 'lucide-react';
import { Link } from '../App';

export default function LandingPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
  };

  const toggleFaq = (index) => {
    setActiveFaq(prev => prev === index ? null : index);
  };

  const faqs = [
    { question: 'What is the Cartify shipping policy?', answer: 'We offer free global standard shipping on all orders over $50. Processing takes 1–2 business days, and delivery typically completes within 3–7 business days depending on location.' },
    { question: 'Do the products come with a warranty?', answer: 'Yes! All Cartify premium goods come standard with a 2-year warranty that covers structural defects, hardware failure, and manufacturing issues.' },
    { question: 'What is your return policy?', answer: 'We want you to love your carry. If you are not completely satisfied, you can initiate a return or exchange within 30 days of delivery. Returns are free and straightforward.' },
    { question: 'Are these items eco-friendly?', answer: 'We prioritize sustainability. From full-grain leather sourced from gold-rated tanneries to sustainable oak and FSC-certified woods, our goods are crafted with materials meant to last a lifetime, reducing environmental waste.' }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        padding: '100px 0 120px 0', 
        background: 'radial-gradient(circle at 90% 10%, rgba(var(--primary-rgb), 0.12), transparent 45%), radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.08), transparent 45%)',
        borderBottom: '1px solid var(--card-border)',
        position: 'relative'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '16px', animation: 'pulseBorder 2s infinite', fontSize: '0.8rem', padding: '6px 16px' }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              Defining Modern Carry
            </span>
            <h1 style={{ fontSize: '4.2rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em', marginBottom: '24px' }}>
              Goods Designed for <br />
              <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Life in Motion
              </span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '40px' }}>
              Sleek technical gear, hand-crafted desk items, and minimalist travel essentials. Built with precision and curated to elevate your everyday workflows.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="/shop" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1rem', gap: '8px' }}>
                Enter Storefront
                <ArrowRight size={20} />
              </Link>
              <Link href="/signup" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1rem' }}>
                Register Account
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div 
              className="glass"
              style={{
                width: '380px',
                height: '420px',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-lg)',
                animation: 'float 6s infinite ease-in-out',
                position: 'relative',
                zIndex: 2
              }}
            >
              <div 
                style={{ 
                  height: '240px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'url(https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800) center/cover no-repeat',
                  border: '1px solid var(--card-border)',
                  marginBottom: '20px'
                }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tech</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '4px' }}>AeroSound Max</h3>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>$249.99</span>
              </div>
            </div>

            <div 
              style={{
                position: 'absolute',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                filter: 'blur(60px)',
                opacity: 0.25,
                top: '50px',
                left: '50px',
                zIndex: 1
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--card-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '12px' }}>Built For A Lifetime</h2>
            <p style={{ color: 'var(--text-muted)' }}>Every detail is meticulously planned, sourced, and assembled.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>Thoughtful Design</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Form follows function. We design objects that solve daily issues, eliminate bulk, and keep your life organized.
              </p>
            </div>

            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>Premium Materials</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                From gold-rated full-grain leather to high-grade aerospace anodized aluminum, we utilize only the finest quality inputs.
              </p>
            </div>

            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px' }}>Global Concierge</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Enjoy free shipping worldwide on all orders above $50, backed by comprehensive returns and friendly 24/7 concierge support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED HIGHLIGHTS PREVIEW */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '8px' }}>The Essentials</h2>
              <p style={{ color: 'var(--text-muted)' }}>Explore our top rated catalog items.</p>
            </div>
            <Link href="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--primary)' }}>
              View Full Catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {/* item 1 */}
            <div className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <div style={{ height: '220px', background: 'url(https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800) center/cover no-repeat' }} />
              <div style={{ padding: '24px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Best Seller</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '4px', marginBottom: '8px' }}>KeyChronicle Retro</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Walnut-frame hot-swappable mechanical keyboard.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--primary)' }}>$189.50</strong>
                  <Link href="/shop" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textDecoration: 'underline' }}>View details</Link>
                </div>
              </div>
            </div>
            {/* item 2 */}
            <div className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <div style={{ height: '220px', background: 'url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800) center/cover no-repeat' }} />
              <div style={{ padding: '24px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>New Arrival</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '4px', marginBottom: '8px' }}>Nomad Pack 20L</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Matte black full-grain leather everyday backpack.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--primary)' }}>$159.00</strong>
                  <Link href="/shop" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textDecoration: 'underline' }}>View details</Link>
                </div>
              </div>
            </div>
            {/* item 3 */}
            <div className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <div style={{ height: '220px', background: 'url(https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800) center/cover no-repeat' }} />
              <div style={{ padding: '24px' }}>
                <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Top Rated</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '4px', marginBottom: '8px' }}>Solas Ambient Lamp</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Frosted glass warm glow wood desk lamp.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--primary)' }}>$89.00</strong>
                  <Link href="/shop" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textDecoration: 'underline' }}>View details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER CTA W/ CODE */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--card-border)', background: 'radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.08), transparent 45%)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <Mail size={36} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>Unlock 10% Off Your First Carry</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem' }}>
              Subscribe to the Cartify Dispatch. Receive occasional product launches and digital concierge offers.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                  Subscribe
                </button>
              </form>
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '16px', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  padding: '24px', 
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}
              >
                <div style={{ background: 'var(--accent)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                  <Check size={18} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent)', fontWeight: '700', marginBottom: '4px' }}>Subscribed Successfully!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Use code below at cart checkout drawer for 10% discount.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px dashed var(--accent)', padding: '8px 16px', borderRadius: '4px', background: 'var(--background)' }}>
                  <Tag size={14} style={{ color: 'var(--accent)' }} />
                  <strong style={{ color: 'var(--text-main)', letterSpacing: '0.05em', fontFamily: 'monospace', fontSize: '1.1rem' }}>WELCOME10</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section style={{ padding: '80px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '12px' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)' }}>Quick answers to common questions about shipping, warranty, and returns.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              
              return (
                <div 
                  key={i} 
                  style={{ 
                    border: '1px solid var(--card-border)', 
                    borderRadius: 'var(--radius-sm)', 
                    background: 'var(--card-bg)',
                    overflow: 'hidden',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <button 
                    onClick={() => toggleFaq(i)}
                    style={{ 
                      width: '100%', 
                      padding: '20px 24px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: isOpen ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  
                  {isOpen && (
                    <div 
                      style={{ 
                        padding: '0 24px 20px 24px', 
                        color: 'var(--text-muted)', 
                        fontSize: '0.9rem', 
                        lineHeight: '1.6',
                        animation: 'fadeIn 0.3s ease-out'
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}

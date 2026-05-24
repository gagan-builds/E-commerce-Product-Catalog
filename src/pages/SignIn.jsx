import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { navigateTo, Link } from '../App';
import { LogIn, Key, Mail, AlertCircle, HelpCircle } from 'lucide-react';

export default function SignIn() {
  const { signIn } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const res = signIn(email, password);
      setLoading(false);
      
      if (res.success) {
        navigateTo('/shop');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  const handlePrefill = (role) => {
    setError('');
    if (role === 'test') {
      setEmail('test@user.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@cartify.com');
      setPassword('password123');
    }
  };

  return (
    <div className="flex-center" style={{ padding: '80px 24px', background: 'radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.08), transparent 45%)' }}>
      <div 
        className="glass" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '40px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleUp var(--transition-normal)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '16px' }}>
            <LogIn size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to access your Cartify shopping portal.</p>
        </div>

        {error && (
          <div 
            style={{ 
              background: 'rgba(239, 68, 68, 0.08)', 
              color: 'var(--danger)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} style={{ color: 'var(--text-muted)' }} />
              Email Address
            </label>
            <input
              type="email"
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} style={{ color: 'var(--text-muted)' }} />
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '24px' }}>
          Don&rsquo;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
            Register here
          </Link>
        </p>

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--card-border)', paddingTop: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <HelpCircle size={12} />
            Convenient testing helpers
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => handlePrefill('test')}
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
            >
              Demo User
            </button>
            <button 
              onClick={() => handlePrefill('admin')}
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '8px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
            >
              Demo Admin
            </button>
          </div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
            Auto fills preset credentials (password: <strong>password123</strong>)
          </span>
        </div>

      </div>
    </div>
  );
}

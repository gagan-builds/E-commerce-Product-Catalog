import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { navigateTo, Link } from '../App';
import { UserPlus, User, Key, Mail, AlertCircle, Check } from 'lucide-react';

export default function SignUp() {
  const { signUp } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the terms and privacy conditions.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = signUp(name, email, password);
      setLoading(false);

      if (res.success) {
        setSuccess(res.message);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeTerms(false);
        
        setTimeout(() => {
          navigateTo('/shop');
        }, 1000);
      } else {
        setError(res.message);
      }
    }, 600);
  };

  return (
    <div className="flex-center" style={{ padding: '80px 24px', background: 'radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.08), transparent 45%)' }}>
      <div 
        className="glass" 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '40px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleUp var(--transition-normal)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '12px', borderRadius: '50%', marginBottom: '16px' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join Cartify to browse and checkout items.</p>
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

        {success && (
          <div 
            style={{ 
              background: 'rgba(16, 185, 129, 0.08)', 
              color: 'var(--accent)', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <Check size={16} />
            <span>{success} Redirecting to shop...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} style={{ color: 'var(--text-muted)' }} />
              Full Name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

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

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} style={{ color: 'var(--text-muted)' }} />
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} style={{ color: 'var(--text-muted)' }} />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', cursor: 'pointer', margin: '8px 0', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                marginTop: '2px',
                borderRadius: '4px',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
              I agree to the Cartify{' '}
              <a href="#" className="nav-link" style={{ textDecoration: 'underline', display: 'inline' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="nav-link" style={{ textDecoration: 'underline', display: 'inline' }}>Privacy Policy</a>.
            </span>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textalign: 'center', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

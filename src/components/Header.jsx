import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link, navigateTo } from '../App';
import { ShoppingBag, Sun, Moon, Sparkles, Settings, LogIn, UserCheck } from 'lucide-react';

function SearchInput() {
  const [searchVal, setSearchVal] = useState('');

  // Sync state with URL search param on popstate/load
  useEffect(() => {
    const syncSearch = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchVal(params.get('search') || '');
    };
    syncSearch();
    window.addEventListener('popstate', syncSearch);
    return () => window.removeEventListener('popstate', syncSearch);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    
    // Redirect search to the /shop route (interactive catalog)
    if (window.location.pathname !== '/shop') {
      navigateTo(`/shop?${params.toString()}`);
    } else {
      // Just push history state to update search parameters locally
      window.history.pushState({}, '', `/shop?${params.toString()}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <input
      type="text"
      placeholder="Search premium catalog..."
      value={searchVal}
      onChange={handleSearch}
      style={{
        width: '100%',
        padding: '10px 16px',
        fontSize: '0.9rem',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--input-bg)',
        border: '1px solid var(--input-border)',
        color: 'var(--text-main)',
        transition: 'border-color var(--transition-fast)'
      }}
    />
  );
}

export default function Header() {
  const { cartItemCount, setIsCartOpen, theme, toggleTheme, user, signOut } = useApp();
  const currentPath = window.location.pathname;

  return (
    <header className="header glass">
      <div className="container header-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <Sparkles size={24} fill="currentColor" />
          <span>Cartify</span>
        </Link>

        {/* Global Search */}
        <div style={{ flex: 1, maxWidth: '360px', margin: '0 24px', position: 'relative' }}>
          <SearchInput />
        </div>

        {/* Navigation & Controls */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="nav-links">
            <Link 
              href="/shop" 
              className={`nav-link ${currentPath === '/shop' ? 'active' : ''}`}
              style={{ fontWeight: '600' }}
            >
              Shop
            </Link>
            
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={14} style={{ color: 'var(--accent)' }} />
                  {user.name}
                </span>
                <button 
                  onClick={signOut}
                  style={{ fontSize: '0.9rem', color: 'var(--danger)', fontWeight: '600', padding: 0 }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link 
                  href="/signin" 
                  className={`nav-link ${currentPath === '/signin' ? 'active' : ''}`}
                  style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <LogIn size={14} />
                  Login
                </Link>
              </div>
            )}

            <Link 
              href="/admin" 
              className={`nav-link ${currentPath.startsWith('/admin') ? 'active' : ''}`}
              style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Settings size={16} />
              Admin
            </Link>
          </div>

          <div className="nav-actions">
            <button 
              className="action-btn" 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              className="action-btn" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
              style={{
                background: 'var(--primary)',
                borderColor: 'var(--primary)',
                color: 'white'
              }}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="badge-count" style={{ animation: 'pulseBorder 2s infinite' }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

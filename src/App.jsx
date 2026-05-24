import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';

// Import Pages
import LandingPage from './pages/LandingPage';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Browser-native SPA Navigation helpers
export function navigateTo(path) {
  window.history.pushState({}, '', path);
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}

export function Link({ href, children, className, style, onClick, ...props }) {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) {
      e.preventDefault();
      navigateTo(href);
    }
  };
  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...props}>
      {children}
    </a>
  );
}

function MainApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync state with popstate event
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Simple SPA Route Switcher
  const renderRoute = () => {
    if (currentPath === '/') {
      return <LandingPage />;
    }
    if (currentPath === '/shop') {
      return <Shop />;
    }
    if (currentPath.startsWith('/product/')) {
      return <ProductDetail />;
    }
    if (currentPath === '/checkout') {
      return <Checkout />;
    }
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }
    if (currentPath === '/signin') {
      return <SignIn />;
    }
    if (currentPath === '/signup') {
      return <SignUp />;
    }
    
    // 404 Fallback
    return (
      <div className="flex-center" style={{ flexDirection: 'column', height: '60vh', gap: '16px' }}>
        <h1 style={{ fontSize: '3rem' }}>404</h1>
        <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  };

  return (
    <div className="main-wrapper">
      <Header />
      <main style={{ flex: 1 }}>
        {renderRoute()}
      </main>
      <footer className="footer">
        <div className="container">
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>&copy; {new Date().getFullYear()} Cartify Inc. All rights reserved.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Rebuilt as a high-fidelity React Single Page Application (SPA).
          </p>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

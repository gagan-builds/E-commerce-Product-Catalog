import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Auth states
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);

  // Load state from localStorage on mount
  useEffect(() => {
    // Cart
    const savedCart = localStorage.getItem('cartify_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }

    // Theme
    const savedTheme = localStorage.getItem('cartify_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    // User session
    const activeSession = localStorage.getItem('cartify_user_session');
    if (activeSession) {
      try { setUser(JSON.parse(activeSession)); } catch (e) { console.error(e); }
    }

    // Load registered users list, seed default user if empty
    const registeredUsers = localStorage.getItem('cartify_users');
    if (registeredUsers) {
      try { 
        setUsersList(JSON.parse(registeredUsers)); 
      } catch (e) { 
        console.error(e); 
      }
    } else {
      const defaultUsers = [
        { name: 'John Doe', email: 'test@user.com', password: 'password123' },
        { name: 'Admin', email: 'admin@cartify.com', password: 'password123' }
      ];
      localStorage.setItem('cartify_users', JSON.stringify(defaultUsers));
      setUsersList(defaultUsers);
    }
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cartify_theme', theme);
  }, [theme]);

  // Sync cart
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cartify_cart', JSON.stringify(newCart));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product, quantity = 1, color = null) => {
    const selectedColor = color || (product.colors && product.colors[0]) || '#000000';
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      item => item.id === product.id && item.color === selectedColor
    );

    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        color: selectedColor,
        quantity: quantity,
        maxStock: product.stock
      });
    }

    saveCart(newCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color) => {
    const newCart = cart.filter(item => !(item.id === productId && item.color === color));
    saveCart(newCart);
  };

  const updateCartQuantity = (productId, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    const newCart = cart.map(item => {
      if (item.id === productId && item.color === color) {
        const quantity = Math.min(newQuantity, item.maxStock || 99);
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  // Coupon helper
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', type: 'percent', value: 10 });
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'SAVEMORE') {
      setAppliedCoupon({ code: 'SAVEMORE', type: 'fixed', value: 15, minTotal: 100 });
      return { success: true, message: '$15 discount applied!' };
    }
    return { success: false, message: 'Invalid promo code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // --- AUTH SIMULATION ---

  const signIn = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem('cartify_users') || '[]');
    const matchingUser = storedUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchingUser) {
      return { success: false, message: 'Email address not registered.' };
    }
    
    if (matchingUser.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    const sessionUser = { name: matchingUser.name, email: matchingUser.email };
    setUser(sessionUser);
    localStorage.setItem('cartify_user_session', JSON.stringify(sessionUser));
    return { success: true, message: `Welcome back, ${matchingUser.name}!` };
  };

  const signUp = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem('cartify_users') || '[]');

    const userExists = storedUsers.some(u => u.email.toLowerCase() === cleanEmail);
    if (userExists) {
      return { success: false, message: 'Email address already registered.' };
    }

    const newUser = { name: name.trim(), email: cleanEmail, password };
    const updatedUsers = [...storedUsers, newUser];
    
    localStorage.setItem('cartify_users', JSON.stringify(updatedUsers));
    setUsersList(updatedUsers);

    const sessionUser = { name: newUser.name, email: newUser.email };
    setUser(sessionUser);
    localStorage.setItem('cartify_user_session', JSON.stringify(sessionUser));
    return { success: true, message: `Account created! Welcome, ${newUser.name}.` };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('cartify_user_session');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      cartDiscount = cartSubtotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'fixed') {
      if (cartSubtotal >= (appliedCoupon.minTotal || 0)) {
        cartDiscount = appliedCoupon.value;
      }
    }
  }

  const cartTax = (cartSubtotal - cartDiscount) * 0.08;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      theme,
      toggleTheme,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      cartSubtotal,
      cartDiscount,
      cartTax,
      cartTotal,
      cartItemCount,
      
      // Auth Exports
      user,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

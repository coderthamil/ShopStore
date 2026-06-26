import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  Tag, 
  CheckCircle, 
  Package, 
  LogOut, 
  Lock, 
  Sparkles, 
  Smartphone, 
  Database,
  Edit,
  X
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopsphere_token') || null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('buyer');

  // App data state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  
  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState('shop'); // 'shop' | 'seller' | 'orders'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Seller Dashboard form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Show Toast Utility
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Initial Data Fetching
  useEffect(() => {
    testBackendConnection();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCart();
      fetchOrders();
      fetchPromos();
    }
  }, [user]);

  const testBackendConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (res.ok) {
        setIsDemoMode(false);
      } else {
        throw new Error("Backend not ok");
      }
    } catch (err) {
      console.warn("Backend server not responding. Falling back to local demo mode.");
      setIsDemoMode(true);
      loadMockData();
    }
  };

  const loadMockData = () => {
    // Inject mock products
    setProducts([
      { id: 101, name: "Quantum Mech Keyboard", price: 129.99, stock: 50, seller_id: 999 },
      { id: 102, name: "Cyberpunk Holographic Jacket", price: 199.99, stock: 20, seller_id: 999 },
      { id: 103, name: "Nebula Soundbuds Pro", price: 89.99, stock: 100, seller_id: 999 },
      { id: 104, name: "AeroSport Active Smartwatch", price: 249.99, stock: 35, seller_id: 999 },
      { id: 105, name: "NeonPulse RGB Mouse", price: 59.99, stock: 120, seller_id: 999 },
    ]);
    // Inject mock promos
    setPromos([
      { id: 1, code: "SAVE10", discount: 10.0, active: true },
      { id: 2, code: "SUPER20", discount: 20.0, active: true },
      { id: 3, code: "FREESHIP", discount: 5.0, active: true }
    ]);
  };

  // API Call wrappers
  const fetchProducts = async () => {
    if (isDemoMode) return;
    try {
      const res = await fetch(`${API_BASE}/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCart = async () => {
    if (isDemoMode || !user) return;
    try {
      const res = await fetch(`${API_BASE}/cart/`);
      if (res.ok) {
        const data = await res.json();
        // Filter cart items for the logged in user
        setCart(data.filter(item => item.user_id === user.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPromos = async () => {
    if (isDemoMode) return;
    try {
      const res = await fetch(`${API_BASE}/promos/`);
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    if (isDemoMode || !user) return;
    try {
      const res = await fetch(`${API_BASE}/orders/`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.filter(item => item.user_id === user.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (isDemoMode) {
      // Mock Auth for testing
      const fakeUser = {
        id: usernameInput === 'seller' ? 3 : 2,
        username: usernameInput,
        role: usernameInput === 'seller' ? 'seller' : roleInput
      };
      setUser(fakeUser);
      setToken("mock_jwt_token");
      localStorage.setItem('shopsphere_user', JSON.stringify(fakeUser));
      localStorage.setItem('shopsphere_token', "mock_jwt_token");
      showToast(`Welcome back, ${fakeUser.username}! (Demo Mode)`);
      return;
    }

    try {
      if (authMode === 'register') {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput,
            password: passwordInput,
            role: roleInput
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast("Registration successful! Please login.");
          setAuthMode('login');
        } else {
          showToast(data.detail || "Registration failed", "error");
        }
      } else {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput,
            password: passwordInput
          })
        });
        const data = await res.json();
        if (res.ok) {
          // Token matches API response
          setToken(data.access_token);
          localStorage.setItem('shopsphere_token', data.access_token);
          
          // Set user credentials from database response
          const loggedUser = data.user;
          
          setUser(loggedUser);
          localStorage.setItem('shopsphere_user', JSON.stringify(loggedUser));
          showToast(`Welcome, ${loggedUser.username}!`);
        } else {
          showToast(data.detail || "Invalid credentials", "error");
        }
      }
    } catch (err) {
      showToast("Server connection error", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setCart([]);
    setOrders([]);
    setAppliedPromo(null);
    localStorage.removeItem('shopsphere_user');
    localStorage.removeItem('shopsphere_token');
    showToast("Logged out successfully");
  };

  // Cart operations
  const handleAddToCart = async (product) => {
    if (product.stock <= 0) {
      showToast("Out of stock!", "error");
      return;
    }

    // Check if product is already in local cart
    const existing = cart.find(item => item.product_id === product.id);
    
    if (isDemoMode) {
      if (existing) {
        setCart(cart.map(item => 
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, { id: Date.now(), user_id: user.id, product_id: product.id, quantity: 1 }]);
      }
      showToast(`Added ${product.name} to cart`);
      return;
    }

    try {
      if (existing) {
        // Update quantity
        const res = await fetch(`${API_BASE}/cart/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
            quantity: existing.quantity + 1
          })
        });
        if (res.ok) {
          fetchCart();
          showToast(`Increased quantity of ${product.name}`);
        }
      } else {
        // Create new cart item
        const res = await fetch(`${API_BASE}/cart/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          })
        });
        if (res.ok) {
          fetchCart();
          showToast(`Added ${product.name} to cart`);
        }
      }
    } catch (e) {
      showToast("Could not add to cart", "error");
    }
  };

  const handleUpdateQty = async (cartItemId, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(cartItemId);
      return;
    }

    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    if (isDemoMode) {
      setCart(cart.map(i => i.id === cartItemId ? { ...i, quantity: newQty } : i));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: item.product_id,
          quantity: newQty
        })
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (e) {
      showToast("Error updating cart quantity", "error");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (isDemoMode) {
      setCart(cart.filter(i => i.id !== cartItemId));
      showToast("Item removed from cart");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart/${cartItemId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCart();
        showToast("Item removed from cart");
      }
    } catch (e) {
      showToast("Error removing item", "error");
    }
  };

  // Promo operations
  const handleApplyPromo = () => {
    if (!promoCodeInput) return;
    const match = promos.find(p => p.code.toUpperCase() === promoCodeInput.trim().toUpperCase() && p.active);
    if (match) {
      setAppliedPromo(match);
      showToast(`Promo "${match.code}" applied: ${match.discount}% off!`);
      setPromoCodeInput('');
    } else {
      showToast("Invalid or expired promo code", "error");
    }
  };

  // Checkout operations
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const subtotal = getCartSubtotal();
    const discountAmount = appliedPromo ? (subtotal * (appliedPromo.discount / 100)) : 0;
    const total = parseFloat((subtotal - discountAmount).toFixed(2));

    if (isDemoMode) {
      const newOrder = {
        id: Date.now(),
        user_id: user.id,
        total: total,
        status: "completed"
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setAppliedPromo(null);
      setIsCartOpen(false);
      showToast("Checkout successful! Thank you for your order.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          total: total,
          status: "completed"
        })
      });
      if (res.ok) {
        // Clear cart
        for (const item of cart) {
          await fetch(`${API_BASE}/cart/${item.id}`, { method: 'DELETE' });
        }
        fetchCart();
        fetchOrders();
        setAppliedPromo(null);
        setIsCartOpen(false);
        showToast("Checkout successful! Order created.");
      }
    } catch (e) {
      showToast("Error processing checkout", "error");
    }
  };

  // Seller Dashboard operations
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) {
      showToast("All fields are required", "error");
      return;
    }

    const payload = {
      name: newProdName,
      price: parseFloat(newProdPrice),
      stock: parseInt(newProdStock),
      seller_id: user.id
    };

    if (isDemoMode) {
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
        showToast("Product updated (Demo Mode)");
      } else {
        setProducts([...products, { id: Date.now(), ...payload }]);
        showToast("Product created (Demo Mode)");
      }
      resetProductForm();
      return;
    }

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`${API_BASE}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/products/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        fetchProducts();
        showToast(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        resetProductForm();
      } else {
        showToast("Error saving product", "error");
      }
    } catch (err) {
      showToast("Server connection error", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (isDemoMode) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted (Demo Mode)");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchProducts();
        showToast("Product deleted successfully");
      }
    } catch (e) {
      showToast("Error deleting product", "error");
    }
  };

  const startEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewProdName(prod.name);
    setNewProdPrice(prod.price.toString());
    setNewProdStock(prod.stock.toString());
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
  };

  // Helper calculations
  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId) || { name: "Unknown Product", price: 0.00 };
  };

  const getCartSubtotal = () => {
    return cart.reduce((acc, item) => {
      const details = getProductDetails(item.product_id);
      return acc + (details.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <CheckCircle size={20} color={toast.type === 'success' ? '#10b981' : '#ef4444'} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="header">
        <div className="logo-container">
          <ShoppingBag size={28} color="#8b5cf6" />
          <h1 className="logo-text">ShopSphere</h1>
        </div>

        {user && (
          <nav className="nav-menu">
            <span 
              className={`nav-item ${currentTab === 'shop' ? 'active' : ''}`}
              onClick={() => setCurrentTab('shop')}
            >
              Shop Catalog
            </span>
            
            {user.role === 'seller' && (
              <span 
                className={`nav-item ${currentTab === 'seller' ? 'active' : ''}`}
                onClick={() => setCurrentTab('seller')}
              >
                Seller Portal
              </span>
            )}
            
            <span 
              className={`nav-item ${currentTab === 'orders' ? 'active' : ''}`}
              onClick={() => setCurrentTab('orders')}
            >
              My Orders ({orders.length})
            </span>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isDemoMode && (
            <div className="badge badge-seller" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', gap: '4px' }}>
              <Database size={13} />
              <span>Demo Mode</span>
            </div>
          )}

          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserIcon size={18} className="text-secondary" />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{user.username}</span>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </div>

              {user.role === 'buyer' && (
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsCartOpen(true)}
                  style={{ position: 'relative' }}
                >
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {getCartItemsCount() > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: 'var(--secondary)',
                      color: 'white',
                      fontSize: '11px',
                      borderRadius: '999px',
                      padding: '2px 6px',
                      fontWeight: '800'
                    }}>
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              )}

              <button className="btn btn-danger" onClick={handleLogout} style={{ padding: '10px' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} className="text-muted" />
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Secured API Connection</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        
        {/* Auth Mode (Logged Out) */}
        {!user && (
          <div className="glass-panel auth-container">
            <div className="auth-tabs">
              <div 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </div>
              <div 
                className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Create Account
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', marginBottom: '24px', fontWeight: '700' }}>
              {authMode === 'login' ? 'Welcome Back' : 'Join ShopSphere'}
            </h2>

            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter username" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              {authMode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Register As</label>
                  <select 
                    className="form-input" 
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    style={{ background: 'rgba(20, 20, 30, 0.9)', cursor: 'pointer' }}
                  >
                    <option value="buyer">Buyer (Shop Catalog)</option>
                    <option value="seller">Seller (Seller Portal)</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px' }}>
                {authMode === 'login' ? 'Sign In to ShopSphere' : 'Create Account'}
              </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isDemoMode ? (
                <p>⚠️ Local database simulator active. Login as "seller" or "buyer" with password "password".</p>
              ) : (
                <p>🎉 Fully connected to live database. Fast JWT authorization.</p>
              )}
            </div>
          </div>
        )}

        {/* Shop tab (Logged In) */}
        {user && currentTab === 'shop' && (
          <div>
            <div className="category-banner">
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="badge badge-buyer" style={{ marginBottom: '12px', gap: '6px' }}>
                  <Sparkles size={12} />
                  <span>Summer Collection 2026</span>
                </div>
                <h2 className="banner-title">Elevate Your Setup with Next-Gen Tech</h2>
                <p className="banner-desc">Explore futuristic mech keyboards, holographic wearables, and audio gear curated for high performance. Apply codes like SAVE10 at checkout.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '26px' }}>Futuristic Gear</h2>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Showing {products.length} products</span>
            </div>

            {products.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <Package size={48} color="var(--text-secondary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)' }}>No products available yet. Click Seller Portal or register as a seller to add products!</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(prod => (
                  <div key={prod.id} className="glass-panel product-card">
                    <div className="product-image-placeholder">
                      <ShoppingBag size={48} className="product-image-icon" />
                      {prod.stock === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'var(--error)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          SOLD OUT
                        </div>
                      )}
                    </div>
                    
                    <div className="product-card-body">
                      <h3 className="product-title">{prod.name}</h3>
                      <div className="product-meta">
                        <span className="product-price">${prod.price.toFixed(2)}</span>
                        <span className="product-stock">{prod.stock} left</span>
                      </div>
                      
                      {user.role === 'buyer' && (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleAddToCart(prod)}
                          disabled={prod.stock === 0}
                          style={{ marginTop: '8px', opacity: prod.stock === 0 ? 0.5 : 1 }}
                        >
                          <Plus size={16} />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seller tab (Logged In, Seller Only) */}
        {user && currentTab === 'seller' && user.role === 'seller' && (
          <div className="seller-dashboard">
            {/* Add / Edit Form */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>
                {editingProduct ? 'Edit Listing' : 'Create New Product'}
              </h2>
              
              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Product Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. SpaceX Mech Keyboard" 
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      placeholder="129.99" 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Stock Quantity</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="50" 
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                    {editingProduct ? 'Save Product' : 'Publish Listing'}
                  </button>
                  {editingProduct && (
                    <button type="button" className="btn btn-secondary" onClick={resetProductForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* My Listings */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '22px', fontWeight: 700, marginBottom: '20px', textAlign: 'left' }}>
                Active Storefront Listings
              </h2>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.seller_id === user.id || isDemoMode).length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No storefront listings. Create your first product using the form.
                        </td>
                      </tr>
                    ) : (
                      products.filter(p => p.seller_id === user.id || isDemoMode).map(prod => (
                        <tr key={prod.id}>
                          <td style={{ fontWeight: '600' }}>{prod.name}</td>
                          <td style={{ fontFamily: 'var(--display)', color: 'var(--accent-cyan)' }}>${prod.price.toFixed(2)}</td>
                          <td>{prod.stock}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '6px' }}
                                onClick={() => startEditProduct(prod)}
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="btn btn-danger" 
                                style={{ padding: '6px' }}
                                onClick={() => handleDeleteProduct(prod.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders tab (Logged In) */}
        {user && currentTab === 'orders' && (
          <div className="glass-panel" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'left' }}>
              Your Orders Log
            </h2>

            {orders.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(order => (
                  <div 
                    key={order.id} 
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>Order #{order.id}</span>
                        <span className="badge badge-buyer" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                          {order.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Simulated secure delivery log
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '20px', fontFamily: 'var(--display)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Cart Drawer Modal */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={22} color="var(--primary)" />
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '20px', fontWeight: 700 }}>Your Cart</h2>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShoppingCart size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => {
              const details = getProductDetails(item.product_id);
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <p className="cart-item-title">{details.name}</p>
                    <p className="cart-item-price">${details.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="cart-qty-control">
                    <button className="cart-qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity - 1)}>-</button>
                    <span style={{ fontSize: '14px', fontWeight: '700', width: '20px', display: 'inline-block', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button className="cart-qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-summary">
            {/* Promo application */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="PROMO CODE" 
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                style={{ flexGrow: 1, padding: '8px 12px', fontSize: '13px' }}
              />
              <button className="btn btn-secondary" onClick={handleApplyPromo} style={{ padding: '8px 12px' }}>
                Apply
              </button>
            </div>

            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Promo: {appliedPromo.code}</span>
                <span style={{ color: 'var(--secondary)' }}>-{appliedPromo.discount}%</span>
              </div>
            )}

            <div className="summary-row" style={{ marginTop: '8px' }}>
              <span>Subtotal</span>
              <span>${getCartSubtotal().toFixed(2)}</span>
            </div>

            {appliedPromo && (
              <div className="summary-row">
                <span>Discount</span>
                <span style={{ color: 'var(--success)' }}>
                  -${(getCartSubtotal() * (appliedPromo.discount / 100)).toFixed(2)}
                </span>
              </div>
            )}

            <div className="summary-row summary-total" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span>Total</span>
              <span>
                ${
                  appliedPromo 
                    ? (getCartSubtotal() - (getCartSubtotal() * (appliedPromo.discount / 100))).toFixed(2)
                    : getCartSubtotal().toFixed(2)
                }
              </span>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handleCheckout} 
              style={{ width: '100%', marginTop: '12px', padding: '12px' }}
            >
              Secure Checkout
            </button>
          </div>
        )}
      </div>

      <footer style={{ marginTop: 'auto', padding: '30px 0', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        <p>© 2026 ShopSphere E-commerce. Powered by FastAPI, SQLAlchemy, PostgreSQL, and React.</p>
      </footer>
    </>
  );
}

export default App;

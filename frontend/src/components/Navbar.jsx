import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { totals } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav style={{ 
      background: '#f8f9fa', 
      padding: '1rem', 
      borderBottom: '1px solid #dee2e6',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Link to="/products" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
        BeautyShop
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/products" style={{ color: '#333', textDecoration: 'none' }}>Produits</Link>
        {isAuthenticated && (
          <>
            <Link to="/missions" style={{ color: '#333', textDecoration: 'none' }}>Missions</Link>
            <Link 
              to="/analytics" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff', 
                textDecoration: 'none', 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
              }}
            >
              📊 Analytics
            </Link>
          </>
        )}
        <Link to="/cart" style={{ color: '#333', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <ShoppingCart size={20} />
          {totals.count > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-10px',
              background: '#10b981',
              color: '#fff',
              borderRadius: '999px',
              padding: '2px 7px',
              fontSize: '0.75rem'
            }}>
              {totals.count}
            </span>
          )}
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/orders" style={{ color: '#333', textDecoration: 'none' }}>Commandes</Link>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                style={{ 
                  color: '#333', 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }} 
                title={user?.username}
              >
                <User size={20} />
              </button>
              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  minWidth: '200px',
                  marginTop: '8px'
                }}>
                  <div style={{ padding: '12px 0' }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #e9ecef' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
                        {user?.username}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {user?.email}
                      </p>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowMenu(false)}
                      style={{ 
                        display: 'block',
                        padding: '10px 16px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Mon Profil
                    </Link>
                    <button 
                      onClick={() => { logout(); navigate('/'); setShowMenu(false); }}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 16px',
                        color: '#dc3545', 
                        border: 'none', 
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#333', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

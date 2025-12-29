import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DesignStudio from './pages/DesignStudio';
import Products from './pages/Products';

// Reusable close button component for toasts
const ToastCloseButton = (t) => (
  <button
    onClick={() => toast.dismiss(t.id)}
    style={{
      background: 'transparent',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '0',
      marginLeft: '12px',
      opacity: 0.8,
      transition: 'opacity 0.2s',
      lineHeight: '1',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onMouseEnter={(e) => (e.target.style.opacity = '1')}
    onMouseLeave={(e) => (e.target.style.opacity = '0.8')}
    aria-label="Close"
  >
    ×
  </button>
);

// Component to conditionally show Layout
const AppContent = () => {
  const location = useLocation();
  const showLayout = !['/login', '/register'].includes(location.pathname);

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/sales" element={<Products />} />
      <Route path="/designs" element={<DesignStudio />} />
      <Route path="/design-studio" element={<DesignStudio />} />
      
    </Routes>
  );

  return showLayout ? <Layout>{routes}</Layout> : routes;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <Toaster 
            position="top-right"
            // Enable close button at Toaster level (applies to all toasts)
            closeButton={true}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Custom close button for all toasts
              closeButton: ToastCloseButton,
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                closeButton: ToastCloseButton,
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                // Ensure close button is explicitly set for error toasts (including network errors)
                closeButton: ToastCloseButton,
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;



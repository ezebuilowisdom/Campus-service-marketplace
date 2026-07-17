import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantWidget from './components/AIAssistantWidget';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ServicesCatalog from './pages/ServicesCatalog';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Restore session on boot
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Dashboard protection middlewares
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/auth?mode=login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-customBg-light dark:bg-customBg-dark text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="flex-grow">
        {/* Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Core Pages Content */}
        <div className="py-6">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Customer Protected Area */}
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Provider Protected Area */}
            <Route 
              path="/provider" 
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Admin Protected Area */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Catalog & Content Pages */}
            <Route path="/services" element={<ServicesCatalog user={user} />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistantWidget user={user} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiBriefcase, FiSettings, FiGrid, FiMessageSquare } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import logoImg from '../logo.jpg';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass-panel shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoImg} 
                alt="Campus Service Marketplace Logo" 
                className="w-12 h-12 rounded-xl object-cover border border-slate-200/10 shadow-sm" 
              />
              <span className="font-black text-xs sm:text-sm tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-sans">
                CAMPUS SERVICE MARKETPLACE
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/services"
              className="text-xs font-bold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-xs font-bold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition"
            >
              Contact
            </Link>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-750 mx-1"></span>

            {user ? (
              <>
                {/* Role-based dashboard links */}
                {user.role === 'customer' && (
                  <Link
                    to="/customer"
                    className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors py-2 px-3 rounded-lg"
                  >
                    <FiGrid className="w-4 h-4" />
                    <span>My Bookings</span>
                  </Link>
                )}
                {user.role === 'provider' && (
                  <Link
                    to="/provider"
                    className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-secondary dark:text-slate-300 dark:hover:text-secondary transition-colors py-2 px-3 rounded-lg"
                  >
                    <FiBriefcase className="w-4 h-4" />
                    <span>Provider Panel</span>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-accent dark:text-slate-300 dark:hover:text-accent transition-colors py-2 px-3 rounded-lg"
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Profile Display / Dropdown */}
                <div className="flex items-center space-x-3 bg-slate-100/50 dark:bg-slate-800/50 py-1.5 px-3 rounded-xl border border-slate-200/20 dark:border-slate-700/20">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-primary dark:text-primary-light">
                      {user.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      onLogout();
                      navigate('/');
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-danger dark:text-slate-400 dark:hover:text-danger hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all"
                    title="Sign Out"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth?mode=login"
                  className="text-sm font-bold text-slate-700 hover:text-primary dark:text-slate-300 dark:hover:text-primary px-4 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="text-sm font-bold text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  Join Marketplace
                </Link>
              </div>
            )}

            <span className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

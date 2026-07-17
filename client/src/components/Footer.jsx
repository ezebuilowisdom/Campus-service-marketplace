import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../logo.jpg';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5 text-white">
              <img 
                src={logoImg} 
                alt="Campus Service Marketplace" 
                className="w-8 h-8 rounded-lg object-cover border border-slate-750" 
              />
              <span className="font-extrabold text-lg tracking-tight">CAMPUS MARKETPLACE</span>
            </div>
            <p className="text-sm max-w-sm">
              The premium, student-run service portal. Discover trusted tutoring, hair dressing, repairs, web development, and local delivery right inside your university campus.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Browse Services</Link>
              </li>
              <li>
                <Link to="/auth?mode=register&role=provider" className="hover:text-white transition">Become a Provider</Link>
              </li>
              <li>
                <Link to="/customer" className="hover:text-white transition">My Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support & Trust</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white cursor-pointer transition">Escrow Protection Guarantee</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition">Campus Moderation Guidelines</span>
              </li>
              <li>
                <span className="text-xs">Helpdesk: support@campusmarketplace.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
          <span>&copy; {new Date().getFullYear()} Campus Service Marketplace. All rights reserved.</span>
          <span className="mt-2 sm:mt-0 text-slate-500">Designed for Final Year Project Defenses.</span>
        </div>
      </div>
    </footer>
  );
}

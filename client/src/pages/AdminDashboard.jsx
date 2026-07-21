import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { 
  FiUserCheck, FiDollarSign, FiCpu, FiTrendingUp, 
  FiFileText, FiShield, FiAlertTriangle, FiTrash, 
  FiCheck, FiX, FiActivity 
} from 'react-icons/fi';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [usersList, setUsersList] = useState([
    { id: 'b1111111-1111-1111-1111-111111111111', email: 'dave.dev@campusmarketplace.edu', full_name: 'David Adebayo', status: 'active', role: 'provider' },
    { id: 'b2222222-2222-2222-2222-222222222222', email: 'sarah.braids@campusmarketplace.edu', full_name: 'Sarah Jenkins', status: 'active', role: 'provider' },
    { id: 'c1111111-1111-1111-1111-111111111111', email: 'alice.student@campusmarketplace.edu', full_name: 'Alice Cooper', status: 'active', role: 'customer' }
  ]);
  const [activeSubTab, setActiveSubTab] = useState('verifications');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchVerifications();
    fetchWithdrawals();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const res = await api.get('/admin/verifications');
      if (res.data.success) {
        setVerifications(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/admin/withdrawals');
      if (res.data.success) {
        setWithdrawals(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerification = async (id, status) => {
    try {
      const res = await api.put(`/admin/verifications/${id}`, {
        status,
        reviewer_notes: `Processed by Administrator on ${new Date().toLocaleDateString()}`
      });

      if (res.data.success) {
        alert(`Verification request ${status} successfully.`);
        fetchVerifications();
      }
    } catch (err) {
      alert('Error updating verification status.');
    }
  };

  const handleWithdrawal = async (id, status) => {
    try {
      const res = await api.put(`/admin/withdrawals/${id}`, { status });

      if (res.data.success) {
        alert(`Payout request status set to ${status}.`);
        fetchWithdrawals();
        fetchStats(); // Update totals
      }
    } catch (err) {
      alert('Error processing withdrawal.');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'ACTIVATE'} this user?`)) return;

    try {
      const res = await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      if (res.data.success) {
        alert(`User is now ${newStatus}.`);
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      alert('Error updating user status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Overview Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans">Admin Control Dashboard</h1>
        <p className="text-slate-500 text-xs mt-1">Review provider listings, verify student badges, moderate reports, and process bank payouts.</p>
      </div>

      {/* Analytics stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col justify-between animate-fade-in">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Total Users</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-sans">{stats.totalUsers}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Approved Providers</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-sans">{stats.totalProviders}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Services Listed</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-sans">{stats.totalServices}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Pending Bookings</span>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2 font-sans">{stats.pendingBookings}</span>
          </div>
        </div>
      )}

      {/* Layout Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveSubTab('verifications')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeSubTab === 'verifications' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Provider Verifications ({verifications.length})
        </button>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeSubTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Moderate Users ({usersList.length})
        </button>
      </div>

      {/* 1. Verifications Request Pane */}
      {activeSubTab === 'verifications' && (
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/30">
              <h3 className="text-xs font-bold">No Pending Verification Requests</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {verifications.map((req) => (
                <div key={req.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-450 block">Status: {req.status}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{req.provider?.profiles?.full_name || 'Professor Tutoring'}</h3>
                    <p className="text-xs text-slate-500">{req.reviewer_notes || 'Upload of tutor student identity card.'}</p>
                    <a href={req.document_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline block pt-2">View Document Card</a>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerification(req.id, 'approved')}
                        className="bg-success hover:bg-success/90 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 transition"
                      >
                        <FiCheck className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleVerification(req.id, 'rejected')}
                        className="bg-danger hover:bg-danger/90 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 transition"
                      >
                        <FiX className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}



      {/* 3. User Moderation Pane */}
      {activeSubTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-700/80">
                <th className="py-3 px-4 font-bold uppercase">Name</th>
                <th className="py-3 px-4 font-bold uppercase">Email</th>
                <th className="py-3 px-4 font-bold uppercase">Role</th>
                <th className="py-3 px-4 font-bold uppercase">Status</th>
                <th className="py-3 px-4 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80">
                  <td className="py-4 px-4 font-bold">{usr.full_name}</td>
                  <td className="py-4 px-4 font-mono text-slate-550">{usr.email}</td>
                  <td className="py-4 px-4 uppercase text-slate-400 font-bold">{usr.role}</td>
                  <td className="py-4 px-4">
                    <span className={`py-1 px-3 rounded-lg font-bold ${usr.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-300'}`}>
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => toggleUserSuspension(usr.id, usr.status)}
                      className={`font-bold py-1.5 px-3 rounded-xl text-[10px] transition uppercase ${usr.status === 'active' ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'}`}
                    >
                      {usr.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

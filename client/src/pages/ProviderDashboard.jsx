import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, FiCalendar, FiShield, 
  FiPlus, FiTrash,
  FiCheck, FiX, FiAlertCircle, 
  FiUserCheck, FiShoppingBag
} from 'react-icons/fi';

const statusNames = {
  1: 'Pending Acceptance',
  2: 'Accepted (Awaiting Payment)',
  3: 'Rejected by You',
  4: 'Paid (Escrow Hold)',
  5: 'Completed (Awaiting Release)',
  6: 'Confirmed (Completed)',
  7: 'Cancelled'
};

const statusColors = {
  1: 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300',
  2: 'bg-blue-100 text-blue-800 dark:bg-blue-900/35 dark:text-blue-300',
  3: 'bg-red-100 text-red-800 dark:bg-red-900/35 dark:text-red-300',
  4: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/35 dark:text-cyan-300',
  5: 'bg-purple-100 text-purple-800 dark:bg-purple-900/35 dark:text-purple-300',
  6: 'bg-green-100 text-green-800 dark:bg-green-900/35 dark:text-green-300',
  7: 'bg-slate-100 text-slate-800 dark:bg-slate-900/35 dark:text-slate-350'
};

export default function ProviderDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0.00, escrow_balance: 0.00 });
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  // Service form fields
  const [showAddService, setShowAddService] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(60);
  const [categoryId, setCategoryId] = useState('');
  const [locationType, setLocationType] = useState('campus');
  const [buildingName, setBuildingName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Portfolio
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchProviderProfile(),
        fetchBookings(),
        fetchProviderServices(),
        fetchCategories(),
        fetchWallet(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setVerificationStatus(res.data.profile.verification_status || 'pending');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallets');
      if (res.data.success) {
        setWallet(res.data.wallet);
      }
    } catch (err) {
      console.error('Wallet fetch error:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Bookings fetch error:', err);
    }
  };

  const fetchProviderServices = async () => {
    try {
      const res = await api.get('/services/mine');
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      // fallback: get all and filter by provider id
      try {
        const res2 = await api.get('/services');
        if (res2.data.success) {
          setServices(res2.data.services.filter(s => s.provider_id === user.id));
        }
      } catch (err2) {
        console.error('Services fetch error:', err2);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/services/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) setCategoryId(res.data.categories[0].id);
      }
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { action });
      if (res.data.success) {
        alert(`Booking ${action}ed successfully.`);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating booking status.');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const res = await api.post('/services', {
        category_id: parseInt(categoryId),
        title,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
        location_type: locationType,
        building_name: buildingName,
        room_number: roomNumber
      });

      if (res.data.success) {
        setShowAddService(false);
        setTitle(''); setDescription(''); setPrice('');
        fetchProviderServices();
      }
    } catch (err) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors.map(e => e.message).join('\n')
        : (err.response?.data?.message || 'Error adding service listing.');
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Remove this service listing?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data.success) fetchProviderServices();
    } catch (err) {
      alert('Error deleting service.');
    }
  };

  const handleAddPortfolio = (e) => {
    e.preventDefault();
    if (!newPortfolioTitle.trim()) return;
    setPortfolioItems(prev => [...prev, {
      id: Date.now().toString(),
      title: newPortfolioTitle,
      media_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80'
    }]);
    setNewPortfolioTitle('');
  };

  const completedBookings = bookings.filter(b => b.status_id === 6).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans">Provider Studio</h1>
          <p className="text-slate-500 text-xs mt-1">
            Welcome back, <span className="font-semibold text-primary">{user?.name}</span>
            {user?.shop_name && <span className="text-slate-400"> · {user.shop_name}</span>}
          </p>
        </div>
        <div className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-xs font-bold border ${
          verificationStatus === 'approved'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200/30'
            : verificationStatus === 'rejected'
            ? 'bg-red-50 dark:bg-red-900/20 text-danger border-red-200/30'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200/30'
        }`}>
          {verificationStatus === 'approved' ? <FiUserCheck className="w-4 h-4" /> :
           verificationStatus === 'rejected' ? <FiX className="w-4 h-4" /> :
           <FiAlertCircle className="w-4 h-4 animate-pulse" />}
          <span className="uppercase tracking-wider">
            {verificationStatus === 'approved' ? 'Verified Provider' :
             verificationStatus === 'rejected' ? 'Verification Rejected' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/20 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
          <span className="text-2xl font-extrabold font-sans text-slate-800 dark:text-slate-200">
            ₦{parseFloat(wallet?.balance ?? 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-success font-bold uppercase">Available</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/20 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Escrow Hold</span>
          <span className="text-2xl font-extrabold font-sans text-amber-500">
            ₦{parseFloat(wallet?.escrow_balance ?? 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-amber-500 font-bold uppercase">Locked</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/20 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-2xl font-extrabold font-sans text-slate-800 dark:text-slate-200">{bookings.length}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/20 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
          <span className="text-2xl font-extrabold font-sans text-slate-800 dark:text-slate-200">{completedBookings}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6 overflow-x-auto">
        {['bookings', 'services', 'portfolio'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {tab === 'bookings' ? 'Incoming Bookings' : tab === 'services' ? 'Manage Listings' : 'My Portfolio'}
          </button>
        ))}
      </div>

      {/* ── Tab: Incoming Bookings ── */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(n => <div key={n} className="h-28 bg-white dark:bg-slate-800 animate-pulse rounded-2xl" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
              <span className="text-4xl">📭</span>
              <h3 className="text-md font-bold mt-3">No Bookings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Service requests will appear here once customers order from you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200/40 dark:border-slate-700/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xs font-bold py-1 px-3 rounded-lg ${statusColors[booking.status_id]}`}>
                        {statusNames[booking.status_id]}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {booking.booking_date} @ {booking.booking_time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-sans">{booking.service?.title}</h3>
                    <p className="text-xs text-slate-400">
                      Customer: <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {booking.customer?.profiles?.full_name || 'Student Customer'}
                      </span>
                    </p>
                    {booking.notes && (
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/10 text-xs text-slate-500 max-w-md">
                        <span className="font-bold block text-slate-600 dark:text-slate-400">Client Note:</span>
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Earnings</span>
                      <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-sans">
                        ₦{parseFloat(booking.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {booking.status_id === 1 && (
                        <>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'accept')}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-primary/20 transition flex items-center gap-1"
                          >
                            <FiCheck className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleBookingAction(booking.id, 'reject')}
                            className="bg-danger hover:bg-danger/90 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-danger/20 transition flex items-center gap-1"
                          >
                            <FiX className="w-3.5 h-3.5" /> Decline
                          </button>
                        </>
                      )}
                      {booking.status_id === 4 && (
                        <button
                          onClick={() => handleBookingAction(booking.id, 'complete')}
                          className="bg-success hover:bg-success/90 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-success/20 transition flex items-center gap-1"
                        >
                          <FiCheck className="w-3.5 h-3.5" /> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Manage Listings ── */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {verificationStatus !== 'approved' && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-2.5">
              <FiAlertCircle className="w-5 h-5 shrink-0" />
              <span>Your profile is pending administrator verification. You can list services once approved.</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-sans">Active Gig Listings ({services.length})</h2>
            {verificationStatus === 'approved' ? (
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition"
              >
                <FiPlus className="w-4 h-4" />
                <span>{showAddService ? 'Cancel' : 'Create New Service'}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">Approval required to list services</span>
            )}
          </div>

          {/* Add Service Form */}
          <AnimatePresence>
            {showAddService && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddService}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/25 space-y-4 max-w-2xl overflow-hidden"
              >
                <h3 className="font-bold text-sm font-sans">New Service Listing</h3>

                {formError && (
                  <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-bold px-4 py-3 rounded-xl">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Location Type</label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="campus">Hostel / Campus Spot</option>
                      <option value="online">Online / Remote</option>
                      <option value="delivery">Campus Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Gig Title</label>
                  <input type="text" required placeholder="e.g. Knotless Braids, Screen Repair"
                    value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Description</label>
                  <textarea rows="3" required placeholder="What's included? Explain clearly..."
                    value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Price (₦)</label>
                    <input type="number" required placeholder="2500" min="1"
                      value={price} onChange={e => setPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Duration (minutes)</label>
                    <input type="number" required placeholder="60" min="1"
                      value={duration} onChange={e => setDuration(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {locationType === 'campus' && (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Building / Hostel Hall"
                      value={buildingName} onChange={e => setBuildingName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input type="text" placeholder="Room Number (optional)"
                      value={roomNumber} onChange={e => setRoomNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}

                <button type="submit" disabled={formLoading}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition disabled:opacity-50"
                >
                  {formLoading ? 'Publishing...' : 'Publish Gig'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
              <span className="text-3xl">🛍️</span>
              <h3 className="text-sm font-bold mt-3">No listings yet</h3>
              <p className="text-xs text-slate-500 mt-1">Create your first gig to start accepting customers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex justify-between items-center gap-4">
                  <div>
                    <h3 className="font-bold text-sm leading-snug">{service.title}</h3>
                    <span className="text-[10px] text-slate-400 block mt-1 uppercase tracking-wider">
                      {service.location_type} · {service.duration_minutes} mins
                    </span>
                    <span className="text-sm font-bold text-primary block mt-2">
                      ₦{parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2.5 bg-danger/10 text-danger hover:bg-danger/20 rounded-xl transition"
                    title="Delete Listing"
                  >
                    <FiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Portfolio ── */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-sans">Portfolio Gallery</h2>
            <form onSubmit={handleAddPortfolio} className="flex gap-2">
              <input
                type="text" required placeholder="Item title..."
                value={newPortfolioTitle} onChange={e => setNewPortfolioTitle(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs transition">
                Add
              </button>
            </form>
          </div>

          {portfolioItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
              <span className="text-3xl">🖼️</span>
              <h3 className="text-sm font-bold mt-3">No portfolio items yet</h3>
              <p className="text-xs text-slate-500 mt-1">Add images to showcase your best work to potential customers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/20 shadow-sm">
                  <img
                    src={item.media_url} alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80'; }}
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-xs">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

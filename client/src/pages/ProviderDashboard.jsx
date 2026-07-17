import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, FiCalendar, FiScissors, FiShield, 
  FiFileText, FiPlus, FiTrash, FiEdit2, 
  FiCheck, FiX, FiAward, FiAlertCircle, 
  FiGrid, FiTrendingUp, FiUserCheck, FiUpload 
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


  // Form lists
  const [showAddService, setShowAddService] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(60);
  const [categoryId, setCategoryId] = useState('');
  const [locationType, setLocationType] = useState('campus');
  const [buildingName, setBuildingName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  // Portfolios
  const [portfolioItems, setPortfolioItems] = useState([
    { id: '1', title: 'Calculus Session notes', media_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643' }
  ]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');

  // Verification
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    fetchProviderProfile();
    fetchBookings();
    fetchProviderServices();
    fetchCategories();
  }, []);

  const fetchProviderProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setVerificationStatus(res.data.profile.verification_status || 'pending');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProviderServices = async () => {
    try {
      const res = await axios.get('/api/services');
      if (res.data.success) {
        // Filter mock services of current provider
        const filtered = res.data.services.filter(s => s.provider_id === user.id);
        setServices(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/services/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) setCategoryId(res.data.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };



  const handleBookingAction = async (bookingId, action) => {
    try {
      const res = await axios.put(`/api/bookings/${bookingId}/status`, { action }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        alert(`Booking status changed successfully: ${action}`);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating booking status.');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/services', {
        category_id: parseInt(categoryId),
        title,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration),
        location_type,
        building_name: buildingName,
        room_number: roomNumber
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.success) {
        alert('Service listing added successfully.');
        setShowAddService(false);
        setTitle('');
        setDescription('');
        setPrice('');
        fetchProviderServices();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors
        ? err.response.data.errors.map(e => e.message).join('\n')
        : (err.response?.data?.message || 'Error adding service listing.');
      alert(errorMsg);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service gig?')) return;
    try {
      const res = await axios.delete(`/api/services/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        fetchProviderServices();
      }
    } catch (err) {
      alert('Error deleting service.');
    }
  };



  const handleAddPortfolio = (e) => {
    e.preventDefault();
    if (!newPortfolioTitle) return;
    const newItem = {
      id: Date.now().toString(),
      title: newPortfolioTitle,
      media_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1'
    };
    setPortfolioItems(prev => [...prev, newItem]);
    setNewPortfolioTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Wallet Balance */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-start text-xs text-slate-400">
            <span>Usable Payout Balance</span>
            <span className="text-success uppercase font-bold">Available</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block leading-none">Total Balance</span>
            <span className="text-3xl font-extrabold font-sans text-slate-800 dark:text-slate-200">${wallet.balance}</span>
          </div>
        </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Jobs Done */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm space-y-2 flex flex-col justify-between animate-fade-in">
          <span className="text-xs text-slate-400 block">Total Bookings</span>
          <span className="text-3xl font-extrabold font-sans text-slate-800 dark:text-slate-200">{bookings.length}</span>
        </div>

        {/* Verification Status */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm space-y-2 flex flex-col justify-between">
          <span className="text-xs text-slate-400 block">Verification status</span>
          <div className="flex items-center space-x-2">
            {verificationStatus === 'approved' ? (
              <>
                <FiUserCheck className="text-success w-6 h-6" />
                <span className="font-extrabold text-sm uppercase text-success tracking-wider">Approved</span>
              </>
            ) : verificationStatus === 'rejected' ? (
              <>
                <FiX className="text-danger w-6 h-6" />
                <span className="font-extrabold text-sm uppercase text-danger tracking-wider">Rejected</span>
              </>
            ) : (
              <>
                <FiAlertCircle className="text-amber-500 w-6 h-6 animate-pulse" />
                <span className="font-extrabold text-sm uppercase text-amber-500 tracking-wider">Pending</span>
              </>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Incoming Bookings
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          Manage Listings
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'portfolio' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
        >
          My Portfolio
        </button>
      </div>

      {/* 1. Incoming Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
              <span className="text-3xl">📭</span>
              <h3 className="text-md font-bold mt-2">No Incoming Bookings Yet</h3>
              <p className="text-xs text-slate-500">Service requests will display here once customers order your services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200/40 dark:border-slate-700/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xs font-bold py-1 px-3 rounded-lg ${statusColors[booking.status_id]}`}>
                        {statusNames[booking.status_id]}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Date Requested: {booking.booking_date} @ {booking.booking_time}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-sans">{booking.service?.title}</h3>
                    <p className="text-xs text-slate-400">
                      Customer Student: <span className="font-semibold text-slate-600 dark:text-slate-350">{booking.customer?.profiles?.full_name || 'Bob Sterling'}</span>
                    </p>

                    {booking.notes && (
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/10 text-xs text-slate-500 max-w-md">
                        <span className="font-bold block text-slate-600">Client details:</span>
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block">Total Earnings</span>
                      <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-sans">${parseFloat(booking.price).toFixed(2)}</span>
                    </div>

                    {/* Action buttons */}
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
                          <FiCheck className="w-3.5 h-3.5" /> Mark Job Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Manage Listings Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {verificationStatus !== 'approved' && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-2.5">
              <FiAlertCircle className="w-5 h-5 shrink-0" />
              <span>
                Your provider profile is currently pending administrator verification. 
                You will be able to list new services and accept bookings as soon as your account is approved.
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-sans">Active Gig Listings</h2>
            {verificationStatus === 'approved' ? (
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create New Service</span>
              </button>
            ) : (
              <button
                disabled
                className="bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed font-bold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5"
                title="Account approval required"
              >
                <FiPlus className="w-4 h-4" />
                <span>Create New Service (Locked)</span>
              </button>
            )}
          </div>

          {/* Add Service Block */}
          {showAddService && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddService}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/25 space-y-4 max-w-2xl"
            >
              <h3 className="font-bold text-sm font-sans mb-2">Gig Parameters</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Service Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
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
                    className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="campus">Hostel / Campus Spot</option>
                    <option value="online">Online / Remote</option>
                    <option value="delivery">Campus Delivery</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Gig Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Knotless Braids, Screen repair"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Full Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain exactly what is included in this service..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Price Rate ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="25.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    placeholder="60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {locationType === 'campus' && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Building name / Hostel Hall"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Room Number (optional)"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition"
              >
                Publish Gig
              </button>
            </motion.form>
          )}

          {/* Services List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-sm leading-snug">{service.title}</h3>
                  <span className="text-[10px] text-slate-400 block mt-1 uppercase tracking-wider">{service.location_type} • {service.duration_minutes} Mins</span>
                  <span className="text-sm font-bold text-primary block mt-2">${parseFloat(service.price).toFixed(2)}</span>
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
        </div>
           )}

      {/* 4. Portfolio items */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-sans">Portfolio Gallery</h2>
            <form onSubmit={handleAddPortfolio} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Item title..."
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-xl text-xs transition"
              >
                Add Image
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/20 shadow-sm">
                <img 
                  src={item.media_url} 
                  alt={item.title} 
                  className="w-full h-48 object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="p-4">
                  <h4 className="font-bold text-xs">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

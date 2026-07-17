import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiStar, FiSliders } from 'react-icons/fi';

const categoryBanners = {
  'graphic-design': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
  'web-development': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
  'mobile-app': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
  'photography': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  'videography': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
  'hair-dressing': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
  'barbering': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
  'laundry': 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80',
  'cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  'laptop-repair': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
  'phone-repair': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'tutoring': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
  'assignment-typing': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80',
  'cv-writing': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
  'printing': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'fashion-design': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
  'makeup': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  'event-decoration': 'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&w=600&q=80',
  'delivery-services': 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80',
  'others': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'
};

export default function ServicesCatalog({ user }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [locationType, setLocationType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchFilteredServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/services/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilteredServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCat) params.category = selectedCat;
      if (locationType) params.location = locationType;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.rating = minRating;
      if (sortBy) params.sort = sortBy;

      const res = await axios.get('/api/services', { params });
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchFilteredServices();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCat('');
    setLocationType('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('newest');
    // Fetch immediately after clearing state
    setTimeout(() => {
      fetchFilteredServices();
    }, 50);
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a Student Customer to book this service.');
      return;
    }
    if (user.role !== 'customer') {
      alert('Only Customers (Students) can book services.');
      return;
    }

    try {
      const res = await axios.post('/api/bookings', {
        service_id: bookingService.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: bookingNotes
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setBookingService(null);
          setBookingDate('');
          setBookingTime('');
          setBookingNotes('');
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating booking.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans">Browse Campus Gigs</h1>
        <p className="text-slate-500 text-xs mt-1">Discover tutoring, styling, typing services with advanced filters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Form */}
        <form onSubmit={handleApplyFilters} className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm space-y-4 h-fit">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <FiSliders className="w-4 h-4 text-primary" /> Filter Options
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[10px] text-slate-400 hover:text-slate-650 uppercase font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Search */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-450">Keyword</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 gap-2">
              <FiSearch className="text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-455">Category</label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-2 text-xs outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-455">Location Mode</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-2 text-xs outline-none"
            >
              <option value="">Any Location</option>
              <option value="campus">On Campus / Hostel</option>
              <option value="online">Online / Remote</option>
              <option value="delivery">Delivery Service</option>
            </select>
          </div>

          {/* Price Max */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-455">Max Budget ($)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-2 text-xs outline-none"
            />
          </div>

          {/* Ratings */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-455">Minimum Star Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-2 text-xs outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4">4.0 ★ & Above</option>
              <option value="4.5">4.5 ★ & Above</option>
              <option value="4.8">4.8 ★ & Above</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-455">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-2 text-xs outline-none"
            >
              <option value="newest">Recently Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-primary/20"
          >
            Apply Filters
          </button>
        </form>

        {/* Results list */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-white dark:bg-slate-800 animate-pulse"></div>
              ))}
            </div>
              ) : services.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-250/20">
              <span className="text-3xl">📭</span>
              <h3 className="font-bold text-sm mt-2">No Matching Services</h3>
              <p className="text-xs text-slate-505">Try adjusting your filters or keyword query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -3 }}
                  onClick={() => setBookingService(service)}
                  className="bg-white dark:bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-200/40 dark:border-slate-700/40 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Service Card Banner Image */}
                  <div className="relative h-40 overflow-hidden w-full shrink-0">
                    <img 
                      src={service.image_url || categoryBanners[service.category?.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'} 
                      alt={service.title} 
                      className="w-full h-full object-cover hover:scale-102 transition-all duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = categoryBanners[service.category?.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase py-1 px-2.5 rounded-lg tracking-wider">
                        {service.category?.name || 'Service'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1 text-warning">
                          <FiStar className="fill-current w-3.5 h-3.5" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {service.provider?.rating_average || '0.00'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">{service.location_type}</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base leading-snug line-clamp-1">{service.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{service.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-[10px] text-slate-405 pt-2 border-t border-slate-105 dark:border-slate-700/60">
                      <div className="flex items-center space-x-1">
                        <FiMapPin className="w-3.5 h-3.5" />
                        <span className="capitalize">{service.location_type} Mode</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>{service.duration_minutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-355">{service.provider?.profiles?.full_name || 'Vetted Provider'}</span>
                    <span className="font-extrabold text-primary text-base">${parseFloat(service.price).toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Slot Modal */}
      <AnimatePresence>
        {bookingService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200/50 dark:border-slate-800"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase py-1 px-2.5 rounded-md tracking-wider">{bookingService.category?.name}</span>
                  <h2 className="text-xl font-bold mt-2">{bookingService.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">Offered by {bookingService.provider?.profiles?.full_name || 'Verified Provider'}</p>
                </div>
                <button
                  onClick={() => {
                    setBookingService(null);
                    setBookingSuccess(false);
                  }}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{bookingService.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/20">
                    <span className="text-slate-450 block font-normal">Pricing</span>
                    <span className="text-base text-primary">${parseFloat(bookingService.price).toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200/20">
                    <span className="text-slate-450 block font-normal">Time</span>
                    <span className="text-base text-slate-800 dark:text-slate-200">{bookingService.duration_minutes} Mins</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Book Slot</h3>

                  {bookingSuccess ? (
                    <div className="bg-success/10 text-success text-xs font-bold p-4 rounded-xl text-center">
                      🎉 Booking Requested Successfully!
                    </div>
                  ) : !user ? (
                    <div className="bg-warning/10 text-warning text-xs font-bold p-4 rounded-xl text-center">
                      🔒 Log in as a Student Customer to book this slot.
                    </div>
                  ) : user.role !== 'customer' ? (
                    <div className="bg-danger/10 text-danger text-xs font-bold p-4 rounded-xl text-center">
                      ⚠️ Booking rejected: Provider accounts cannot book slots.
                    </div>
                  ) : (
                    <form onSubmit={handleBookService} className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-500 font-bold block">Date</label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-250/20 rounded-xl px-3 py-2 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 font-bold block">Time</label>
                          <input
                            type="time"
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-250/20 rounded-xl px-3 py-2 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500 font-bold block">Gigs notes / requirements</label>
                        <textarea
                          rows="2"
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-250/20 rounded-xl px-3 py-2 outline-none resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-primary/20"
                      >
                        Confirm Booking Slot
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

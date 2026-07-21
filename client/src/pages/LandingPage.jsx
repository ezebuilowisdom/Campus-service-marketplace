import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiTrendingUp, FiScissors, FiBookOpen, 
  FiCpu, FiCamera, FiMapPin, FiClock, FiStar, 
  FiArrowRight, FiShield, FiDollarSign, FiCheckCircle,
  FiMessageSquare, FiCheck
} from 'react-icons/fi';

const iconMap = {
  FiTrendingUp: FiTrendingUp,
  FiScissors: FiScissors,
  FiBookOpen: FiBookOpen,
  FiCpu: FiCpu,
  FiCamera: FiCamera
};

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

export default function LandingPage({ user, onAddBooking }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hero Slider Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
      gradient: "from-blue-950 via-slate-950 to-indigo-950",
      badge: "🎓 ACADEMICS & TUTORING • VETTED HELP",
      title: "Calculus, Physics & Coding Prep Sessions",
      description: "Connect with top-rated seniors and tutors for 1-on-1 private lessons, exam prep, and homework formatting.",
    },
    {
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80",
      gradient: "from-slate-950 via-purple-950 to-slate-900",
      badge: "💻 FREELANCE & CREATIVE • CAMPUS FREELANCERS",
      title: "Custom React Portfolios, Graphic Design & Flyers",
      description: "Hire talented student developers, photographers, and video editors for your custom campus events and portfolios.",
    },
    {
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1920&q=80",
      gradient: "from-cyan-950 via-slate-950 to-teal-950",
      badge: "✨ HOSTEL SERVICES & REPAIRS • DOORSTEP DELIVERY",
      title: "Knotless Braids, Shaves, Laundry & Laptop Fixes",
      description: "Book fast room visits for wig sewing, wash & dry packages, phone screen swaps, and hardware diagnostics.",
    }
  ];

  // Booking Modal State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchServices();

    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/services/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async (categorySlug = null) => {
    setLoading(true);
    try {
      const params = {};
      if (categorySlug) params.category = categorySlug;
      
      const res = await api.get('/services', { params });
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/services', {
        params: {
          search: searchQuery,
          category: selectedCategory
        }
      });
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (categorySlug) => {
    const newCat = selectedCategory === categorySlug ? null : categorySlug;
    setSelectedCategory(newCat);
    fetchServices(newCat);
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a Customer to book this service.');
      return;
    }
    if (user.role !== 'customer') {
      alert('Only Customers (Students) can book services.');
      return;
    }

    try {
      const res = await api.post('/bookings', {
        service_id: selectedService.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: bookingNotes
      });

      if (res.data.success) {
        setBookingSuccess(true);
        if (onAddBooking) onAddBooking();
        setTimeout(() => {
          setBookingSuccess(false);
          setSelectedService(null);
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
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section Slider Carousel */}
      <section className="relative w-full h-[620px] overflow-hidden bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Image Carousel with AnimatePresence */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-tr ${slides[activeSlide].gradient}`}
            >
              <img
                src={slides[activeSlide].image}
                alt="Campus Marketplace"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]"></div>
        </div>

        {/* Hero Slider Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white flex flex-col items-center space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Badge Pill */}
              <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white border border-white/20 uppercase tracking-widest">
                {slides[activeSlide].badge}
              </span>

              {/* Slider Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sans leading-tight max-w-3xl">
                {slides[activeSlide].title}
              </h1>

              {/* Slider Description */}
              <p className="text-sm sm:text-lg text-slate-200 max-w-2xl font-medium leading-relaxed">
                {slides[activeSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Glassmorphic Search Bar */}
          <motion.form 
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full max-w-2xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/25 gap-2 mt-4"
          >
            <div className="flex-1 flex items-center px-3 gap-2">
              <FiSearch className="text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="What campus service are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2 text-sm text-white placeholder:text-white/60 font-sans"
              />
            </div>
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-extrabold py-2.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-primary/20"
            >
              Search Gigs
            </button>
          </motion.form>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 pt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === index ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Categories Horizontal Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold font-sans">Browse Categories</h2>
            <p className="text-sm text-slate-500">Select a category to filter down student services</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((cat) => {
            const IconComponent = iconMap[cat.icon] || FiTrendingUp;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.slug)}
                className={`relative overflow-hidden group flex flex-col items-center justify-center h-28 rounded-2xl border transition-all duration-200 ${
                  isSelected 
                  ? 'border-primary ring-2 ring-primary/40 text-white' 
                  : 'border-slate-200/40 dark:border-slate-700/40'
                }`}
              >
                <img 
                  src={cat.image_url || categoryBanners[cat.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6'} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = categoryBanners[cat.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6';
                  }}
                />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/50 transition-all duration-205"></div>
                <div className="relative z-10 flex flex-col items-center justify-center p-3 text-white">
                  <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg mb-2 text-white">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold font-sans uppercase tracking-wider text-center">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Services Grid List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-sans">Popular Campus Services</h2>
          <p className="text-sm text-slate-500">Fully backed by our student review rating system</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-3xl">📭</span>
            <h3 className="text-md font-bold mt-2">No Gigs Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your filters or category choice.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedService(service)}
                className="bg-white dark:bg-slate-800/50 rounded-[28px] overflow-hidden border border-slate-100 dark:border-slate-700/40 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Service Card Banner Image */}
                <div className="relative h-64 overflow-hidden w-full shrink-0">
                  <img 
                    src={service.image_url || categoryBanners[service.category?.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'} 
                    alt={service.title} 
                    className="w-full h-full object-cover hover:scale-103 transition-all duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = categoryBanners[service.category?.slug] || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <span className="bg-[#F59E0B] text-white text-[9px] font-extrabold uppercase py-1.5 px-3 rounded-lg tracking-wider shadow-sm flex items-center gap-1">
                      🕒 Escrow Secured
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[8px] font-extrabold uppercase py-1 px-2.5 rounded-lg tracking-wider border border-white/20 shadow-sm inline-block self-start">
                      {service.category?.name || 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Footer Content Block */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug line-clamp-1 font-sans">
                    {service.title}
                  </h3>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/50 dark:border-slate-700/30">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base font-sans">
                      GH₵{parseFloat(service.price).toFixed(2)}
                    </span>
                    <div className="bg-[#047857] hover:bg-[#059669] text-white p-2.5 rounded-full shadow-md transition duration-200 flex items-center justify-center shrink-0">
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-slate-100 dark:bg-slate-800/20 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-sans">Simple 4-Step Booking Flow</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Find and hire verified student providers on your campus. Settle details directly and pay in-person upon job completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Request Gig', desc: 'Pick your preferred student provider, select a booking slot, and describe requirements.', icon: FiClock },
              { step: '2', title: 'Provider Accepts', desc: 'The provider reviews your request, slot availability, and accepts the booking.', icon: FiCheckCircle },
              { step: '3', title: 'Connect & Coordinate', desc: 'Chat directly on the platform to coordinate details, meeting spots, or delivery.', icon: FiMessageSquare },
              { step: '4', title: 'Meet & Complete', desc: 'Meet up to get the work done, settle the price directly in person, and leave a review.', icon: FiCheck }
            ].map((card, i) => {
              const IconComp = card.icon;
              return (
                <div key={i} className="relative bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/30 dark:border-slate-700/30 space-y-4">
                  <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {card.step}
                  </div>
                  <div className="flex justify-center pt-2">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="font-bold font-sans">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Become a Provider CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 rounded-3xl text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between shadow-xl">
          <div className="space-y-4 max-w-xl relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight font-sans">Have a skill? Earn on campus!</h2>
            <p className="text-primary-light text-sm leading-relaxed">
              Join dozens of campus barbers, tailors, photographers, tutors, and developers setting their own rates and getting bookings with automated payouts.
            </p>
          </div>
          <div className="mt-6 sm:mt-0 relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
            <a 
              href="/auth?mode=register&role=provider" 
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-3 rounded-xl transition duration-200 text-sm shadow-md"
            >
              Get Started as Provider
            </a>
          </div>
          {/* Background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* 6. Service Details & Booking Flow Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200/50 dark:border-slate-800"
            >
              {/* Header */}
              <div className="relative p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-start">
                <div>
                  <span className="bg-secondary/10 text-secondary text-[10px] font-extrabold uppercase py-1 px-2.5 rounded-md tracking-wider">
                    {selectedService.category?.name}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2 font-sans">{selectedService.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Offered by <span className="font-bold text-slate-700 dark:text-slate-300">{selectedService.provider?.profiles?.full_name || 'Verified Provider'}</span>
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedService(null);
                    setBookingSuccess(false);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl text-slate-400 hover:text-slate-700 transition"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">About the Gig</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedService.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/20">
                    <span className="text-slate-400 block">Pricing Rate</span>
                    <span className="text-lg font-bold text-primary font-sans">${parseFloat(selectedService.price).toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/20">
                    <span className="text-slate-400 block">Est. Duration</span>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-sans">{selectedService.duration_minutes} Mins</span>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Book Your Slot</h3>
                  
                  {bookingSuccess ? (
                    <div className="bg-success/10 text-success text-xs font-bold p-4 rounded-2xl text-center">
                      🎉 Booking Requested Successfully! Forwarding details...
                    </div>
                  ) : !user ? (
                    <div className="bg-warning/10 text-warning text-xs font-bold p-4 rounded-2xl text-center">
                      🔒 You must be signed in as a Student Customer to book slots. 
                      <a href="/auth?mode=login" className="underline ml-1">Sign In Now</a>
                    </div>
                  ) : user.role !== 'customer' ? (
                    <div className="bg-danger/10 text-danger text-xs font-bold p-4 rounded-2xl text-center">
                      ⚠️ Booking rejected: Only customer roles are allowed to place service orders.
                    </div>
                  ) : (
                    <form onSubmit={handleBookService} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Select Date</label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500">Select Time</label>
                          <input
                            type="time"
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Custom Gigs Notes / Requirements</label>
                        <textarea
                          rows="3"
                          placeholder="Describe specific details for the service (e.g. hair braids length, laptop symptoms, delivery address...)"
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition duration-200 text-xs shadow-md shadow-primary/20"
                      >
                        Request Booking
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

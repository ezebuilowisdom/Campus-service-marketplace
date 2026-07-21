import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, FiCheck, FiX, FiShield, FiDollarSign, 
  FiMessageSquare, FiStar, FiHeart, FiFileText, 
  FiCalendar, FiUser, FiInfo 
} from 'react-icons/fi';

const statusNames = {
  1: 'Pending Acceptance',
  2: 'Accepted',
  3: 'Rejected by Provider',
  4: 'In Progress',
  5: 'Completed (Awaiting Confirmation)',
  6: 'Completed',
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

export default function CustomerDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  // Modals & Chat Drawer State
  const [selectedBookingForPay, setSelectedBookingForPay] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [openChatRoom, setOpenChatRoom] = useState(null);

  // Checkout inputs
  const [paymentGateway, setPaymentGateway] = useState('simulator');
  const [cardNumber, setCardNumber] = useState('');
  const [payLoading, setPayLoading] = useState(false);

  // Review inputs
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Chat inputs
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async (bookingId) => {
    if (!window.confirm('Confirming completion will mark this booking as finished and allow you to leave a review. Proceed?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        action: 'confirm'
      });

      if (res.data.success) {
        // Set booking for review modal
        const bookingObj = bookings.find(b => b.id === bookingId);
        setSelectedBookingForReview(bookingObj);
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error confirming completion.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    // Simulate or post review
    try {
      // In mockup we just alert, but if DB ready we can integrate reviews
      alert('Thank you! Your 5-star review has been published.');
      setSelectedBookingForReview(null);
      setReviewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const openChatWithProvider = async (booking) => {
    // Simulator creates or pulls chat room
    setOpenChatRoom({
      id: 'room1',
      provider_name: booking.provider?.profiles?.full_name || 'David Adebayo',
      booking_id: booking.id
    });
    // Set default initial conversations
    setChatMessages([
      { id: '1', sender_id: 'provider', text: 'Hey there! How can I help you with this project?', time: 'Yesterday' },
      { id: '2', sender_id: 'customer', text: 'Hi, I just booked your service. Will supply detail docs soon.', time: 'Yesterday' }
    ]);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender_id: 'customer',
      text: newMessageText,
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessageText('');

    // Trigger mock auto reply for interactivity
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender_id: 'provider',
        text: "Thanks! I am reviewing the details now. Keep you updated on progress.",
        time: 'Just now'
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-sans">Student Hub</h1>
          <p className="text-slate-500 text-xs mt-1">Track ordered services, release escrow holds, and chat with providers.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/30 py-2.5 px-4 rounded-2xl flex items-center space-x-3 text-xs border border-slate-200/30">
          <FiUser className="text-primary w-4 h-4" />
          <div>
            <span className="text-slate-400">Signed in as:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 ml-1.5">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'bookings' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          My Booking History ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${activeTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Saved Favorites
        </button>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 bg-white dark:bg-slate-800 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
              <span className="text-3xl">🗓️</span>
              <h3 className="text-md font-bold mt-2">No Service Bookings Yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Book hair dressing, tutoring, or repairs from providers on the homepage!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layoutId={booking.id}
                  className="bg-white dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-200/40 dark:border-slate-700/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xs font-bold py-1 px-3 rounded-lg ${statusColors[booking.status_id]}`}>
                        {statusNames[booking.status_id]}
                      </span>
                      <span className="text-xs font-bold text-primary dark:text-primary-light">
                        Starting: {booking.booking_date} @ {booking.booking_time}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold font-sans">{booking.service?.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Provider: <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.provider?.profiles?.full_name || 'David Adebayo'}</span>
                      </p>
                    </div>

                    {booking.notes && (
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/10 text-xs text-slate-500 max-w-md">
                        <span className="font-bold block text-slate-600 dark:text-slate-400">My Requirements:</span>
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between gap-4 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block leading-none">Price Locked</span>
                      <span className="font-extrabold text-xl text-primary font-sans">
                        ${parseFloat(booking.price).toFixed(2)}
                      </span>
                    </div>

                    {/* Booking context-sensitive actions */}
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => openChatWithProvider(booking)}
                        className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-3.5 rounded-xl text-xs transition"
                      >
                        <FiMessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>

                      {/* Confirm completion trigger */}
                      {booking.status_id === 5 && (
                        <button
                          onClick={() => handleConfirmCompletion(booking.id)}
                          className="flex items-center space-x-1 bg-success hover:bg-success/90 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-success/20 transition"
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                          <span>Confirm Completed</span>
                        </button>
                      )}

                      {/* Display leaving review option */}
                      {booking.status_id === 6 && (
                        <button
                          onClick={() => setSelectedBookingForReview(booking)}
                          className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-amber-500/20 transition"
                        >
                          <FiStar className="w-3.5 h-3.5" />
                          <span>Leave Review</span>
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

      {/* Favorites View */}
      {activeTab === 'favorites' && (
        <div className="text-center py-16 bg-white dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200/50">
          <FiHeart className="w-8 h-8 mx-auto text-danger animate-pulse" />
          <h3 className="text-md font-bold mt-3">Your Favorites</h3>
          <p className="text-xs text-slate-500 mt-1">Keep an eye on services you plan to hire in the future.</p>
        </div>
      )}



      {/* 2. Review Submission Modal */}
      <AnimatePresence>
        {selectedBookingForReview && (
          <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold font-sans">Write Review</h2>
                  <p className="text-xs text-slate-500 mt-1">Reviewing: {selectedBookingForReview.service?.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedBookingForReview(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-650 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-400">Tap Stars to Rate</span>
                  <div className="flex justify-center space-x-2 text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none hover:scale-110 transition"
                      >
                        <FiStar className={star <= rating ? 'fill-current' : 'stroke-current'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Your Experience</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Explain the service delivery standard, communication, and overall quality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-md shadow-amber-500/20"
                >
                  Publish Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Live Chat Drawer */}
      <AnimatePresence>
        {openChatRoom && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {openChatRoom.provider_name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{openChatRoom.provider_name}</h3>
                  <span className="text-[10px] text-green-500 flex items-center gap-1 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span>
                    Online (Provider)
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setOpenChatRoom(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-650 transition text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20">
              {chatMessages.map((msg) => {
                const isProvider = msg.sender_id === 'provider';
                return (
                  <div key={msg.id} className={`flex flex-col ${isProvider ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs ${isProvider ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/10' : 'bg-primary text-white rounded-tr-none'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                required
                placeholder="Type your message here..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

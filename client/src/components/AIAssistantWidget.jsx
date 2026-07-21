import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiSend, FiStar, FiCalendar, FiShield, FiDollarSign, FiClock } from 'react-icons/fi';

export default function AIAssistantWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm your Campus AI Assistant. Ask me to recommend the best services based on your budget, ratings, and locations.\n\nTry asking:\n• *'Who is the best web developer?'*\n• *'Looking for hair styling under $30'*",
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Booking Modal inside AI Widget
  const [bookingService, setBookingService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text, time: 'Just now' }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { query: text });
      if (res.data.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: res.data.answer,
          recommendations: res.data.recommendations,
          time: 'Just now'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I ran into an error connecting to the campus registry. Please try again.',
        time: 'Just now'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (service) => {
    if (!user) {
      alert('Please log in as a Student Customer to book services.');
      return;
    }
    if (user.role !== 'customer') {
      alert('Only Customers (Students) can request bookings.');
      return;
    }
    setBookingService(service);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/bookings', {
        service_id: bookingService.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        notes: bookingNotes
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
    <>
      {/* 1. Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-tr from-primary via-secondary to-accent p-4 rounded-full text-white shadow-xl flex items-center justify-center group"
          aria-label="Ask Campus AI"
        >
          <FiCpu className="w-6 h-6 animate-pulse" />
          <span className="absolute right-14 scale-0 group-hover:scale-100 bg-slate-900 text-white font-bold text-[10px] uppercase py-1 px-3 rounded-lg shadow-lg tracking-wider transition-all duration-150 origin-right shrink-0">
            Ask Campus AI
          </span>
        </motion.button>
      </div>

      {/* 2. Interactive Chat Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white">
                  <FiCpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Campus AI Assistant</h3>
                  <span className="text-[9px] text-primary font-bold uppercase tracking-wider">Natural Language Search</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-650 transition text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      isAI 
                      ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/10 shadow-sm' 
                      : 'bg-primary text-white rounded-tr-none shadow-sm'
                    }`}>
                      {msg.text}

                      {/* Render recommended cards if any */}
                      {isAI && msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-4 space-y-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-700/60">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">AI Recommended Gigs:</span>
                          {msg.recommendations.slice(0, 3).map((rec) => (
                            <div key={rec.id} className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/10 flex justify-between items-center gap-2">
                              <div className="flex-grow">
                                <h4 className="font-bold text-[11px] leading-tight text-slate-800 dark:text-slate-200 line-clamp-1">{rec.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-primary">${parseFloat(rec.price).toFixed(2)}</span>
                                  <span className="text-[9px] text-slate-450">• {rec.provider?.full_name || 'Verified Provider'}</span>
                                  <span className="text-[9px] text-warning flex items-center gap-0.5">
                                    ★{rec.provider?.rating_average || '0.0'}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleBookNow(rec)}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-1.5 px-3 rounded-lg text-[9px] transition shrink-0"
                              >
                                Book
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-center space-x-1.5 text-xs text-slate-450">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Quick Pills */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-wrap gap-1.5">
              {[
                "Web Dev under $150",
                "Best Hair Dresser",
                "Tutoring under $20"
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pill)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/60 text-slate-650 dark:text-slate-350 text-[10px] font-bold py-1 px-2.5 rounded-lg border border-slate-250/10 transition"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Message input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex gap-2"
            >
              <input
                type="text"
                required
                placeholder="Ask me: 'Barber under $20'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/45 outline-none text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Embedded Mini Slot Booking Modal */}
      <AnimatePresence>
        {bookingService && (
          <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold font-sans text-slate-800 dark:text-slate-200">Confirm Booking</h3>
                  <span className="text-[10px] text-slate-450">{bookingService.title}</span>
                </div>
                <button
                  onClick={() => setBookingService(null)}
                  className="p-1 hover:bg-slate-105 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {bookingSuccess ? (
                <div className="bg-success/10 text-success text-xs font-bold p-4 rounded-xl text-center">
                  🎉 Booking Requested Successfully!
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block">Select Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block">Select Time</label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold block">Optional notes</label>
                    <textarea
                      placeholder="Special instructions..."
                      rows="2"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-primary/20"
                  >
                    Confirm Booking slot for ${parseFloat(bookingService.price).toFixed(2)}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

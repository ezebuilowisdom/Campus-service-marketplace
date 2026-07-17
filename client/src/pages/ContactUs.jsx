import React, { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiCheck } from 'react-icons/fi';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setName('');
      setEmail('');
      setMsg('');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans">Contact Student Helpdesk</h1>
        <p className="text-slate-500 text-xs max-w-md mx-auto">Have queries about escrow payouts, booking issues, or provider onboarding? Send us a ticket.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
              <FiMail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 uppercase block font-bold">Email Tickets</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">support@campusmarket.edu</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary shrink-0">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 uppercase block font-bold">Office Spot</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Student Union Building, Room 102</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/20 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
              <FiPhone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-450 uppercase block font-bold">Emergency Call</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">+234 812 345 6789</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/20 shadow-sm">
          {success ? (
            <div className="bg-success/10 text-success p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center h-full">
              <FiCheck className="w-8 h-8 text-success animate-bounce" />
              <h3 className="font-bold text-sm">Ticket Submitted Successfully!</h3>
              <p className="text-[11px] text-slate-450">We will respond to your registered email address within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alice Cooper"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alice@student.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Query Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us details of your issue (e.g. Escrow payout delays, refund request...)"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary/40 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow-md shadow-primary/20"
              >
                Submit Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

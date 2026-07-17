import React from 'react';
import { FiTarget, FiShield, FiUsers, FiAward } from 'react-icons/fi';

export default function AboutUs() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <section className="text-center space-y-4 py-8">
        <span className="text-xs uppercase font-extrabold tracking-widest text-primary bg-primary/10 py-1.5 px-3.5 rounded-full">
          Our Vision
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight">
          Empowering Student Gigs
        </h1>
        <p className="text-slate-550 dark:text-slate-350 max-w-2xl mx-auto text-base sm:text-lg">
          Campus Service Marketplace is designed to bridge the trust gap between student micro-vendors and university residents, creating a secure local economy.
        </p>
      </section>

      {/* Grid Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/20 shadow-sm space-y-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit">
            <FiTarget className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-sans">The Mission</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Students face significant friction finding service providers on campus, relying on WhatsApp statuses or word-of-mouth. Our mission is to centralize and index these service listings to help students save time and support campus side-hustles.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200/20 shadow-sm space-y-3">
          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary w-fit">
            <FiShield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-sans">Escrow Protection Guarantees</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By holding booking fees in a secure escrow wallet ledger, we eliminate default risks. Student vendors are guaranteed payment upon completing their task, and customers are guaranteed refunds if a provider declines.
          </p>
        </div>
      </section>

      {/* Stats Block */}
      <section className="bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 rounded-3xl text-white text-center">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-8">Platform Principles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <span className="text-4xl font-extrabold block">100%</span>
            <span className="text-xs text-slate-200 mt-2 block">Vetted Student Profiles</span>
          </div>
          <div>
            <span className="text-4xl font-extrabold block">$0</span>
            <span className="text-xs text-slate-200 mt-2 block">Upfront Payment Risk</span>
          </div>
          <div>
            <span className="text-4xl font-extrabold block">24/7</span>
            <span className="text-xs text-slate-200 mt-2 block">Helpdesk Escalation Chat</span>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="space-y-6 text-center">
        <h3 className="text-xl font-bold font-sans">How We Support Campus Careers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { title: 'Independent Pricing', desc: 'Providers set their hourly or project-based rates freely with zero price capping.' },
            { title: 'Availability Schedulers', desc: 'Sync hours around classes, lectures, and examination periods.' },
            { title: 'Verified Badges', desc: 'Submit a student matric ID to gain a verified marketplace icon and double booking volumes.' }
          ].map((pill, i) => (
            <div key={i} className="bg-slate-100 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200/10">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">{pill.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{pill.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

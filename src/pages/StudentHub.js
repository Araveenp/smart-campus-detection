import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const FAQS = [
  { q: 'How does SmartCampus prioritize my reports?', a: 'Our RAG AI Engine scans the description text of submitted complaints to determine the category and safety impact. Critical issues like main line leaks or grid faults are dispatched within minutes, while minor concerns like chipped paint are scheduled for regular off-peak maintenance.' },
  { q: 'What is the Student Leaderboard and how do I earn points?', a: 'Students earn community involvement points by filing genuine reports that get resolved, or by validating that issues in their hostels have been successfully resolved by the technicians. High leaderboard rankings earn campus recognition.' },
  { q: 'Can I file complaints anonymously?', a: 'To prevent spam and maintain a clean verification queue, we require authentication through your campus student account. However, you can toggle an option to hide your email/name from the public heatmap view when submitting.' },
  { q: 'Who resolves the tickets I submit?', a: 'Tickets are automatically routed to the corresponding department maintenance office (e.g., IT, Security, or Facilities). Designated professional maintenance staff will accept and update the status in real time.' }
];

export default function StudentHub() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Student Portal Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Student Hub</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about reporting campus issues, climbing the leaderboard, and improving our community.
          </p>
        </div>

        {/* Step-by-Step Reporting Journey */}
        <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-2xl p-8 mb-16">
          <h2 className="text-xl font-bold text-white mb-8">How to File a Complaint</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-mono text-primary font-bold text-lg">1</div>
              <h3 className="text-white font-semibold text-lg">Create Account</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sign up as a student using your email credential. Fill out your department and hostel registration tags.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center font-mono text-secondary font-bold text-lg">2</div>
              <h3 className="text-white font-semibold text-lg">Submit Details</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Describe the issue clearly. Our AI automatically maps your description to categorizations and SOP dispatch rules.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim/20 flex items-center justify-center font-mono text-tertiary-fixed-dim font-bold text-lg">3</div>
              <h3 className="text-white font-semibold text-lg">Track & Confirm</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Watch status updates live in your dashboard. Validate the completion to earn community points on the leaderboard!
              </p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200 ${expandedIndex === idx ? 'bg-white/[0.02] border-white/20' : 'bg-transparent hover:bg-white/[0.01]'}`}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 text-white font-semibold text-[16px]"
                >
                  <span>{faq.q}</span>
                  <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${expandedIndex === idx ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {expandedIndex === idx && (
                  <div className="px-6 pb-6 pt-2 text-gray-400 text-[15px] leading-relaxed border-t border-white/[0.05] bg-white/[0.01]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-12 text-center shadow-sm inner-glow">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to improve your campus?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Create your profile now and join hundreds of students actively co-managing the campus environment.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-transform hover:scale-105">
              Register Student Profile
            </Link>
            <Link to="/login" className="border border-white/10 text-white px-8 py-3 rounded-full hover:bg-white/5 transition-colors">
              Access Student Login
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicLayout({ children }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    navigate('/', { state: { activeTab: tab } });
  };

  return (
    <div className="font-body-md antialiased selection:bg-custom-btn-primary selection:text-white bg-[#070708] text-[#e5e2e3] min-h-screen flex flex-col justify-between">
      {/* Fixed Header */}
      <header className="bg-[#070708]/90 backdrop-blur-md w-full top-0 h-[80px] border-b border-white/[0.05] z-50 fixed">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1728px] mx-auto h-full">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="font-bold tracking-tight text-white text-lg">SmartCampus</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-10 h-full items-center">
            <button onClick={() => handleNavClick('Overview')} className="font-body-md text-gray-400 hover:text-white transition-colors duration-200">Platform</button>
            <button onClick={() => handleNavClick('Overview')} className="font-body-md text-gray-400 hover:text-white transition-colors duration-200">Dashboard</button>
            <button onClick={() => handleNavClick('Campus Heatmap')} className="font-body-md text-gray-400 hover:text-white transition-colors duration-200">Heatmap</button>
            <button onClick={() => handleNavClick('Leaderboard')} className="font-body-md text-gray-400 hover:text-white transition-colors duration-200">Leaderboard</button>
          </nav>
          <div className="hidden sm:flex gap-4 md:gap-6 items-center">
            <Link className="font-body-md text-gray-400 hover:text-white transition-colors duration-200" to="/login">Log in</Link>
            <Link className="font-body-md bg-white text-black px-6 py-2.5 rounded-full hover:bg-opacity-90 transition-all duration-200 font-medium shadow-sm hover:scale-105" to="/signup">Start free</Link>
          </div>
          <button className="md:hidden text-white flex items-center justify-center p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#0d0e0f] border-b border-white/[0.05] px-6 py-6 flex flex-col gap-4">
            <button className="text-left font-body-md text-body-md text-gray-400 hover:text-white py-2" onClick={() => { handleNavClick('Overview'); setMobileMenuOpen(false); }}>Platform</button>
            <button className="text-left font-body-md text-body-md text-gray-400 hover:text-white py-2" onClick={() => { handleNavClick('Overview'); setMobileMenuOpen(false); }}>Dashboard</button>
            <button className="text-left font-body-md text-body-md text-gray-400 hover:text-white py-2" onClick={() => { handleNavClick('Campus Heatmap'); setMobileMenuOpen(false); }}>Heatmap</button>
            <button className="text-left font-body-md text-body-md text-gray-400 hover:text-white py-2" onClick={() => { handleNavClick('Leaderboard'); setMobileMenuOpen(false); }}>Leaderboard</button>
            <div className="flex gap-4 pt-4 border-t border-white/[0.05] items-center">
              <Link className="flex-1 text-center font-body-md text-body-md text-gray-400 hover:text-white py-2.5 border border-white/[0.1] rounded-full" to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
              <Link className="flex-1 text-center font-body-md text-body-md bg-white text-black py-2.5 rounded-full font-medium" to="/signup" onClick={() => setMobileMenuOpen(false)}>Start free</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1516px] mx-auto mt-[80px] px-4 sm:px-8 py-8 sm:py-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0b] border-t border-white/[0.05] flex flex-col justify-between px-6 md:px-8 pt-12 md:pt-24 pb-12 md:pb-16 w-full">
        <div className="max-w-[1728px] w-full mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-16 mb-12 md:mb-16">
          <div className="col-span-2 pr-0 md:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-[14px]">S</div>
              <span className="text-[24px] font-bold text-white tracking-tight">SmartCampus</span>
            </div>
            <p className="text-gray-400 max-w-sm">The intelligent operating layer for focused administration teams.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-mono text-white font-medium mb-1 text-[11px] tracking-widest uppercase">PLATFORM</div>
            <button onClick={() => handleNavClick('Overview')} className="text-[14px] text-gray-400 hover:text-white transition-colors text-left">Dashboard</button>
            <button onClick={() => handleNavClick('Campus Heatmap')} className="text-[14px] text-gray-400 hover:text-white transition-colors text-left">Heatmap</button>
            <button onClick={() => handleNavClick('Leaderboard')} className="text-[14px] text-gray-400 hover:text-white transition-colors text-left">Leaderboard</button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-mono text-white font-medium mb-1 text-[11px] tracking-widest uppercase">RESOURCES</div>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/sop-index">SOP Index</Link>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/ai-api">AI Engine API</Link>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/status-reports">Status Reports</Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-mono text-white font-medium mb-1 text-[11px] tracking-widest uppercase">AUTH</div>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/login">Login</Link>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/signup">Get Started</Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="font-mono text-white font-medium mb-1 text-[11px] tracking-widest uppercase">CAMPUS</div>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/admins">Admins</Link>
            <Link className="text-[14px] text-gray-400 hover:text-white transition-colors" to="/student-hub">Student Hub</Link>
          </div>
        </div>
        <div className="max-w-[1728px] w-full mx-auto flex flex-col sm:flex-row gap-6 justify-between items-center border-t border-white/[0.05] pt-12 mt-auto text-center sm:text-left">
          <div className="font-mono text-gray-400 text-[13px]">© 2026 SmartCampus. All rights reserved.</div>
          <div className="flex gap-8">
            <Link className="font-mono text-gray-400 text-[13px] hover:text-white transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <Link className="font-mono text-gray-400 text-[13px] hover:text-white transition-colors" to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

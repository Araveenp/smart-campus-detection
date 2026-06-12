import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/landing.css';

export default function LandingPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeMockTab, setActiveMockTab] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mockDashboardRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Enlarged date format (e.g., June 12, 2026)
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      
      // Dynamic time format (e.g., 07:15:32 PM)
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveMockTab(location.state.activeTab);
      setTimeout(() => {
        if (mockDashboardRef.current) {
          mockDashboardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleMockNavClick = (tab) => {
    setActiveMockTab(tab);
    if (mockDashboardRef.current) {
      mockDashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-body-md antialiased selection:bg-custom-btn-primary selection:text-white bg-[#070708] text-[#e5e2e3] min-h-screen">
      {/* 1. Fixed Header */}
      <header className="bg-custom-bg/90 backdrop-blur-md w-full top-0 h-[80px] border-b border-custom-divider z-50 fixed">
        <div className="flex justify-between items-center w-full px-4 md:px-margin-safe max-w-[1728px] mx-auto h-full">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full border border-custom-text-muted flex items-center justify-center text-on-surface font-h3 font-bold text-sm">S</div>
            <span className="font-h3 text-lg md:text-h3 font-bold tracking-tight text-on-surface">SmartCampus</span>
          </div>
          <nav className="hidden md:flex gap-10 h-full items-center">
            <button className="font-body-md text-body-md text-custom-text-muted hover:text-white transition-colors duration-200" onClick={() => handleMockNavClick('Overview')}>Platform</button>
            <button className="font-body-md text-body-md text-custom-text-muted hover:text-white transition-colors duration-200" onClick={() => handleMockNavClick('Overview')}>Dashboard</button>
            <button className="font-body-md text-body-md text-custom-text-muted hover:text-white transition-colors duration-200" onClick={() => handleMockNavClick('Campus Heatmap')}>Heatmap</button>
            <button className="font-body-md text-body-md text-custom-text-muted hover:text-white transition-colors duration-200" onClick={() => handleMockNavClick('Leaderboard')}>Leaderboard</button>
          </nav>
          <div className="hidden sm:flex gap-4 md:gap-6 items-center">
            <Link className="font-body-md text-body-md text-custom-text-muted hover:text-on-surface transition-colors duration-200" to="/login">Log in</Link>
            <Link className="font-body-md text-[13px] md:text-body-md bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-opacity-90 transition-all duration-200 font-medium shadow-sm hover:scale-105" to="/signup">Start free</Link>
          </div>
          <button className="md:hidden text-white flex items-center justify-center p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#0d0e0f] border-b border-custom-divider px-6 py-6 flex flex-col gap-4">
            <button className="text-left font-body-md text-body-md text-custom-text-muted hover:text-white py-2" onClick={() => { handleMockNavClick('Overview'); setMobileMenuOpen(false); }}>Platform</button>
            <button className="text-left font-body-md text-body-md text-custom-text-muted hover:text-white py-2" onClick={() => { handleMockNavClick('Overview'); setMobileMenuOpen(false); }}>Dashboard</button>
            <button className="text-left font-body-md text-body-md text-custom-text-muted hover:text-white py-2" onClick={() => { handleMockNavClick('Campus Heatmap'); setMobileMenuOpen(false); }}>Heatmap</button>
            <button className="text-left font-body-md text-body-md text-custom-text-muted hover:text-white py-2" onClick={() => { handleMockNavClick('Leaderboard'); setMobileMenuOpen(false); }}>Leaderboard</button>
            <div className="flex gap-4 pt-4 border-t border-white/[0.05] items-center">
              <Link className="flex-1 text-center font-body-md text-body-md text-custom-text-muted hover:text-on-surface py-2.5 border border-white/[0.1] rounded-full" to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
              <Link className="flex-1 text-center font-body-md text-body-md bg-white text-black py-2.5 rounded-full font-medium" to="/signup" onClick={() => setMobileMenuOpen(false)}>Start free</Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-[1728px] mx-auto mt-[80px]">
        {/* 2. Hero & 3. Hero Dashboard Mockup */}
        <section className="px-4 md:px-margin-safe relative pt-20 md:pt-48 pb-16 md:pb-32">
          <div className="max-w-[1516px] mx-auto">
            <div className="flex flex-col mb-16 md:mb-32 items-center text-center">
              
              {/* Dynamic Enlarged Date Badge */}
              <div className="mb-8 flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md max-w-full">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_#50d8e9] animate-pulse flex-shrink-0"></span>
                <span className="font-mono-data text-[10px] sm:text-label-sm text-custom-text-muted tracking-widest uppercase truncate">
                  OPERATIONAL DATE: <strong className="text-white text-[13px] sm:text-[15px] font-bold ml-1 tracking-tight">{currentDate}</strong>{" // "}<span className="text-secondary">{currentTime}</span>
                </span>
              </div>

              <h1 className="font-h3 text-[36px] sm:text-[54px] md:text-hero-headline text-on-surface mb-8 max-w-[1000px] leading-tight">
                Smart Campus<br/>Problem Detection System
              </h1>
              <p className="font-body-lg text-[16px] sm:text-[18px] md:text-[22px] text-custom-text-muted mb-12 max-w-3xl leading-relaxed">
                Automatically classify student complaints, predict priority levels, and generate AI-powered action plans using Retrieval-Augmented Generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-[280px] sm:max-w-none">
                <Link to="/signup" className="w-full sm:w-auto text-center bg-white text-black px-8 py-3.5 rounded-full font-body-lg font-medium shadow-sm hover:scale-105 transition-transform">Get started</Link>
                <Link to="/login" className="w-full sm:w-auto text-center bg-transparent border border-custom-divider text-on-surface px-8 py-3.5 rounded-full font-body-lg hover:bg-white/5 transition-colors">Admin panel</Link>
              </div>
              <div className="mt-12 md:mt-16 text-center">
                <span className="text-custom-text-muted font-mono-data hover:text-primary flex items-center justify-center gap-2 transition-colors text-xs sm:text-sm">
                  AI operating layer active at smartcampus.edu/dashboard <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Hero Dashboard Mockup */}
            <div ref={mockDashboardRef} className="w-full bg-[#0a0a0b] rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col md:flex-row h-auto md:h-[720px] inner-glow shadow-2xl relative shadow-black/50">
              
              {/* Sidebar */}
              <div className="w-full md:w-72 bg-[#0d0e0f] border-b md:border-b-0 md:border-r border-white/[0.05] p-4 md:p-8 flex flex-col gap-2 md:gap-6 flex-shrink-0">
                <div className="hidden md:block text-[11px] text-custom-text-muted uppercase tracking-[0.2em] mb-4 px-2 opacity-50 font-bold">Navigation</div>
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar pb-2 md:pb-0">
                  <button 
                    onClick={() => setActiveMockTab('Overview')}
                    className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Overview' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    <span className="text-body-md">Overview</span>
                  </button>
                  <button 
                    onClick={() => setActiveMockTab('Live Signals')}
                    className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Live Signals' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">sensors</span>
                    <span className="text-body-md">Live Signals</span>
                  </button>
                  <button 
                    onClick={() => setActiveMockTab('AI Resolutions')}
                    className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'AI Resolutions' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span className="text-body-md">AI Resolutions</span>
                  </button>
                  <button 
                    onClick={() => setActiveMockTab('Analytics')}
                    className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Analytics' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                    <span className="text-body-md">Analytics</span>
                  </button>
                  <button 
                    onClick={() => setActiveMockTab('Campus Heatmap')}
                    className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Campus Heatmap' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">map</span>
                    <span className="text-body-md">Heatmap</span>
                  </button>
                  <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 md:mt-6 md:pt-6 md:border-t border-white/[0.05]">
                    <button 
                      onClick={() => setActiveMockTab('Admins')}
                      className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Admins' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">group</span>
                      <span className="text-body-md">Admins</span>
                    </button>
                    <button 
                      onClick={() => setActiveMockTab('Leaderboard')}
                      className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors cursor-pointer text-left flex-shrink-0 whitespace-nowrap ${activeMockTab === 'Leaderboard' ? 'bg-white/[0.06] text-on-surface font-medium shadow-sm inner-glow' : 'text-custom-text-muted hover:text-on-surface hover:bg-white/[0.03]'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">leaderboard</span>
                      <span className="text-body-md">Leaderboard</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Area */}
              <div className="flex-1 p-6 md:p-10 flex flex-col gap-6 md:gap-10 bg-[#0a0a0b] relative max-h-[500px] md:max-h-none overflow-y-auto w-full">
                
                {/* 1. Render Overview View */}
                {activeMockTab === 'Overview' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                      {/* System Date Card */}
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-[11px] text-custom-text-muted font-bold uppercase tracking-widest opacity-70">SYSTEM DATE</div>
                        </div>
                        <div className="font-h3 text-[20px] leading-tight text-primary font-bold tracking-tight uppercase mt-2">
                          {currentDate || 'LOADING...'}
                        </div>
                        <div className="text-[12px] text-secondary font-medium mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] animate-pulse">schedule</span>
                          {currentTime || 'Syncing...'}
                        </div>
                      </div>

                      {/* Open Approvals / Complaints */}
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-[11px] text-custom-text-muted font-bold uppercase tracking-widest opacity-70">ACTIVE COMPLAINTS</div>
                        </div>
                        <div className="font-h3 text-[32px] leading-tight text-on-surface font-bold tracking-tight">14</div>
                        <div className="text-[12px] text-tertiary font-medium mt-4 pt-4 border-t border-white/[0.05]">3 requiring immediate attention</div>
                      </div>

                      {/* System Risk Index */}
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-[11px] text-custom-text-muted font-bold uppercase tracking-widest opacity-70">SYSTEM STATUS</div>
                        </div>
                        <div className="font-h3 text-[32px] leading-tight text-on-surface font-bold uppercase tracking-tight">STABLE</div>
                        <div className="text-[12px] text-[#E5FD17] font-medium mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5FD17] animate-pulse"></span>
                          All AI nodes healthy
                        </div>
                      </div>

                      {/* AI Pacing/Accuracy */}
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-[11px] text-custom-text-muted font-bold uppercase tracking-widest opacity-70">AI CLASSIFICATION</div>
                        </div>
                        <div className="font-h3 text-[32px] leading-tight text-on-surface font-bold tracking-tight">95%</div>
                        <div className="text-[12px] text-custom-text-muted font-medium mt-4 pt-4 border-t border-white/[0.05]">Avg validation score</div>
                      </div>
                    </div>

                    {/* Live Signal Wave */}
                    <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow flex flex-col h-[280px]">
                      <div className="flex justify-between items-center mb-8 px-2">
                        <div className="flex items-center gap-6">
                          <div className="text-[12px] font-bold text-on-surface uppercase tracking-widest opacity-70">Campus Operations Flow</div>
                          <div className="font-mono-data text-[10px] text-primary/50 uppercase tracking-tighter bg-primary/10 px-2 py-1 rounded">[LATENCY: 45ms]</div>
                        </div>
                        <div className="flex gap-6 text-[11px] text-custom-text-muted font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#bec2ff]"></span>Incoming Signals</span>
                          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>Goal Resolution</span>
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl bg-[#070708]/80 border border-white/[0.03] relative overflow-hidden">
                        {/* Faint Horizontal Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-[0.03]">
                          <div className="border-t border-white w-full"></div>
                          <div className="border-t border-white w-full"></div>
                          <div className="border-t border-white w-full"></div>
                          <div className="border-t border-white w-full"></div>
                        </div>
                        {/* Vertical Grid */}
                        <div className="absolute inset-0 grid grid-cols-6 h-full w-full opacity-[0.03]">
                          <div className="border-r border-white"></div>
                          <div className="border-r border-white"></div>
                          <div className="border-r border-white"></div>
                          <div className="border-r border-white"></div>
                          <div className="border-r border-white"></div>
                        </div>
                        <svg className="absolute bottom-0 w-full h-[85%]" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <defs>
                            <linearGradient id="gradient-flow-v3" x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="#5E6BFF" stopOpacity="0.2"></stop>
                              <stop offset="100%" stopColor="#5E6BFF" stopOpacity="0"></stop>
                            </linearGradient>
                            <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                              <feGaussianBlur result="blur" stdDeviation="1"></feGaussianBlur>
                              <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                            </filter>
                          </defs>
                          <path d="M0,80 C20,78 35,85 50,65 C65,45 80,30 100,25 L100,100 L0,100 Z" fill="url(#gradient-flow-v3)"></path>
                          <path d="M0,80 C20,78 35,85 50,65 C65,45 80,30 100,25" fill="none" filter="url(#glow)" stroke="#5E6BFF" strokeLinecap="round" strokeWidth="0.75"></path>
                          <circle cx="20" cy="78" fill="#5E6BFF" r="1.5"></circle>
                          <circle cx="50" cy="65" fill="white" r="2" stroke="#5E6BFF" stroke-width="1"></circle>
                          <circle cx="80" cy="30" fill="#5E6BFF" r="1.5"></circle>
                        </svg>
                        <div className="absolute bottom-2 right-3 font-mono-data text-[9px] text-custom-text-muted/40 uppercase">t: 100.2s</div>
                        <div className="absolute top-3 left-3 font-mono-data text-[9px] text-custom-text-muted/40 uppercase">y: Signals</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow">
                        <div className="text-body-md font-bold text-on-surface border-b border-white/[0.05] pb-4 mb-4">Focus queue</div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-body-md">
                            <span className="text-on-surface">Resolve Hostel Water Leakage</span>
                            <span className="text-tertiary bg-tertiary/10 px-2.5 py-1 rounded text-[11px] font-bold tracking-wider">URGENT</span>
                          </div>
                          <div className="flex justify-between items-center text-body-md">
                            <span className="text-on-surface">Approve Lab AC Replacement</span>
                            <span className="text-custom-text-muted text-[11px] font-medium tracking-wider">TODAY</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#121315] border border-white/[0.05] rounded-2xl p-6 inner-glow">
                        <div className="text-body-md font-bold text-on-surface border-b border-white/[0.05] pb-4 mb-4">Resolution pipeline</div>
                        <div className="space-y-4 pt-2">
                          <div className="h-2 bg-white/[0.04] rounded-full w-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-3/4"></div>
                          </div>
                          <div className="text-label-sm text-custom-text-muted flex justify-between items-center">
                            <span className="font-medium">75% resolved this week</span>
                            <span className="text-primary font-bold">12/16</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. Render Live Signals Mock View */}
                {activeMockTab === 'Live Signals' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">Live Telemetry Signals</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Real-time anomaly stream from IoT and student reports</p>
                      </div>
                      <span className="font-mono bg-secondary/15 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-[11px] animate-pulse">STREAM ACTIVE</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow">
                        <span className="text-[10px] text-custom-text-muted font-bold tracking-wider uppercase block mb-1">NOISE LOGS</span>
                        <span className="text-[20px] font-bold text-white font-mono-data">324 p/m</span>
                      </div>
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow">
                        <span className="text-[10px] text-custom-text-muted font-bold tracking-wider uppercase block mb-1">DETECTION CONFIDENCE</span>
                        <span className="text-[20px] font-bold text-secondary font-mono-data">94.8%</span>
                      </div>
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow">
                        <span className="text-[10px] text-custom-text-muted font-bold tracking-wider uppercase block mb-1">ACTIVE CHANNELS</span>
                        <span className="text-[20px] font-bold text-primary font-mono-data">12 / 12</span>
                      </div>
                    </div>

                    <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-6 inner-glow flex-1">
                      <h4 className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider mb-4">Real-Time Event Stream</h4>
                      <div className="space-y-3 font-mono-data text-[12px]">
                        <div className="flex gap-4 text-error bg-error/5 p-2 rounded border border-error/10">
                          <span className="text-custom-text-muted">19:42:01</span>
                          <span className="font-bold">[ANOMALY]</span>
                          <span>PRESSURE DROP: HOSTEL B PLUMBING LINE (92% Conf.)</span>
                        </div>
                        <div className="flex gap-4 text-secondary bg-secondary/5 p-2 rounded border border-secondary/10">
                          <span className="text-custom-text-muted">19:39:15</span>
                          <span className="font-bold">[ROUTING]</span>
                          <span>ROUTED TICKET #2847 TO ELECTRICAL DIVISION</span>
                        </div>
                        <div className="flex gap-4 text-custom-text-muted bg-white/[0.01] p-2 rounded">
                          <span className="text-custom-text-muted">19:35:42</span>
                          <span className="font-bold">[TELEMETRY]</span>
                          <span>ROUTINE CHECK: AC TEMPERATURE CONTROL STABLE</span>
                        </div>
                        <div className="flex gap-4 text-custom-text-muted bg-white/[0.01] p-2 rounded">
                          <span className="text-custom-text-muted">19:31:10</span>
                          <span className="font-bold">[TELEMETRY]</span>
                          <span>BANDWIDTH TRAFFIC IN LIBRARY STABLE (240 Mbps)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Render AI Resolutions Mock View */}
                {activeMockTab === 'AI Resolutions' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">AI Automated Resolutions</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Action plans generated from Retrieval-Augmented Generation (RAG)</p>
                      </div>
                      <span className="font-mono bg-primary/15 text-primary border border-primary/20 px-3 py-1 rounded-full text-[11px]">RAG ACTIVE</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] text-custom-text-muted font-bold font-mono">CASE #88492 // resolved</span>
                            <h4 className="text-[15px] font-bold text-white mt-1">Water Supply Failure in Hostel Block B</h4>
                          </div>
                          <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">SOP 23B Triggered</span>
                        </div>
                        <p className="text-[13px] text-custom-text-muted leading-relaxed">
                          AI successfully indexed SOP 23B (Utility Failure Protocols). Generated a 5-step action plan, dispatched work orders, and notified the maintenance admin.
                        </p>
                      </div>

                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] text-custom-text-muted font-bold font-mono">CASE #88491 // resolved</span>
                            <h4 className="text-[15px] font-bold text-white mt-1">Wi-Fi Interruption in Science Block</h4>
                          </div>
                          <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">SOP 12 Triggered</span>
                        </div>
                        <p className="text-[13px] text-custom-text-muted leading-relaxed">
                          RAG fetched "IT Network Reset SOP". Automatically initiated router reset script and successfully resolved channel conflict, restoring bandwidth.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Render Analytics Mock View */}
                {activeMockTab === 'Analytics' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">System Analytics</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Operational distribution and priority breakdown telemetry</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[400px]">
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow flex flex-col justify-between min-h-[220px]">
                        <span className="text-[11px] text-custom-text-muted font-bold uppercase tracking-wider block mb-4">Issues by Category</span>
                        <div className="flex-1 flex items-end gap-3 h-full pb-4 min-h-[120px]">
                          <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[80%] relative group cursor-pointer transition-colors">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white">80</span>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-custom-text-muted uppercase">Elec</span>
                          </div>
                          <div className="flex-1 bg-secondary/20 hover:bg-secondary/40 rounded-t h-[45%] relative group cursor-pointer transition-colors">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white">45</span>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-custom-text-muted uppercase">Plum</span>
                          </div>
                          <div className="flex-1 bg-tertiary/20 hover:bg-tertiary/40 rounded-t h-[60%] relative group cursor-pointer transition-colors">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white">60</span>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-custom-text-muted uppercase">Net</span>
                          </div>
                          <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-[30%] relative group cursor-pointer transition-colors">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white">30</span>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-custom-text-muted uppercase">Clean</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow flex flex-col justify-between min-h-[220px]">
                        <span className="text-[11px] text-custom-text-muted font-bold uppercase tracking-wider block mb-4">Average Resolution Time</span>
                        <div className="flex-1 flex flex-col justify-center gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-custom-text-muted">High Priority</span>
                              <span className="text-white font-bold">1.2 hours</span>
                            </div>
                            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className="h-full bg-error rounded-full" style={{ width: '90%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-custom-text-muted">Medium Priority</span>
                              <span className="text-white font-bold">4.8 hours</span>
                            </div>
                            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className="h-full bg-tertiary rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-custom-text-muted">Low Priority</span>
                              <span className="text-white font-bold">12.4 hours</span>
                            </div>
                            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Render Heatmap Mock View */}
                {activeMockTab === 'Campus Heatmap' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">Campus Problem Heatmap</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Spatial breakdown of active reports across campus blocks</p>
                      </div>
                    </div>

                    <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-6 inner-glow flex-1 flex flex-col justify-center items-center min-h-[400px] relative overflow-hidden">
                      <div className="absolute inset-0 dot-pattern opacity-40"></div>
                      
                      <div className="relative w-full max-w-sm aspect-square border border-white/[0.05] bg-[#070708]/80 rounded-2xl p-6 flex items-center justify-center">
                        <div className="w-[85%] h-[85%] relative border border-white/[0.03] rounded flex items-center justify-center text-[11px] font-mono-data text-custom-text-muted/40">
                          CAMPUS BASE MAP GRID
                          
                          {/* Main Hostel Block */}
                          <div className="absolute top-6 left-6 w-24 h-16 border border-white/[0.08] bg-white/[0.02] rounded flex flex-col items-center justify-center p-2">
                            <span className="text-white font-bold text-[8px]">HOSTELS</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-error text-error text-[8px] font-bold flex items-center justify-center animate-ping mt-1"></span>
                          </div>

                          {/* Academic Block */}
                          <div className="absolute top-6 right-6 w-28 h-20 border border-white/[0.08] bg-white/[0.02] rounded flex flex-col items-center justify-center p-2">
                            <span className="text-white font-bold text-[8px]">ACADEMICS</span>
                            <span className="w-2 h-2 rounded-full bg-secondary mt-1"></span>
                          </div>

                          {/* Library Block */}
                          <div className="absolute bottom-8 left-10 w-20 h-20 border border-white/[0.08] bg-white/[0.02] rounded flex flex-col items-center justify-center p-2">
                            <span className="text-white font-bold text-[8px]">LIBRARY</span>
                            <span className="w-2 h-2 rounded-full bg-secondary mt-1 animate-pulse"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Render Admins Mock View */}
                {activeMockTab === 'Admins' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">Department Administrations</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Key routing dispatchers for campus resolutions</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1b1c1e] border border-white/10 flex items-center justify-center text-[18px]">🔧</div>
                        <div>
                          <h4 className="text-[15px] font-bold text-white">Facilities & Utilities Division</h4>
                          <p className="text-[12px] text-custom-text-muted mt-0.5">Admin: admin.facilities@smartcampus.edu</p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded">Primary Dispatch</span>
                        </div>
                      </div>

                      <div className="bg-[#121315] border border-white/[0.05] rounded-xl p-5 inner-glow flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1b1c1e] border border-white/10 flex items-center justify-center text-[18px]">💻</div>
                        <div>
                          <h4 className="text-[15px] font-bold text-white">IT & Network Infrastructure</h4>
                          <p className="text-[12px] text-custom-text-muted mt-0.5">Admin: admin.network@smartcampus.edu</p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold rounded">Active Routing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Render Leaderboard Mock View */}
                {activeMockTab === 'Leaderboard' && (
                  <div className="flex flex-col gap-6 w-full text-[#e5e2e3]">
                    <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                      <div>
                        <h3 className="text-[18px] font-bold text-white">Active Student Leaderboard</h3>
                        <p className="text-[12px] text-custom-text-muted mt-1">Student contributions and gamified resolution points rankings</p>
                      </div>
                    </div>

                    <div className="bg-[#121315] border border-white/[0.05] rounded-xl overflow-hidden inner-glow">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/[0.05] text-[10px] text-custom-text-muted font-bold uppercase tracking-wider bg-black/10">
                            <th className="py-3.5 px-4">Rank</th>
                            <th className="py-3.5 px-4">Student Name</th>
                            <th className="py-3.5 px-4">Branch</th>
                            <th className="py-3.5 px-4">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-[13px]">
                          <tr>
                            <td className="py-4 px-4 font-mono-data text-secondary font-bold">#1</td>
                            <td className="py-4 px-4 font-semibold text-white">John Doe</td>
                            <td className="py-4 px-4 text-custom-text-muted">CSE (2023)</td>
                            <td className="py-4 px-4 font-mono-data text-primary font-bold">1,420 pts</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 font-mono-data text-secondary font-bold">#2</td>
                            <td className="py-4 px-4 font-semibold text-white">Sarah Connor</td>
                            <td className="py-4 px-4 text-custom-text-muted">ECE (2024)</td>
                            <td className="py-4 px-4 font-mono-data text-primary font-bold">1,210 pts</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 font-mono-data text-secondary font-bold">#3</td>
                            <td className="py-4 px-4 font-semibold text-white">Bruce Wayne</td>
                            <td className="py-4 px-4 text-custom-text-muted">ME (2023)</td>
                            <td className="py-4 px-4 font-mono-data text-primary font-bold">950 pts</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel */}
              <div className="w-full md:w-[380px] bg-[#0d0e0f] border-t md:border-t-0 md:border-l border-white/[0.05] p-6 md:p-8 flex flex-col gap-6 md:gap-8 relative z-10 shadow-none md:shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                <div className="text-[14px] font-bold text-on-surface border-b border-white/[0.05] pb-6 mb-2 flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
                    </div>
                    SmartCampus AI
                  </div>
                  <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#50d8e9] animate-pulse"></span>
                </div>
                <div className="flex flex-col gap-10 px-1">
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold text-custom-text-muted uppercase tracking-widest opacity-60">Recommended Action</div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 text-body-md text-on-surface leading-relaxed shadow-sm">
                      Dispatch maintenance crew to <span className="text-primary font-bold">Hostel Block B</span> to inspect water pipeline failure immediately.
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold text-custom-text-muted uppercase tracking-widest opacity-60">Signal summary</div>
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 text-body-md text-on-surface leading-relaxed shadow-sm">
                      Utility complaints are trending <span className="text-secondary font-medium">high (+15%)</span> in student hostels.
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="text-[11px] font-bold text-custom-text-muted uppercase tracking-widest opacity-60">Decision log</div>
                    <div className="space-y-3 overflow-y-auto pr-2">
                      <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.02] rounded-xl transition-colors border border-transparent hover:border-white/[0.05]">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_8px_#bec2ff]"></div>
                        <div>
                          <div className="text-[13px] text-on-surface font-semibold mb-1">RAG Plan Triggered</div>
                          <div className="text-[12px] text-custom-text-muted opacity-80">2h ago • System AI</div>
                        </div>
                      </div>
                      <div className="group flex items-start gap-4 p-3 hover:bg-white/[0.02] rounded-xl transition-colors border border-transparent hover:border-white/[0.05]">
                        <div className="w-2 h-2 rounded-full bg-white/20 mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="text-[13px] text-on-surface opacity-80 font-medium mb-1">Hostel B Ticket Routed</div>
                          <div className="text-[12px] text-custom-text-muted opacity-80">5h ago • Help Desk</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Recommendation Card */}
                <div className="mt-auto relative w-full bg-[#16171a]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl z-20 inner-glow">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-tertiary/15 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-tertiary font-bold">priority_high</span>
                      </div>
                      <span className="text-[14px] font-bold text-on-surface tracking-tight">Critical Alert</span>
                    </div>
                    <span className="text-[10px] text-tertiary/80 uppercase font-bold tracking-widest bg-tertiary/10 px-2 py-1 rounded">High priority</span>
                  </div>
                  <div className="text-body-md text-on-surface/90 mb-6 leading-relaxed font-medium">
                    Hostel Block B water leakage risks structural and electrical outages. Requires immediate sign-off.
                  </div>
                  <Link to="/login" className="w-full bg-primary text-[#000469] py-3.5 rounded-xl text-[14px] font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all hover:scale-[1.02] flex justify-center items-center">
                    Review Submission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Product Principle */}
        <section className="px-margin-safe flex flex-col justify-center items-center relative overflow-hidden py-16 md:py-32 border-t border-white/[0.05]">
          <div className="max-w-[1516px] w-full mx-auto">
            <h2 className="font-h2 text-[32px] sm:text-[44px] md:text-[56px] leading-[1.1] text-center text-on-surface mb-12 md:mb-32 max-w-4xl mx-auto tracking-tight">AI architecture. Structured campus response.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
              
              {/* Card 1 */}
              <div className="border border-white/[0.05] rounded-3xl p-8 bg-[#0a0a0b] relative h-auto min-h-[380px] md:h-[480px] flex flex-col transition-transform hover:-translate-y-2 duration-300">
                <div className="font-mono-data text-custom-text-muted mb-8 text-[11px] tracking-widest">FIG 0.1 / AI CLASSIFICATION</div>
                <div className="flex-1 border border-white/[0.03] rounded-2xl bg-[#0d0e0f] flex items-center justify-center p-6">
                  <div className="w-full h-full dot-pattern flex items-center justify-center relative">
                    <svg className="w-[80%] h-[80%]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="20" width="160" height="160" rx="4" stroke="#232426" strokeWidth="0.5"></rect>
                      <line x1="60" y1="20" x2="60" y2="180" stroke="#232426" strokeWidth="0.5"></line>
                      <rect x="70" y="30" width="100" height="40" rx="2" stroke="#5E6BFF" strokeWidth="0.75"></rect>
                      <rect x="70" y="80" width="100" height="90" rx="2" stroke="#232426" strokeWidth="0.5"></rect>
                      <text x="75" y="45" fill="#454655" fontFamily="monospace" fontSize="6">CLASSIFIER_AI</text>
                      <text x="75" y="95" fill="#454655" fontFamily="monospace" fontSize="6">RAG_CONTEXT</text>
                      <text x="25" y="30" fill="#454655" fontFamily="monospace" fontSize="5">NODE_01</text>
                    </svg>
                    <div className="absolute bottom-4 right-4 font-mono-data text-[9px] text-custom-text-muted opacity-40">COORD: 34.22 // 11.08</div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-white/[0.05] rounded-3xl p-8 bg-[#0a0a0b] relative h-auto min-h-[380px] md:h-[480px] flex flex-col transition-transform hover:-translate-y-2 duration-300">
                <div className="font-mono-data text-custom-text-muted mb-8 text-[11px] tracking-widest">FIG 0.2 / KNOWLEDGE GRAPH</div>
                <div className="flex-1 border border-white/[0.03] rounded-2xl bg-[#0d0e0f] flex items-center justify-center p-6">
                  <div className="w-full h-full dot-pattern flex items-center justify-center relative">
                    <svg className="w-[80%] h-[80%]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="40" stroke="#50d8e9" strokeWidth="0.5"></circle>
                      <circle cx="40" cy="40" r="8" stroke="#232426" strokeWidth="0.5"></circle>
                      <circle cx="160" cy="40" r="8" stroke="#232426" stroke-width="0.5"></circle>
                      <circle cx="160" cy="160" r="8" stroke="#232426" stroke-width="0.5"></circle>
                      <circle cx="40" cy="160" r="8" stroke="#232426" stroke-width="0.5"></circle>
                      <line x1="47" y1="47" x2="71" y2="71" stroke="#454655" strokeDasharray="2 2" strokeWidth="0.5"></line>
                      <line x1="153" y1="47" x2="129" y2="71" stroke="#454655" strokeDasharray="2 2" strokeWidth="0.5"></line>
                      <line x1="153" y1="153" x2="129" y2="129" stroke="#454655" strokeDasharray="2 2" strokeWidth="0.5"></line>
                      <line x1="47" y1="153" x2="71" y2="129" stroke="#454655" strokeDasharray="2 2" strokeWidth="0.5"></line>
                      <rect x="70" y="70" width="2" height="2" fill="#50d8e9"></rect>
                      <rect x="128" y="70" width="2" height="2" fill="#50d8e9"></rect>
                      <rect x="128" y="128" width="2" height="2" fill="#50d8e9"></rect>
                      <rect x="70" y="128" width="2" height="2" fill="#50d8e9"></rect>
                      <text x="90" y="103" fill="#454655" fontFamily="monospace" fontSize="6">RAG_SOP_V2</text>
                      <text x="40" y="30" fill="#454655" fontFamily="monospace" fontSize="5">SOP_01</text>
                      <text x="155" y="30" fill="#454655" fontFamily="monospace" fontSize="5">SOP_02</text>
                    </svg>
                    <div className="absolute top-4 left-4 font-mono-data text-[9px] text-custom-text-muted opacity-40">REL_MAP: SYNC</div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-white/[0.05] rounded-3xl p-8 bg-[#0a0a0b] relative h-auto min-h-[380px] md:h-[480px] flex flex-col transition-transform hover:-translate-y-2 duration-300">
                <div className="font-mono-data text-custom-text-muted mb-8 text-[11px] tracking-widest">FIG 0.3 / DISPATCH CYCLES</div>
                <div className="flex-1 border border-white/[0.03] rounded-2xl bg-[#0d0e0f] flex items-center justify-center p-6">
                  <div className="w-full h-full dot-pattern flex items-center justify-center relative">
                    <svg className="w-[80%] h-[80%]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20,100 Q60,20 100,100 T180,100" fill="none" stroke="#E5FD17" strokeWidth="0.75"></path>
                      <line x1="100" y1="20" x2="100" y2="180" stroke="#454655" strokeDasharray="2 2" strokeWidth="0.5"></line>
                      <circle cx="100" cy="100" r="3" fill="#E5FD17"></circle>
                      <text x="185" y="105" fill="#454655" fontFamily="monospace" fontSize="8">t</text>
                      <text x="105" y="25" fill="#454655" fontFamily="monospace" fontSize="8">v</text>
                      <text x="108" y="98" fill="#E5FD17" fontFamily="monospace" fontSize="6">[100, 100]</text>
                      <text x="108" y="106" fill="#454655" fontFamily="monospace" fontSize="5">DISPATCH_CYC</text>
                    </svg>
                    <div className="absolute bottom-4 right-4 font-mono-data text-[9px] text-custom-text-muted opacity-40">FREQ: 440HZ // AMPL: 1.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Signal Intelligence */}
        <section className="px-margin-safe border-t border-white/[0.05] flex items-center relative py-16 md:py-40">
          <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center">
            <div className="pr-0 md:pr-12">
              <h2 className="font-h2 text-[32px] sm:text-[44px] md:text-[56px] leading-[1.1] text-on-surface mb-6 md:mb-10 tracking-tight">Turn signals into resolutions</h2>
              <p className="font-body-lg text-[16px] sm:text-[18px] md:text-[22px] text-custom-text-muted leading-relaxed">
                Aggregate noisy complaints across campus portals into a single, structured signal stream. SmartCampus AI identifies anomalies, predicts priority levels, and executes standard operating procedures.
              </p>
            </div>
            <div className="relative h-[400px] sm:h-[500px] md:h-[680px] w-full">
              {/* Background Mockup */}
              <div className="absolute inset-0 bg-[#0a0a0b] border border-white/[0.05] rounded-3xl overflow-hidden p-6 md:p-12">
                <div className="text-mono-data text-custom-text-muted mb-6 border-b border-white/[0.05] pb-4 tracking-widest text-[11px] uppercase">Campus Pulse</div>
                <div className="space-y-2 mb-12">
                  <div className="flex justify-between text-[15px] text-on-surface py-4 border-b border-white/[0.03]"><span className="w-1/3 font-medium">Hostel Block B</span><span className="w-1/3 text-custom-text-muted">Water Leakage</span><span className="w-1/3 text-right text-[#ffb4ab] font-medium">High</span></div>
                  <div className="flex justify-between text-[15px] text-on-surface py-4 border-b border-white/[0.03]"><span className="w-1/3 font-medium">Main Library</span><span className="w-1/3 text-custom-text-muted">Wi-Fi Down</span><span className="w-1/3 text-right text-[#50d8e9] font-medium">Low</span></div>
                </div>
                <div className="text-mono-data text-custom-text-muted mb-6 border-b border-white/[0.05] pb-4 mt-12 tracking-widest text-[11px] uppercase">Telemetry</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[15px] text-on-surface py-4 border-b border-white/[0.03]"><span className="w-1/3 font-medium">AI Accuracy</span><span className="w-1/3 text-custom-text-muted">Pacing</span><span className="w-1/3 text-right text-[#E5FD17] font-medium">95%</span></div>
                </div>
              </div>
              {/* Foreground Card */}
              <div className="absolute left-4 md:-left-16 top-[40%] md:top-1/4 w-[calc(100%-2rem)] sm:w-[360px] md:w-[400px] bg-[#16171a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-10 inner-glow">
                <div className="text-[14px] font-bold text-on-surface mb-6 flex items-center gap-3 border-b border-white/[0.05] pb-4"><span className="material-symbols-outlined text-[20px] text-primary">forum</span> Resolution Thread</div>
                <div className="text-[16px] text-on-surface/90 leading-relaxed mb-8">Water pipeline pressure drop in Hostel Block B. Recommended immediate repair crew dispatch.</div>
                <div className="flex gap-4">
                  <Link to="/login" className="flex-1 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] text-on-surface px-4 py-3 rounded-xl text-[14px] font-medium transition-colors flex justify-center items-center">Assign</Link>
                  <Link to="/login" className="flex-1 bg-primary text-[#000469] px-4 py-3 rounded-xl text-[14px] font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex justify-center items-center">Acknowledge</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Decision Command Center */}
        <section className="px-margin-safe border-t border-white/[0.05] flex items-center relative py-16 md:py-40">
          <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center">
            <div className="relative h-[400px] sm:h-[500px] md:h-[680px] w-full order-2 md:order-1">
              {/* Background Mockup */}
              <div className="absolute inset-0 bg-[#0a0a0b] border border-white/[0.05] rounded-3xl overflow-hidden p-6 md:p-12">
                <div className="flex justify-between text-mono-data text-custom-text-muted mb-12 border-b border-white/[0.05] pb-6 tracking-widest text-[11px] uppercase px-4">
                  <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span>
                </div>
                <div className="relative h-full px-4">
                  <div className="absolute top-8 left-[10%] w-[40%] h-12 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center px-4 text-[14px] text-on-surface font-medium hover:bg-white/[0.05] transition-colors cursor-pointer">Hostel Audit</div>
                  <div className="absolute top-28 left-[30%] w-[50%] h-12 bg-white/[0.03] rounded-xl border border-white/[0.05] flex items-center px-4 text-[14px] text-on-surface font-medium hover:bg-white/[0.05] transition-colors cursor-pointer">AC Inspections</div>
                  {/* Timeline markers */}
                  <div className="absolute top-0 left-[25%] w-px h-full bg-white/[0.03]"></div>
                  <div className="absolute top-0 left-[50%] w-px h-full bg-white/[0.03]"></div>
                  <div className="absolute top-0 left-[75%] w-px h-full bg-white/[0.03]"></div>
                </div>
              </div>
              {/* Foreground Card */}
              <div className="absolute right-4 md:-right-16 bottom-[10%] md:bottom-1/4 w-[calc(100%-2rem)] sm:w-[360px] md:w-[400px] bg-[#16171a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-10 inner-glow">
                <div className="text-[14px] font-bold text-on-surface mb-6 flex items-center gap-3 border-b border-white/[0.05] pb-4"><span className="material-symbols-outlined text-[20px] text-secondary">rule</span> Resolution Queue</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[15px] border-b border-white/[0.03] py-3"><span className="text-on-surface font-medium">Block B Plumbing</span> <Link to="/login" className="text-primary font-semibold text-[13px] hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg">Sign</Link></div>
                  <div className="flex justify-between items-center text-[15px] py-3"><span className="text-on-surface font-medium">IT Router Replacement</span> <Link to="/login" className="text-primary font-semibold text-[13px] hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-lg">Sign</Link></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 pl-0 md:pl-12">
              <h2 className="font-h2 text-[32px] sm:text-[44px] md:text-[56px] leading-[1.1] text-on-surface mb-6 md:mb-10 tracking-tight">Dispatch every resolution quickly</h2>
              <p className="font-body-lg text-[16px] sm:text-[18px] md:text-[22px] text-custom-text-muted leading-relaxed">
                Map critical infrastructure tickets against campus availability timelines. Keep the administration workflow unblocked with clear department ownership and contextual SOP routing.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Insights Timeline */}
        <section className="px-margin-safe border-t border-white/[0.05] flex flex-col justify-center relative overflow-hidden py-16 md:py-40">
          <div className="max-w-[1516px] w-full mx-auto relative pt-12">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/[0.05] -z-10 mt-[-24px]"></div>
            <div className="block md:hidden absolute left-1/2 top-16 bottom-16 w-px bg-white/[0.05] -z-10 ml-[-1px]"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
              {/* Node 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-5 h-5 rounded-full bg-primary mb-6 md:mb-12 relative z-10 shadow-[0_0_20px_#bec2ff] border-4 border-[#070708]"></div>
                <h3 className="font-h4 text-[20px] text-on-surface mb-4">AI Classifications</h3>
                <p className="font-body-md text-[16px] text-custom-text-muted max-w-[280px]">Predict issues and categorize incoming tickets automatically.</p>
              </div>
              {/* Node 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-4 h-4 rounded-full bg-[#1c1b1d] border-2 border-white/20 mb-6 md:mb-12 mt-0.5 relative z-10"></div>
                <h3 className="font-h4 text-[20px] text-on-surface mb-4">Priority Predictors</h3>
                <p className="font-body-md text-[16px] text-custom-text-muted max-w-[280px]">Predict risk levels to resolve urgent matters first.</p>
              </div>
              {/* Node 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-4 h-4 rounded-full bg-[#1c1b1d] border-2 border-white/20 mb-6 md:mb-12 mt-0.5 relative z-10"></div>
                <h3 className="font-h4 text-[20px] text-on-surface mb-4">RAG Action Plans</h3>
                <p className="font-body-md text-[16px] text-custom-text-muted max-w-[280px]">Retrieve standard protocols instantly for administrators.</p>
              </div>
              {/* Node 4 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-4 h-4 rounded-full bg-[#1c1b1d] border-2 border-white/20 mb-6 md:mb-12 mt-0.5 relative z-10"></div>
                <h3 className="font-h4 text-[20px] text-on-surface mb-4">Smart Dispatching</h3>
                <p className="font-body-md text-[16px] text-custom-text-muted max-w-[280px]">Route tickets instantly to correct department maintenance staff.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Customer Quotes */}
        <section className="px-margin-safe border-t border-white/[0.05] flex items-center py-16 md:py-40 bg-[#070708]">
          <div className="max-w-[1516px] w-full mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12">
            {/* Left Quote */}
            <div className="col-span-1 md:col-span-3 bg-[#D1EBEB] rounded-[32px] p-8 md:p-16 flex flex-col justify-between h-auto min-h-[320px] md:h-[560px]">
              <p className="font-h2 text-[28px] sm:text-[36px] md:text-[48px] text-black leading-[1.1] max-w-2xl tracking-tight">
                "SmartCampus AI completely transformed our campus operations. The response pipeline is faster and students feel heard."
              </p>
            </div>
            {/* Right Quote */}
            <div className="col-span-1 md:col-span-2 bg-[#C4FF44] rounded-[32px] p-8 md:p-16 flex flex-col justify-between h-auto min-h-[260px] md:h-[560px]">
              <p className="font-h3 text-[22px] sm:text-[28px] md:text-[36px] text-black leading-[1.1] tracking-tight">
                "It replaced manual spreadsheet tracking, endless status meetings, and phone calls."
              </p>
            </div>
          </div>
        </section>

        {/* 9. Final CTA */}
        <section className="px-margin-safe border-t border-white/[0.05] flex flex-col justify-center items-center text-center py-24 md:py-48">
          <div className="max-w-3xl">
            <h2 className="font-h1 text-[36px] sm:text-[54px] md:text-[72px] leading-[1.05] tracking-tight text-on-surface mb-8 md:mb-16">Built for smart campuses.<br/>Ready today.</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-[280px] sm:max-w-none mx-auto w-full">
              <Link to="/signup" className="w-full sm:w-auto text-center bg-white text-black px-10 py-4 rounded-full font-body-lg font-medium shadow-sm hover:scale-105 transition-transform text-[18px]">Get started free</Link>
              <Link to="/login" className="w-full sm:w-auto text-center bg-transparent border border-white/[0.1] text-on-surface px-10 py-4 rounded-full font-body-lg hover:bg-white/5 transition-colors text-[18px]">Admin panel</Link>
            </div>
          </div>
        </section>

        {/* 10. Footer */}
        <footer className="bg-[#0a0a0b] border-t border-white/[0.05] flex flex-col justify-between px-6 md:px-margin-safe pt-16 md:pt-32 pb-16">
          <div className="max-w-[1728px] w-full mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-16 mb-16 md:mb-24">
            <div className="col-span-2 pr-0 md:pr-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-on-surface font-h3 font-bold text-[14px]">S</div>
                <span className="font-h3 text-[24px] font-bold text-on-surface tracking-tight">SmartCampus</span>
              </div>
              <p className="text-body-lg text-custom-text-muted max-w-sm">The intelligent operating layer for focused administration teams.</p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="font-mono-data text-on-surface font-medium mb-2 text-[12px] tracking-widest uppercase">PLATFORM</div>
              <button onClick={() => handleMockNavClick('Overview')} className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors text-left">Dashboard</button>
              <button onClick={() => handleMockNavClick('Campus Heatmap')} className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors text-left">Heatmap</button>
              <button onClick={() => handleMockNavClick('Leaderboard')} className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors text-left">Leaderboard</button>
            </div>
            <div className="flex flex-col gap-5">
              <div className="font-mono-data text-on-surface font-medium mb-2 text-[12px] tracking-widest uppercase">RESOURCES</div>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/sop-index">SOP Index</Link>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/ai-api">AI Engine API</Link>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/status-reports">Status Reports</Link>
            </div>
            <div className="flex flex-col gap-5">
              <div className="font-mono-data text-on-surface font-medium mb-2 text-[12px] tracking-widest uppercase">AUTH</div>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/login">Login</Link>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/signup">Get Started</Link>
            </div>
            <div className="flex flex-col gap-5">
              <div className="font-mono-data text-on-surface font-medium mb-2 text-[12px] tracking-widest uppercase">CAMPUS</div>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/admins">Admins</Link>
              <Link className="font-body-md text-[15px] text-custom-text-muted hover:text-white transition-colors" to="/student-hub">Student Hub</Link>
            </div>
          </div>
          <div className="max-w-[1728px] w-full mx-auto flex flex-col sm:flex-row gap-6 justify-between items-center border-t border-white/[0.05] pt-12 mt-auto text-center sm:text-left">
            <div className="font-mono-data text-custom-text-muted text-[13px]">© 2026 SmartCampus. All rights reserved.</div>
            <div className="flex gap-8">
              <Link className="font-mono-data text-custom-text-muted text-[13px] hover:text-white transition-colors" to="/privacy-policy">Privacy Policy</Link>
              <Link className="font-mono-data text-custom-text-muted text-[13px] hover:text-white transition-colors" to="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

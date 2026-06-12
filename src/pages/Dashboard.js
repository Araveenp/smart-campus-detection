import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getComplaints } from '../services/aiEngine';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Filler
} from 'chart.js';
import { FiAlertCircle, FiCheckCircle, FiClock, FiTrendingUp, FiPlus, FiArrowRight, FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints().then(data => setComplaints(data));
  }, []);

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    highPriority: complaints.filter(c => c.priority === 'High').length
  };

  // Category Distribution
  const categoryData = () => {
    const cats = {};
    complaints.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
    return {
      labels: Object.keys(cats),
      datasets: [{
        data: Object.values(cats),
        backgroundColor: ['#5E6BFF', '#50d8e9', '#E5FD17', '#ffb689', '#00b1c2', '#bec2ff', '#e0e0ff', '#ffdbc8', '#ffb4ab', '#8f8fa1'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    };
  };

  // Priority Distribution
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [
        complaints.filter(c => c.priority === 'High').length,
        complaints.filter(c => c.priority === 'Medium').length,
        complaints.filter(c => c.priority === 'Low').length
      ],
      backgroundColor: ['#ffb4ab', '#ffb689', '#50d8e9'],
      borderWidth: 0
    }]
  };

  // Weekly Trend
  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Complaints',
      data: [3, 5, 2, 8, 4, 1, 2],
      borderColor: '#5E6BFF',
      backgroundColor: 'rgba(94, 107, 255, 0.05)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#5E6BFF',
      pointBorderColor: '#070708',
      pointBorderWidth: 2,
      pointRadius: 4
    }]
  };

  // Category Bar Chart
  const barData = () => {
    const cats = {};
    complaints.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
    return {
      labels: Object.keys(cats),
      datasets: [{
        label: 'Complaints',
        data: Object.values(cats),
        backgroundColor: 'rgba(94, 107, 255, 0.85)',
        borderRadius: 8,
        barThickness: 20
      }]
    };
  };

  const recentComplaints = complaints.slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#9A9DA3', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#9A9DA3', font: { family: 'Inter', size: 11 }, precision: 0 }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9A9DA3',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Inter', size: 11 }
        }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-8 bg-transparent dark:bg-[#070708]/40 rounded-2xl min-h-screen text-slate-800 dark:text-[#e5e2e3]">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-white/[0.05] pb-6">
        <div>
          <motion.h1 
            className="text-[28px] font-h3 font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user?.name?.split(' ')[0]}!
            </span>{' '}
            👋
          </motion.h1>
          <p className="text-body-md text-custom-text-muted mt-1">
            Campus problem detection and automation dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/submit-complaint" 
            className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-full font-body-md font-bold transition-all hover:scale-[1.02] flex items-center gap-2 shadow-sm"
          >
            <FiPlus className="stroke-[3]" />
            New Complaint
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Complaints', value: stats.total, icon: <FiTrendingUp />, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'Open Issues', value: stats.open, icon: <FiAlertCircle />, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
          { label: 'In Progress', value: stats.inProgress, icon: <FiClock />, color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' },
          { label: 'Resolved Complaints', value: stats.resolved, icon: <FiCheckCircle />, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 inner-glow flex items-center gap-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 ${stat.bg} ${stat.color} border ${stat.border}`}>
              {stat.icon}
            </div>
            <div className="space-y-1">
              <span className="text-[30px] font-bold text-slate-900 dark:text-white tracking-tight leading-none block">
                {stat.value}
              </span>
              <span className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider block">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insight Banner */}
      <motion.div 
        className="bg-[#6366f1]/5 dark:bg-white/[0.02] border border-[#6366f1]/15 dark:border-white/[0.05] rounded-2xl p-5 inner-glow flex items-start md:items-center gap-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/20 text-secondary flex items-center justify-center text-[20px] flex-shrink-0 animate-pulse">
          <FiCpu />
        </div>
        <div className="text-body-md text-custom-text-muted leading-relaxed">
          <strong className="text-slate-900 dark:text-white">SmartCampus Intelligence:</strong> {stats.highPriority} high-priority issues detected. 
          {stats.open > 0 ? ` ${stats.open} complaints are awaiting immediate triage.` : ' All campus issues are currently stable.'} 
          {' '}Most reported category: <strong className="text-secondary">
            {(() => {
              const cats = {};
              complaints.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
              return Object.entries(cats).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';
            })()}
          </strong>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Distribution */}
        <div className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm flex flex-col h-[380px]">
          <h3 className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 dark:border-white/[0.03]">Category Distribution</h3>
          <div className="flex-1 relative flex items-center justify-center">
            {stats.total > 0 ? (
              <Doughnut data={categoryData()} options={doughnutOptions} />
            ) : (
              <p className="text-custom-text-muted text-body-md">No telemetry data available.</p>
            )}
          </div>
        </div>

        {/* Complaint Trend */}
        <div className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm flex flex-col h-[380px]">
          <h3 className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 dark:border-white/[0.03]">Complaint Trend (This Week)</h3>
          <div className="flex-1 relative">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm flex flex-col h-[380px]">
          <h3 className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 dark:border-white/[0.03]">Priority Breakdown</h3>
          <div className="flex-1 relative flex items-center justify-center">
            {stats.total > 0 ? (
              <Doughnut data={priorityData()} options={doughnutOptions} />
            ) : (
              <p className="text-custom-text-muted text-body-md">No telemetry data available.</p>
            )}
          </div>
        </div>

        {/* Complaints by Category */}
        <div className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm flex flex-col h-[380px]">
          <h3 className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider mb-6 pb-2 border-b border-gray-100 dark:border-white/[0.03]">Complaints by Category</h3>
          <div className="flex-1 relative">
            {stats.total > 0 ? (
              <Bar data={barData()} options={chartOptions} />
            ) : (
              <p className="text-custom-text-muted text-body-md">No telemetry data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white dark:bg-[#121315] border border-gray-100 dark:border-white/[0.05] rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/[0.03] pb-4">
          <h3 className="text-[13px] font-bold text-custom-text-muted uppercase tracking-wider">Recent Complaints</h3>
          <Link to="/complaints" className="text-[13px] font-bold text-primary hover:text-opacity-80 flex items-center gap-1 transition-colors">
            View All
            <FiArrowRight />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentComplaints.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.05] text-[11px] text-custom-text-muted font-bold uppercase tracking-wider">
                  <th className="py-4 px-3">ID</th>
                  <th className="py-4 px-3">Title</th>
                  <th className="py-4 px-3">Category</th>
                  <th className="py-4 px-3">Priority</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">AI Confidence</th>
                  <th className="py-4 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.02]">
                {recentComplaints.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-all text-body-md">
                    <td className="py-4 px-3">
                      <Link to={`/complaint/${c.id}`} className="text-primary hover:underline font-bold font-mono-data">
                        #{c.id.slice(0, 6)}
                      </Link>
                    </td>
                    <td className="py-4 px-3 font-medium text-slate-800 dark:text-white max-w-[200px] truncate">{c.title}</td>
                    <td className="py-4 px-3">
                      <span className="inline-block px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[11px] font-semibold">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        c.priority === 'High' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                        c.priority === 'Medium' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
                        'bg-green-500/10 border border-green-500/20 text-green-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.priority === 'High' ? 'bg-red-400' :
                          c.priority === 'Medium' ? 'bg-yellow-400' :
                          'bg-green-400'
                        }`}></span>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        c.status === 'Open' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                        c.status === 'In Progress' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
                        'bg-green-500/10 border border-green-500/20 text-green-400'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-100 dark:bg-white/[0.04] h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${c.confidence}%` }}></div>
                        </div>
                        <span className="font-mono-data text-[12px] font-bold text-primary">{c.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-mono-data text-custom-text-muted text-[12px]">
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-custom-text-muted">
              <span className="material-symbols-outlined text-[48px] opacity-30">inbox</span>
              <p className="mt-2 text-body-md">No recent complaints filed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

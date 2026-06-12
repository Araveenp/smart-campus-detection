import React from 'react';
import PublicLayout from '../components/PublicLayout';

const STATS = [
  { label: 'Overall Uptime', value: '99.94%', change: '+0.02% vs last week' },
  { label: 'Avg Resolution Time', value: '2.4 hrs', change: '-12 mins vs last week' },
  { label: 'Total Tickets Solved', value: '1,492', change: '+84 new this month' },
  { label: 'Active Service Outages', value: '1', change: 'Isolated to Admin Block WiFi' }
];

const SERVICES = [
  { name: 'Electrical & Power Supply', status: 'Operational', color: 'bg-green-500 shadow-green-500/50' },
  { name: 'Central Water & Plumbing', status: 'Operational', color: 'bg-green-500 shadow-green-500/50' },
  { name: 'Main Campus WiFi Access Points', status: 'Degraded Performance', color: 'bg-yellow-500 shadow-yellow-500/50', description: 'Admin block switch replacement under schedule.' },
  { name: 'RAG AI Classification Server', status: 'Operational', color: 'bg-green-500 shadow-green-500/50' },
  { name: 'Firebase RTDB Sync Sync', status: 'Operational', color: 'bg-green-500 shadow-green-500/50' }
];

const MAINTENANCE_LOGS = [
  { id: 'MAINT-8902', area: 'Admin Block WiFi', issue: 'Switchboard Hardware Fault', status: 'In Progress', eta: '1 hr', dispatch: 'IT Infrastructure team' },
  { id: 'MAINT-8894', area: 'Academic Block B', issue: 'Water Pipeline Seepage', status: 'Resolved', duration: '1.5 hrs', dispatch: 'Plumbing response' },
  { id: 'MAINT-8871', area: 'Central Lab Hall 2', issue: 'HVAC Airflow Restrictor replacement', status: 'Resolved', duration: '3 hrs', dispatch: 'Electrical dispatch' }
];

export default function StatusReports() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#50d8e9] animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Real-time Telemetry</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Status Reports</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Live status of core smart-campus facilities and incident resolution networks. Updated automatically by the SmartCampus database.
          </p>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-6 shadow-sm inner-glow">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-2">{stat.label}</span>
              <span className="text-3xl font-bold text-white block mb-2 font-mono">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.change}</span>
            </div>
          ))}
        </div>

        {/* Services Status Section */}
        <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span> Active Campus Services
          </h2>
          <div className="divide-y divide-white/[0.05]">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-white font-medium text-[16px]">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${service.color} shadow-[0_0_8px_currentColor]`}></span>
                  <span className="text-sm text-white font-medium">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Maintenance Queue */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Recent Dispatch Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-gray-500 text-[11px] font-mono tracking-widest uppercase">
                  <th className="pb-4">LOG ID</th>
                  <th className="pb-4">LOCATION</th>
                  <th className="pb-4">INCIDENT DETAILS</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">TIMELINE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[14px]">
                {MAINTENANCE_LOGS.map((log) => (
                  <tr key={log.id} className="text-gray-300">
                    <td className="py-4 font-mono font-semibold text-white">{log.id}</td>
                    <td className="py-4">{log.area}</td>
                    <td className="py-4">
                      <div>{log.issue}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{log.dispatch}</div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'Resolved' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs">
                      {log.status === 'Resolved' ? `Solved in ${log.duration}` : `ETA: ${log.eta}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

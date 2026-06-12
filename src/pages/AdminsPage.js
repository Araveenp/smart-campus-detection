import React from 'react';
import PublicLayout from '../components/PublicLayout';

const DEPARTMENTS = [
  {
    name: 'IT Infrastructure & Network Operations',
    lead: 'Dr. Evelyn Carter',
    email: 'ev.carter@smartcampus.edu',
    phone: '+1 (555) 019-3829',
    scope: 'Enterprise campus networks, server infrastructure, lab switches, SmartCampus AI integration endpoints.',
    availability: '24/7 Remote Monitoring // Field Dispatch: 08:00 AM - 08:00 PM',
    members: 6,
    avgResponse: '20 minutes'
  },
  {
    name: 'Facilities Maintenance & Civil Works',
    lead: 'Marcus Vance',
    email: 'm.vance@smartcampus.edu',
    phone: '+1 (555) 019-9941',
    scope: 'Plumbing networks, structural repairs, electrical grids, water treatment blocks, HVAC repairs.',
    availability: 'Field Dispatch: 07:00 AM - 10:00 PM // Emergency Line On-call',
    members: 14,
    avgResponse: '45 minutes'
  },
  {
    name: 'Residential Life & Hostel Services',
    lead: 'Sarah Jenkins',
    email: 's.jenkins@smartcampus.edu',
    phone: '+1 (555) 019-4820',
    scope: 'Hostel rooms maintenance audits, utility allocations, student feedback escalations.',
    availability: 'Admin Office: 09:00 AM - 05:00 PM // Warden On-duty: 24/7',
    members: 8,
    avgResponse: '60 minutes'
  },
  {
    name: 'Campus Security & Tactical Safety',
    lead: 'Chief Robert Karr',
    email: 'r.karr@smartcampus.edu',
    phone: '+1 (555) 019-9111',
    scope: 'CCTV control room, boundary patrols, emergency light compliance, building lockups.',
    availability: 'Emergency Patrol: 24/7',
    members: 22,
    avgResponse: '5 minutes'
  }
];

export default function AdminsPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#50d8e9] animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Administrative Directory</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Campus Administrators</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Contact directories and operational scopes for our primary smart maintenance teams and administrative blocks.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEPARTMENTS.map((dept, idx) => (
            <div key={idx} className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors duration-200 shadow-sm inner-glow">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight leading-snug">{dept.name}</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{dept.scope}</p>

                {/* Logistics */}
                <div className="space-y-3 border-t border-white/[0.05] pt-6 mb-6">
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    <span>{dept.availability}</span>
                  </div>
                  <div className="flex gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><strong className="text-white">{dept.members}</strong> active staff</span>
                    <span className="flex items-center gap-1.5"><strong className="text-white">{dept.avgResponse}</strong> avg response</span>
                  </div>
                </div>
              </div>

              {/* Roster Lead info */}
              <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Department Lead</div>
                  <div className="text-white font-medium text-[15px]">{dept.lead}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${dept.email}`} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-white transition-colors" title={`Email ${dept.lead}`}>
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </a>
                  <a href={`tel:${dept.phone}`} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-white transition-colors" title={`Call ${dept.lead}`}>
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}

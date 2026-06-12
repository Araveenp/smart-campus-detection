import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';

const SOP_DATA = [
  {
    category: 'Electrical & Power Grid',
    icon: 'electric_bolt',
    color: '#ffb689', // Tertiary dim
    items: [
      { id: 'SOP-ELE-01', title: 'Campus Power Outage Protocol', priority: 'High', steps: ['Assess outage boundary (building vs campus-wide)', 'Notify grid administration within 5 minutes', 'Activate emergency generators for critical labs', 'Broadcast ETA status alerts to students'] },
      { id: 'SOP-ELE-02', title: 'Lab Equipment Malfunction', priority: 'Medium', steps: ['Isolate the power supply to unit', 'Place visible lockout/tagout warning tag', 'Log ticket with specifications in SmartCampus system', 'Dispatch designated department technician'] }
    ]
  },
  {
    category: 'Plumbing & Water Systems',
    icon: 'water_drop',
    color: '#92f1ff', // Secondary dim
    items: [
      { id: 'SOP-PLU-01', title: 'Severe Water Leakage or Burst', priority: 'Critical', steps: ['Immediately shut off the main zone control valve', 'Clear area of electrical risks and students', 'Alert plumbing response squad via push notification', 'Begin water extraction to prevent structural damage'] },
      { id: 'SOP-PLU-02', title: 'Minor Restroom Maintenance', priority: 'Low', steps: ['Inspect restroom fixtures for slow drains/minor leaks', 'Schedule fix during off-peak campus hours', 'Update ticket resolution log'] }
    ]
  },
  {
    category: 'Network & Infrastructure',
    icon: 'router',
    color: '#bec2ff', // Primary fixed
    items: [
      { id: 'SOP-NET-01', title: 'WiFi Access Point Outage', priority: 'Medium', steps: ['Run remote ping and interface resets', 'Verify hardware uplink status via campus switchboard', 'Dispatch field technician if uplink remains down', 'Update campus status report page'] },
      { id: 'SOP-NET-02', title: 'Server Room Environmental Alert', priority: 'High', steps: ['Check temperature metrics from remote sensors', 'Adjust secondary AC units manually if thermostat fails', 'Evacuate non-essential gear if temperature exceeds 32°C'] }
    ]
  },
  {
    category: 'Campus Security & Safety',
    icon: 'gpp_bad',
    color: '#ffb3b3',
    items: [
      { id: 'SOP-SEC-01', title: 'Intrusion or Unauthorized Access', priority: 'Critical', steps: ['Lock down affected perimeter boundaries immediately', 'Alert on-duty campus security dispatchers', 'Review CCTV feeds using regional dashboard mapping', 'Coordinate with local safety authorities if required'] },
      { id: 'SOP-SEC-02', title: 'Emergency Lighting Failure', priority: 'High', steps: ['Identify pathways lacking emergency illumination', 'Deploy temporary tactical pathway lights', 'Prioritize wiring replacement in the morning shift'] }
    ]
  }
];

export default function SOPIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredSOPs = SOP_DATA.map(cat => {
    const items = cat.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.steps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Standard Operating Procedures</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">SOP Index</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Review the campus standard operating procedures. Our AI Engine references these protocols dynamically to compile instant action plans for incoming issues.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input
            type="text"
            placeholder="Search by protocol title, ID, or step keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* SOP Content */}
        <div className="space-y-12">
          {filteredSOPs.length > 0 ? (
            filteredSOPs.map((cat, catIdx) => (
              <div key={catIdx} className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/[0.05]">
                  <span className="material-symbols-outlined text-3xl" style={{ color: cat.color }}>
                    {cat.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{cat.category}</h2>
                </div>

                <div className="space-y-4">
                  {cat.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`border border-white/[0.06] rounded-xl overflow-hidden transition-all duration-200 ${expandedId === item.id ? 'bg-white/[0.02] border-white/20' : 'bg-transparent hover:bg-white/[0.01]'}`}
                    >
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full text-left p-5 flex justify-between items-center gap-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <span className="font-mono text-xs text-gray-500 font-bold bg-white/[0.05] px-2.5 py-1 rounded">
                            {item.id}
                          </span>
                          <span className="text-white font-medium text-[16px]">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            item.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            item.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            item.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {item.priority}
                          </span>
                          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </div>
                      </button>

                      {expandedId === item.id && (
                        <div className="p-5 border-t border-white/[0.05] bg-white/[0.01]">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Action Pipeline Steps</h4>
                          <ol className="space-y-3">
                            {item.steps.map((step, stepIdx) => (
                              <li key={stepIdx} className="flex gap-4 items-start text-gray-300">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-xs font-mono text-white font-bold">
                                  {stepIdx + 1}
                                </span>
                                <span className="pt-0.5 text-[15px]">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-4">search_off</span>
              <p className="text-gray-400 text-lg">No procedures found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

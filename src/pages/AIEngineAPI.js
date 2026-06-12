import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';

export default function AIEngineAPI() {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code snippet copied to clipboard!');
  };

  const codeSnippets = {
    classify: `{
  "description": "Ac in library classroom 302 has been leaking water onto the carpeted floor.",
  "location": "Library Building, 3rd Floor",
  "reporterRole": "student"
}`,
    classifyResponse: `{
  "ticketId": "ticket-908123",
  "classification": "Plumbing & Leakage",
  "priorityLevel": "High",
  "confidenceScore": 0.94,
  "assignedDepartment": "Facilities Maintenance",
  "suggestedSOP": "SOP-PLU-01 (Severe Water Leakage or Burst)",
  "aiActionPlan": [
    "Locate the zone control valve for Library 3rd floor and shut off supply.",
    "Evacuate students nearby to prevent slips or exposure to power cords.",
    "Deploy extraction pumps to dry the carpeted floor area."
  ]
}`,
    embed: `{
  "query": "clogged drainage causing backup in canteen kitchen sink",
  "topK": 3
}`
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#50d8e9] animate-pulse"></span>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Developer Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">AI Engine API</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Integrate and query the SmartCampus intelligence pipeline. Access classification models, vector embeddings, and RAG-driven action steps.
          </p>
        </div>

        {/* Inner Navigation Tabs */}
        <div className="flex justify-center border-b border-white/[0.08] mb-12">
          {['Overview', 'Classification Endpoints', 'RAG Retrievers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-primary text-white font-semibold' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span> Neural Architecture
                </h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">
                  SmartCampus AI uses a hybrid transformer architecture for ticket processing. When a student files a complaint, it generates semantic embeddings that match the ticket description against a high-dimensional vector DB of historical tickets and pre-approved Standard Operating Procedures (SOPs).
                </p>
              </div>
              <div className="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">database</span> Vector Embeddings
                </h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">
                  We map descriptions using the `text-embedding-3-small` model into a 1536-dimensional space. The distance search is performed using cosine similarity with a retrieval threshold of `0.72` to ensure correct policy context matching.
                </p>
              </div>
            </div>

            <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white mb-6">AI Pipeline Workflow</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                <div className="relative">
                  <div className="text-xs font-mono text-gray-500 mb-2">01. INGESTION</div>
                  <div className="text-white font-medium text-sm mb-1">Ticket Submitted</div>
                  <p className="text-xs text-gray-500">Student reports issue via interface or API.</p>
                </div>
                <div className="relative">
                  <div className="text-xs font-mono text-gray-500 mb-2">02. ANALYSIS</div>
                  <div className="text-white font-medium text-sm mb-1">Classification & Embeddings</div>
                  <p className="text-xs text-gray-500">Categorization, priority tagging, & vector search.</p>
                </div>
                <div className="relative">
                  <div className="text-xs font-mono text-gray-500 mb-2">03. RETRIEVAL</div>
                  <div className="text-white font-medium text-sm mb-1">RAG Context Matching</div>
                  <p className="text-xs text-gray-500">Pulls corresponding SOP parameters from KB.</p>
                </div>
                <div className="relative">
                  <div className="text-xs font-mono text-gray-500 mb-2">04. DISPATCH</div>
                  <div className="text-white font-medium text-sm mb-1">Action Plan Generation</div>
                  <p className="text-xs text-gray-500">Populates admin panels with exact step protocols.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Classification Endpoints */}
        {activeTab === 'Classification Endpoints' && (
          <div className="space-y-8">
            <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-mono px-3 py-1.5 rounded-md font-bold">POST</span>
                <span className="font-mono text-white text-[15px] font-semibold">/api/v1/tickets/classify</span>
              </div>
              <p className="text-gray-400 text-[15px] mb-8 leading-relaxed">
                Send raw campus complaints to retrieve category classifications, calculated priority levels, and AI-engineered operational steps.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Request */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Request Body (JSON)</span>
                    <button onClick={() => handleCopy(codeSnippets.classify)} className="text-xs text-primary font-medium hover:text-white transition-colors">Copy</button>
                  </div>
                  <pre className="bg-[#121315] border border-white/[0.06] rounded-xl p-5 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
                    {codeSnippets.classify}
                  </pre>
                </div>

                {/* Response */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Response Data (JSON)</span>
                    <button onClick={() => handleCopy(codeSnippets.classifyResponse)} className="text-xs text-primary font-medium hover:text-white transition-colors">Copy</button>
                  </div>
                  <pre className="bg-[#121315] border border-white/[0.06] rounded-xl p-5 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
                    {codeSnippets.classifyResponse}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: RAG Retrievers */}
        {activeTab === 'RAG Retrievers' && (
          <div className="space-y-8">
            <div className="bg-[#0a0a0b] border border-white/[0.05] rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-mono px-3 py-1.5 rounded-md font-bold">POST</span>
                <span className="font-mono text-white text-[15px] font-semibold">/api/v1/ai/sop-search</span>
              </div>
              <p className="text-gray-400 text-[15px] mb-8 leading-relaxed">
                Query standard operating procedures programmatically based on issue semantics. Used for building chatbot integrations or offline analysis models.
              </p>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-500">Request Body</span>
                  <button onClick={() => handleCopy(codeSnippets.embed)} className="text-xs text-primary font-medium hover:text-white transition-colors">Copy</button>
                </div>
                <pre className="bg-[#121315] border border-white/[0.06] rounded-xl p-5 text-xs text-gray-300 font-mono overflow-x-auto max-w-xl leading-relaxed">
                  {codeSnippets.embed}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

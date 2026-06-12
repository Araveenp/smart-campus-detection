import React from 'react';
import PublicLayout from '../components/PublicLayout';

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Legal Notice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-gray-500 text-sm font-mono">Last Updated: June 12, 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed text-[16px]">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Introduction</h2>
            <p>
              SmartCampus ("we", "us", "our") operates the campus problem detection and RAG dispatch routing portal. This Privacy Policy details how we collect, process, and protect student and staff information when using our application service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Information Collection</h2>
            <p>
              We collect information necessary to identify and resolve campus maintenance tickets. This includes:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2 text-gray-400">
              <li><strong>Personal Identifiers:</strong> Name, campus email address, and account role (Student, Staff, Admin).</li>
              <li><strong>Submission Details:</strong> Incident description texts, specific structural locations, photographs, and optional anonymous tag preferences.</li>
              <li><strong>Authentication Data:</strong> Standard password hashes or Google OAuth profile fields when logging in.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">3. How We Use Information</h2>
            <p>
              The data is processed solely to fulfill maintenance and administrative obligations on campus. This includes:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2 text-gray-400">
              <li>Analyzing complaint descriptions via our AI model to predict severity levels.</li>
              <li>Routing maintenance logs to the correct administrative staff roster.</li>
              <li>Rendering aggregate, non-identifying telemetry markers on the public heatmap portal.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Security Practices</h2>
            <p>
              SmartCampus stores data securely within standard Google Firebase Realtime Database structures. Standard OAuth parameters are verified using Firebase Auth tokens. We do not sell or lease any student data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Contact Information</h2>
            <p>
              For privacy audits or data deletion requests, please contact the network control office at <a href="mailto:privacy@smartcampus.edu" className="text-primary hover:underline">privacy@smartcampus.edu</a>.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

import React from 'react';
import PublicLayout from '../components/PublicLayout';

export default function TermsOfService() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.08] px-4 py-2 rounded-full mb-6">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Legal Notice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-gray-500 text-sm font-mono">Last Updated: June 12, 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed text-[16px]">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By creating a student or professional staff profile on the SmartCampus system, you agree to comply with these terms, campus code policies, and standard acceptable use rules.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Acceptable Use Policy</h2>
            <p>
              The SmartCampus portal is an operational network tool designed to log genuine structural, safety, and infrastructure concerns. You explicitly agree:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2 text-gray-400">
              <li>Not to submit false, duplicate, or mock complaints with the intent to skew database parameters or spam admin dashboards.</li>
              <li>Not to use profane language, personal insults, or irrelevant information inside incident text descriptions.</li>
              <li>Not to attempt database breach, reverse engineering of model parameters, or API spoofing.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">3. User Integrity & Points</h2>
            <p>
              Verification points assigned on the leaderboard are gamified representations of community action. Abuse of the reporting system, logging fake confirmations, or cheating parameters will result in immediate profile suspension and academic escalation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Limitation of Liability</h2>
            <p>
              While the AI Engine generates action plans based on official Standard Operating Procedures, the physical repairs are done by human staff members. We are not liable for delayed dispatches, minor ETA variances, or general structural events.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Contact Information</h2>
            <p>
              For general operations inquiries or system feedback, please contact the campus supervisor at <a href="mailto:admin@smartcampus.edu" className="text-primary hover:underline">admin@smartcampus.edu</a>.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

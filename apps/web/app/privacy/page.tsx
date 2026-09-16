import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, Eye, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Indian Short Films',
  description: 'Learn how Indian Short Films collects, uses, and protects your personal data and content.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-cinema-muted hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-cinema-card rounded-3xl p-6 sm:p-10 border border-cinema-border space-y-8 shadow-2xl">
        {/* Header */}
        <div className="border-b border-cinema-border/60 pb-6">
          <div className="inline-flex items-center gap-2 text-cinema-teal bg-cinema-teal/10 border border-cinema-teal/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>LEGAL & DATA PRIVACY</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">Privacy Policy</h1>
          <p className="text-xs text-cinema-muted mt-2">
            Last updated: September 16, 2026 • Platform Version 1.0.0
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cinema-gold" /> 1. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            When you register, view content, or submit short films on the Indian Short Films platform, we collect information necessary to provide and personalize our streaming services:
          </p>
          <ul className="list-disc list-inside text-xs sm:text-sm text-cinema-muted space-y-1 pl-2">
            <li><strong className="text-white">Account Data:</strong> Email address, full name, username, and encrypted credentials managed securely via Supabase Authentication.</li>
            <li><strong className="text-white">Usage &amp; Interaction Data:</strong> Short films watched, playback position, watchlists, ratings (1–5 stars), reviews, comments, and likes.</li>
            <li><strong className="text-white">Filmmaker Submission Data:</strong> Submitted film titles, video stream URLs, poster artwork, director bios, and metadata.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cinema-teal" /> 2. How We Use Your Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Your data is used strictly to power platform features, enable video streaming, sync watch progress across web and mobile devices, calculate aggregated rating statistics, and protect against platform abuse.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cinema-accent" /> 3. Data Protection &amp; Row Level Security
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            All user data stored in our database is protected using PostgreSQL Row Level Security (RLS) policies. Private user information is never accessible to unauthorized third parties. We do not sell or monetize personal user data.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 4. User Data Rights &amp; Deletion
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            You have the right to request a copy of your stored data or request full account deletion. Account deletion permanently removes your profile, watchlists, ratings, and submission history from our database.
          </p>
          <p className="text-xs text-cinema-muted pt-2 border-t border-cinema-border/40">
            For privacy inquiries or deletion requests, contact us at: <a href="mailto:privacy@indianshortfilms.com" className="text-cinema-teal underline">privacy@indianshortfilms.com</a>
          </p>
        </section>

        {/* Legal Disclaimer Alert */}
        <div className="p-4 rounded-2xl bg-cinema-surface border border-cinema-border text-xs text-cinema-muted leading-relaxed">
          <strong className="text-white block mb-1">Legal Review Notice:</strong>
          This document serves as the official privacy disclosure for Indian Short Films Web &amp; Mobile applications. Final legal counsel review is recommended prior to commercial publishing.
        </div>
      </div>
    </div>
  );
}

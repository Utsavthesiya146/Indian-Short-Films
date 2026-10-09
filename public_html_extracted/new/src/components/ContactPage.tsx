import React from 'react';
import { ContactSection } from './ContactSection';
import { ShieldCheck, Sparkles, HelpCircle, Film, Clock, CheckCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div id="contact-full-page" className="py-8 sm:py-12 space-y-12 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Contact Section with full details and working interactive pitch form */}
      <ContactSection />

      {/* Filmmaker Submission Guidelines & FAQ Cards */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="h-4 w-4" />
          <span>Filmmaker Screener Guidelines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Film className="h-4 w-4 text-purple-400" />
              <h4>Video Resolution</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              We accept 1080p Full HD and 4K Ultra HD screeners in MP4 or MOV formats with stereo or 5.1 surround audio.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Clock className="h-4 w-4 text-purple-400" />
              <h4>Running Time</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Short narrative fiction, documentaries, and animation between 3 minutes to 45 minutes in all regional Indian languages.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <CheckCircle className="h-4 w-4 text-purple-400" />
              <h4>Rights & Ownership</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Filmmakers retain 100% of their intellectual property, copyright, and distribution rights. Non-exclusive screening license only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { PlatformStore } from '../services/platformStore';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [inquiryType, setInquiryType] = useState('Short Film Submission');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    
    PlatformStore.addMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phoneInput.trim(),
      category: inquiryType,
      message: message.trim(),
      projectTitle: inquiryType
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhoneInput('');
      setMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div id="contact-section" className="relative w-full space-y-12">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold text-purple-300">
            <Mail className="h-3.5 w-3.5 text-purple-400" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="cinematic-title text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Get In Touch With <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Indian Short Movie</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Whether you want to submit a short film, inquire about festival screening, collaborate on digital production, or consult with Harri Kumar.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Direct Info Glass Cards */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Harri Kumar Official Contact Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-2xl transition-all hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.15)]">
              <div className="flex items-center gap-3.5">
                <img
                  src="/harri-kumar.jpg"
                  alt="Harri Kumar"
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-purple-500/50 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Harri Kumar</h3>
                  <p className="text-xs text-purple-400 font-medium">Founder & Digital Project Leader</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                {/* Phone */}
                <a
                  href="tel:+919341873532"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">Direct Phone</span>
                    <span className="font-semibold text-sm">+91 93418 73532</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919341873532"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">Official WhatsApp</span>
                    <span className="font-semibold text-sm text-emerald-400">Chat with Harri on WhatsApp →</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:connect@harrikumar.com"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-gray-300 hover:border-blue-500/50 hover:text-blue-400 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">Official Email</span>
                    <span className="font-semibold text-sm">connect@harrikumar.com</span>
                  </div>
                </a>
              </div>

              {/* Hosting Baba partner box */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-bold block">Powered By</span>
                  <span className="text-xs font-bold text-white">Web Hosting Baba</span>
                </div>
                <a
                  href="https://webhostingbaba.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-purple-300 hover:underline flex items-center gap-1"
                >
                  <span>Visit</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Glass Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-1">Send a Message or Project Pitch</h3>
              <p className="text-xs text-gray-400 mb-6">Fill in the form below and our team will get back to you within 24 hours.</p>

              {isSubmitted ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center space-y-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Inquiry Received Successfully</h4>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto">
                    Thank you, {name}! Your message regarding "{inquiryType}" has been logged in our system.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Murthy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Topic / Service *</label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0d0d18] px-3.5 py-3 text-xs text-white focus:border-purple-500/60 focus:outline-none"
                      >
                        <option value="Short Film Submission">Short Film Submission</option>
                        <option value="Festival Screening & Premiere">Festival Screening & Premiere</option>
                        <option value="Creator Sponsorship & Funding">Creator Sponsorship & Funding</option>
                        <option value="Web Development / Web Hosting Baba">Web Development / Hosting</option>
                        <option value="Interview & Press Inquiry">Interview & Press Inquiry</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Message / Pitch Details *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your short film, production requirements, or query..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-purple-500/60 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-98 transition-all w-full sm:w-auto cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message to Team</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      {/* Floating Action Button for WhatsApp */}
      <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-2.5">
        <a
          href="https://wa.me/919341873532"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95 transition-transform"
          title="Chat on WhatsApp (+91 93418 73532)"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};

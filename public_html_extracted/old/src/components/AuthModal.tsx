import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Film, Clapperboard, Briefcase, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { PlatformStore } from '../services/platformStore';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('filmmaker');
  const [bio, setBio] = useState('');
  const [brandName, setBrandName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await PlatformStore.loginUser(identifier, password);
    setIsLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await PlatformStore.registerUser({
      name,
      username,
      email,
      password,
      role,
      bio,
      brandName: role === 'brand' ? (brandName || name) : undefined,
      website,
      contactPhone,
      profession: role === 'brand' ? undefined : (profession || (role === 'filmmaker' ? 'Film Director' : 'Video Creator')),
      location,
      industry: role === 'brand' ? industry : undefined,
      brandCategory: role === 'brand' ? industry : undefined
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMsg(`Welcome to Indian Short Movie, ${res.user.name}!`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check the inputs.');
    }
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative my-8 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-[#222222]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-gray-200 bg-gray-100 p-1.5 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f84464] text-white mx-auto shadow-md">
            {isRegister ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
          </div>
          <h3 className="text-xl font-bold text-[#222222]">
            {isRegister ? "Create Your Account" : "Sign In to Indian Short Movie"}
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {isRegister 
              ? "Join India's premier creator platform to upload films, stream reels, and connect with audiences."
              : "Access your filmmaker dashboard, uploaded cinema, watchlists, and account settings."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 border border-gray-200">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              !isRegister ? 'bg-[#f84464] text-white shadow-sm' : 'text-gray-600 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg(null);
            }}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              isRegister ? 'bg-[#f84464] text-white shadow-sm' : 'text-gray-600 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {!isRegister ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Username or Email Address</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. harrikumargowda or your@email.com"
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                required
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#f84464] hover:bg-[#e03352] py-2.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Account Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('filmmaker')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    role === 'filmmaker'
                      ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464]'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Film className="h-4 w-4" />
                  <span className="text-[11px] font-bold">Filmmaker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    role === 'creator'
                      ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464]'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Clapperboard className="h-4 w-4" />
                  <span className="text-[11px] font-bold">Creator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    role === 'brand'
                      ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464]'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="text-[11px] font-bold">Brand / Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all ${
                    role === 'viewer'
                      ? 'border-[#f84464] bg-[#f84464]/10 text-[#f84464]'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-[11px] font-bold">Viewer</span>
                </button>
              </div>

              {role === 'brand' && (
                <div className="rounded-lg border border-amber-300 bg-amber-50/80 p-2.5 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                  <Briefcase className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Brand Account:</strong> Upload your brand films, commercials, sponsored reels, and showcase campaigns with verified partner badges and direct call-to-action links.
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name / Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Varma"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. ramesh_cinema"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            </div>

            {role === 'brand' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Brand / Studio Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Red Chillies Indie Studio"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Industry / Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Media, OTT, Production House"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Profession / Specialty</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Director, Writer, DP, Producer"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Website / Portfolio</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone / WhatsApp</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Bio / About</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the Indian cinema community about your productions, craft, and vision..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-[#222222] placeholder-gray-400 focus:bg-white focus:border-[#f84464] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#f84464] hover:bg-[#e03352] py-2.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account & Get Started"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

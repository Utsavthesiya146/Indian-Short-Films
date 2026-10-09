import React, { useState } from 'react';
import { 
  Map, 
  Users, 
  Maximize2, 
  Clock, 
  Sparkles, 
  Mic2, 
  Volume2, 
  Check, 
  Calendar, 
  Compass, 
  Info,
  Tv
} from 'lucide-react';
import { FLOOR_PLAN_ZONES } from '../data/mockData';
import { FloorPlanZone } from '../types';

interface InteractiveFloorPlanProps {
  onReserveZone?: (zone: FloorPlanZone) => void;
}

export const InteractiveFloorPlan: React.FC<InteractiveFloorPlanProps> = ({
  onReserveZone
}) => {
  const [selectedZone, setSelectedZone] = useState<FloorPlanZone>(FLOOR_PLAN_ZONES[0]);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reserveName, setReserveName] = useState('');
  const [reserveEmail, setReserveEmail] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleZoneSelect = (zone: FloorPlanZone) => {
    setSelectedZone(zone);
    setReservationSuccess(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveName.trim() || !reserveEmail.trim()) return;
    setReservationSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setReservationSuccess(false);
      setReserveName('');
      setReserveEmail('');
    }, 2500);
  };

  return (
    <section id="interactive-floor-plan-section" className="py-12 md:py-16 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Map className="h-3.5 w-3.5" />
              <span>Studio & Festival Hub</span>
            </div>
            <h2 className="cinematic-title text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Interactive Cinema & Studio Floor Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Explore the physical production and premiere facilities of Indian Short Movie. Click any zone to view real-time events, technical specs, capacity, and scheduling.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sessions Active
            </span>
            <span>•</span>
            <span className="font-mono text-amber-400">Dolby Atmos Certified</span>
          </div>
        </div>

        {/* Main Floor Plan Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Layout Blueprint Canvas */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-2xl overflow-hidden">
              
              {/* Architectural Grid Background */}
              <div 
                className="relative aspect-[16/11] w-full rounded-2xl border border-slate-800/80 bg-slate-950 p-3 sm:p-4 overflow-hidden"
                style={{
                  backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              >
                {/* Blueprint Title Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-mono text-slate-400 border border-slate-800 backdrop-blur-sm">
                  <span>LEVEL 01: CINEMA HUB & STUDIOS</span>
                </div>

                {/* Render Clickable Zone Boxes */}
                {FLOOR_PLAN_ZONES.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      id={`floor-zone-${zone.id}`}
                      onClick={() => handleZoneSelect(zone)}
                      style={{
                        position: 'absolute',
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                      }}
                      className={`group cursor-pointer rounded-xl border p-2.5 sm:p-3 transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 z-20'
                          : 'border-slate-700/80 bg-slate-900/80 hover:border-slate-500 hover:bg-slate-850/90 z-10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`text-[10px] sm:text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {zone.code}
                        </span>
                        <span 
                          className="h-2 w-2 rounded-full shrink-0 mt-0.5" 
                          style={{ backgroundColor: zone.color }}
                        />
                      </div>

                      <div className="overflow-hidden">
                        <h4 className={`text-[11px] sm:text-xs font-bold truncate leading-tight ${isSelected ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                          {zone.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Cap: {zone.capacity} • {zone.dimensions}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                        <span className="truncate max-w-[80%]">{zone.status}</span>
                        {isSelected && <span className="text-amber-400 font-bold">●</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Compass Marker */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[9px] font-mono text-slate-400 border border-slate-800">
                  <Compass className="h-3 w-3 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                  <span>STUDIO HQ • DIGITAL MASTERING</span>
                </div>
              </div>

              {/* Zone Selector Strip */}
              <div className="mt-4 flex flex-wrap gap-2">
                {FLOOR_PLAN_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedZone.id === zone.id
                        ? 'bg-amber-500 text-black font-bold shadow-md'
                        : 'border border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {zone.name.split(' ')[0]} ({zone.code})
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Right: Selected Zone Details Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl">
              
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-400">
                    {selectedZone.code}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    {selectedZone.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-2">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedZone.description}
                </p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    <span>Seating Capacity</span>
                  </div>
                  <span className="text-base font-black text-white">{selectedZone.capacity} Guests</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <Maximize2 className="h-3.5 w-3.5 text-sky-400" />
                    <span>Dimensions</span>
                  </div>
                  <span className="text-base font-black text-white">{selectedZone.dimensions}</span>
                </div>
              </div>

              {/* Current Event / Scheduled Session */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-red-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tv className="h-3.5 w-3.5" />
                    Current Session
                  </span>
                  <span className="font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedZone.scheduleTime}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {selectedZone.currentEvent}
                </h4>
                <p className="text-xs text-slate-300">
                  Host / Speaker: <strong className="text-amber-300">{selectedZone.speakerOrHost}</strong>
                </p>
              </div>

              {/* Technical Features & Hardware */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Technical Specifications & Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.features.map((feat, idx) => (
                    <span 
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-200 flex items-center gap-1.5"
                    >
                      <Check className="h-3 w-3 text-amber-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Reserve / Pitch Slot */}
              <div className="pt-2">
                <button
                  id="floor-plan-reserve-btn"
                  onClick={() => setShowBookingModal(true)}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all"
                >
                  Book Zone / Reserve Festival Pitch Slot
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Reservation Dialog Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">
              Reserve Slot in {selectedZone.name}
            </h3>
            <p className="text-xs text-slate-300">
              Submit your filmmaker or production details to secure admission or schedule a project review during festival hours.
            </p>

            {reservationSuccess ? (
              <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-center text-xs font-bold text-emerald-300 space-y-1">
                <Check className="h-6 w-6 mx-auto text-emerald-400" />
                <p>Reservation Confirmed!</p>
                <p className="font-normal text-[11px] text-slate-300">
                  Confirmation sent to {reserveEmail}. Our festival coordinator will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g. Ramesh Hegde)"
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={reserveEmail}
                    onChange={(e) => setReserveEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-750"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-black hover:bg-amber-400"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

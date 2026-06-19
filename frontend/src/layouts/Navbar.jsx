import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMenu, IoPlanet, IoTimeOutline, IoWifi } from 'react-icons/io5';
import { useSidebar } from '../context/SidebarContext';

const pageTitles = {
  '/': 'Mission Dashboard',
  '/satellites': 'Satellite Constellation',
  '/missions': 'Mission Control Operations',
  '/collisions': 'Collision Risk Engine',
  '/telemetry': 'Live Telemetry Stream',
  '/debris': 'Orbital Debris Tracking',
  '/alerts': 'Active Alert Center',
  '/logs': 'System Audit Logs'
};

const Navbar = () => {
  const { toggle } = useSidebar();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'OrbitalShield';
  
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-6 z-30 mx-6 mb-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-5">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 transition-colors border border-cyan-500/10 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)]"
          >
            <IoMenu size={20} />
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-purple-500"></div>
            <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* UTC Time */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#040814]/50 border border-white/5">
            <IoTimeOutline className="text-purple-400" />
            <span className="text-sm font-mono text-gray-300 tracking-wider">{time}</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#22C55E]"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Uplink Active</span>
            <IoWifi className="text-emerald-400 ml-1" />
          </div>

          {/* Profile/Role */}
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-200">Director</p>
              <p className="text-[10px] text-cyan-400 tracking-widest uppercase">Mission Control</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#040814] border border-cyan-500/30 flex items-center justify-center relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <IoPlanet className="text-cyan-400 text-xl group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

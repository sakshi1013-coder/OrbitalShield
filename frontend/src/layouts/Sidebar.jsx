import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSpeedometer, IoRocket, IoGameController, IoWarning,
  IoPulse, IoTrash, IoNotifications, IoDocument, IoClose, IoPlanet
} from 'react-icons/io5';
import { useSidebar } from '../context/SidebarContext';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: IoSpeedometer },
  { path: '/satellites', label: 'Satellites', icon: IoRocket },
  { path: '/missions', label: 'Mission Control', icon: IoGameController },
  { path: '/collisions', label: 'Collision Detection', icon: IoWarning },
  { path: '/telemetry', label: 'Telemetry', icon: IoPulse },
  { path: '/debris', label: 'Orbital Debris', icon: IoTrash },
  { path: '/alerts', label: 'Alerts', icon: IoNotifications },
  { path: '/logs', label: 'System Logs', icon: IoDocument }
];

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[#040814]/80 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-0 lg:top-6 left-0 lg:left-6 h-full lg:h-[calc(100vh-48px)] z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'w-64' : 'w-0 lg:w-20'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full bg-[#090d16]/70 backdrop-blur-[24px] border border-white/[0.08] lg:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden">
          
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between border-b border-cyan-500/10">
            <div className={`flex items-center gap-4 ${!isOpen && 'lg:justify-center w-full'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,217,255,0.4)] relative">
                <div className="absolute inset-0 rounded-xl border border-white/20"></div>
                <IoPlanet className="text-white text-xl relative z-10" />
              </div>
              {isOpen && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-base font-bold tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span className="gradient-text">ORBITAL</span>
                  </h1>
                  <p className="text-[10px] text-cyan-400/80 font-medium tracking-[0.2em] uppercase">Shield</p>
                </motion.div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-link relative ${isActive ? 'active' : ''} ${!isOpen ? 'lg:justify-center lg:px-0' : ''}`
                }
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/5 rounded-xl border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(0,217,255,0.1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`text-xl flex-shrink-0 relative z-10 transition-colors duration-300 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]' : 'text-gray-500'}`} />
                    {isOpen && <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : ''}`}>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Version */}
          {isOpen && (
            <div className="p-6 border-t border-cyan-500/10">
              <div className="rounded-xl bg-[#040814]/50 border border-white/5 p-4 text-center">
                <p className="text-[10px] text-gray-500 font-medium tracking-[0.1em] uppercase mb-1">Space Traffic Mgmt</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] text-emerald-400/80">Systems Nominal</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

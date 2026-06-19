import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AnimatedBackground from '../components/AnimatedBackground';
import { useSidebar } from '../context/SidebarContext';

const MainLayout = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();

  return (
    <AnimatedBackground>
      <div className="min-h-screen relative z-10 flex">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <Navbar />
          <main className="p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default MainLayout;

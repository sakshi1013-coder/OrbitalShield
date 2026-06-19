import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Satellites from './pages/Satellites';
import Missions from './pages/Missions';
import Collisions from './pages/Collisions';
import Telemetry from './pages/Telemetry';
import Debris from './pages/Debris';
import Alerts from './pages/Alerts';
import Logs from './pages/Logs';
import Loader from './components/Loader';

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/satellites" element={<Satellites />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/collisions" element={<Collisions />} />
            <Route path="/telemetry" element={<Telemetry />} />
            <Route path="/debris" element={<Debris />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;

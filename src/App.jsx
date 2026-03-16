import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AnimeModal from './components/AnimeModal';
import Home from './pages/Home';
import Upcoming from './pages/Upcoming';
import Schedule from './pages/Schedule';

export default function App() {
  const [selectedAnime, setSelectedAnime] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30 selection:text-primary-light">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home onOpenAnime={setSelectedAnime} />} />
              <Route path="/upcoming" element={<Upcoming onOpenAnime={setSelectedAnime} />} />
              <Route path="/schedule" element={<Schedule onOpenAnime={setSelectedAnime} />} />
            </Routes>
          </main>
        </div>

        <AnimatePresence>
          {selectedAnime && (
            <AnimeModal 
              anime={selectedAnime} 
              onClose={() => setSelectedAnime(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import AnimeModal from './components/AnimeModal';
import Home from './pages/Home';
import Upcoming from './pages/Upcoming';
import Schedule from './pages/Schedule';

import Search from './pages/Search';

export default function App() {
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [titleLang, setTitleLang] = useState(localStorage.getItem('titleLang') || 'en');
  const [showAdult, setShowAdult] = useState(localStorage.getItem('showAdult') === 'true');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('titleLang', titleLang);
  }, [titleLang]);

  useEffect(() => {
    localStorage.setItem('showAdult', showAdult);
  }, [showAdult]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setTitleLang(prev => prev === 'en' ? 'jp' : 'en');
  const toggleAdult = () => setShowAdult(prev => !prev);

  return (
    <Router>
      <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 selection:text-primary-light transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <Navbar 
            theme={theme} 
            toggleTheme={toggleTheme} 
            titleLang={titleLang} 
            toggleLang={toggleLang} 
            showAdult={showAdult}
            toggleAdult={toggleAdult}
          />

          <main>
            <Routes>
              <Route path="/" element={<Home onOpenAnime={setSelectedAnime} titleLang={titleLang} showAdult={showAdult} />} />
              <Route path="/upcoming" element={<Upcoming onOpenAnime={setSelectedAnime} titleLang={titleLang} showAdult={showAdult} />} />
              <Route path="/schedule" element={<Schedule onOpenAnime={setSelectedAnime} titleLang={titleLang} showAdult={showAdult} />} />
              <Route path="/search" element={<Search onOpenAnime={setSelectedAnime} titleLang={titleLang} showAdult={showAdult} />} />
            </Routes>
          </main>
        </div>

        <AnimatePresence mode="wait">
          {selectedAnime && (
            <AnimeModal 
              anime={selectedAnime} 
              onClose={() => setSelectedAnime(null)} 
              titleLang={titleLang}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

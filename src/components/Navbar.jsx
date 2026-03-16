import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, Clock, Calendar, Sun, Moon, Globe, Search } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, titleLang, toggleLang }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = e.target.search.value;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      e.target.search.value = '';
      e.target.search.blur();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border py-4 flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 px-4">
      <Link to="/" className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/50">
          <Flame className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter gradient-text uppercase italic hidden sm:block">ANIME DISCOVERY</h1>
      </Link>

      <div className="flex-grow max-w-2xl px-4">
        <div className="bg-white rounded-xl p-1 flex items-center shadow-lg border border-white/20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.search.value;
              if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`);
            }} 
            className="flex-grow flex items-center relative"
          >
            <input 
              name="search"
              placeholder="Search anime..."
              className="w-full bg-transparent py-2 px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="p-2 text-slate-900 hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <Link 
            to="/search"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all"
          >
            Filter
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 shrink-0">
        <div className="flex gap-2 p-1.5 bg-card-bg rounded-2xl border border-border">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-primary/10 hover:text-primary'}`}
          >
            Home
          </Link>
          <Link
            to="/upcoming"
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/upcoming' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-primary/10 hover:text-primary'}`}
          >
            Upcoming
          </Link>
          <Link
            to="/schedule"
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/schedule' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'hover:bg-secondary/10 hover:text-secondary'}`}
          >
            Schedule
          </Link>
          <Link
            to="/search"
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/search' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-primary/10 hover:text-primary'}`}
          >
            Discover
          </Link>
        </div>

        <div className="flex gap-2 p-1.5 bg-card-bg rounded-2xl border border-border">
           <button 
             onClick={toggleLang}
             className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded-xl transition-all group"
             title="Toggle Title Language"
           >
             <Globe className={`w-4 h-4 transition-colors ${titleLang === 'en' ? 'text-primary' : 'text-secondary'}`} />
             <span className="text-[10px] font-black uppercase group-hover:text-primary transition-colors">{titleLang === 'en' ? 'EN' : 'JP'}</span>
           </button>

           <div className="w-px h-6 bg-border mx-1" />

           <button 
             onClick={toggleTheme}
             className="flex items-center gap-2 px-3 py-2 hover:bg-primary/10 rounded-xl transition-all group"
             title="Toggle Theme"
           >
             {theme === 'dark' ? (
               <Sun className="w-4 h-4 text-yellow-500 transition-transform group-hover:rotate-45" />
             ) : (
               <Moon className="w-4 h-4 text-primary transition-transform group-hover:-rotate-12" />
             )}
             <span className="text-[10px] font-black uppercase group-hover:text-primary transition-colors">{theme === 'dark' ? 'Light' : 'Dark'}</span>
           </button>
        </div>
      </div>
    </nav>
  );
}

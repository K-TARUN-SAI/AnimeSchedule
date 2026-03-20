import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flame, Clock, Calendar, Sun, Moon, Globe, Search } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, titleLang, toggleLang, showAdult, toggleAdult }) {
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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border py-3 lg:py-4 flex flex-col lg:flex-row justify-between items-center mb-8 lg:mb-12 gap-4 lg:gap-6 px-3 lg:px-4">
      <Link to="/" className="flex items-center gap-2 lg:gap-3 shrink-0">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/20 rounded-lg lg:rounded-xl flex items-center justify-center border border-primary/50">
          <Flame className="text-primary w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <h1 className="text-xl lg:text-2xl font-black tracking-tighter gradient-text uppercase italic hidden sm:block">ANIME DISCOVERY</h1>
      </Link>

      <div className="w-full lg:flex-grow lg:max-w-2xl px-2 lg:px-4 order-3 lg:order-none">
        <div className="bg-white rounded-lg lg:rounded-xl p-0.5 lg:p-1 flex items-center shadow-lg border border-white/20">
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
              className="w-full bg-transparent py-1.5 lg:py-2 px-3 lg:px-4 text-xs lg:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="p-1.5 lg:p-2 text-slate-900 hover:text-primary transition-colors">
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
          </form>
          <div className="w-px h-5 lg:h-6 bg-slate-200 mx-0.5 lg:mx-1" />
          <Link 
            to="/search"
            className="px-3 lg:px-4 py-1.5 lg:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md lg:rounded-lg text-[10px] lg:text-xs font-bold transition-all"
          >
            Filter
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center lg:justify-end items-center gap-3 lg:gap-4 shrink-0 w-full lg:w-auto">
        <div className="flex gap-1 p-1 bg-card-bg rounded-xl border border-border overflow-x-auto no-scrollbar max-w-full">
          {[
            { to: '/', label: 'Home', path: '/' },
            { to: '/upcoming', label: 'Upcoming', path: '/upcoming' },
            { to: '/schedule', label: 'Schedule', path: '/schedule', color: 'secondary' },
            { to: '/search', label: 'Discover', path: '/search' }
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-black uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
                location.pathname === link.path && (!link.search || location.search === link.search)
                  ? `bg-${link.color || 'primary'} text-white shadow-lg shadow-${link.color || 'primary'}/30` 
                  : `hover:bg-${link.color || 'primary'}/10 hover:text-${link.color || 'primary'}`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-1 lg:gap-2 p-1 lg:p-1.5 bg-card-bg rounded-xl lg:rounded-2xl border border-border">
           <button 
             onClick={toggleAdult}
             className={`flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-all group ${showAdult ? 'bg-red-500/10 text-red-500' : 'hover:bg-primary/10'}`}
             title="Toggle Adult Content"
           >
             <span className={`text-[9px] lg:text-[10px] font-black uppercase ${showAdult ? 'text-red-500' : 'group-hover:text-primary'}`}>18+</span>
           </button>

           <div className="w-px h-5 lg:h-6 bg-border mx-0.5 lg:mx-1" />

           <button 
             onClick={toggleLang}
             className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 hover:bg-primary/10 rounded-lg lg:rounded-xl transition-all group"
             title="Toggle Title Language"
           >
             <Globe className={`w-3.5 h-3.5 lg:w-4 lg:h-4 transition-colors ${titleLang === 'en' ? 'text-primary' : 'text-secondary'}`} />
             <span className="text-[9px] lg:text-[10px] font-black uppercase group-hover:text-primary transition-colors">{titleLang === 'en' ? 'EN' : 'JP'}</span>
           </button>

           <div className="w-px h-5 lg:h-6 bg-border mx-0.5 lg:mx-1" />

           <button 
             onClick={toggleTheme}
             className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1.5 lg:py-2 hover:bg-primary/10 rounded-lg lg:rounded-xl transition-all group"
             title="Toggle Theme"
           >
             {theme === 'dark' ? (
               <Sun className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-yellow-500 transition-transform group-hover:rotate-45" />
             ) : (
               <Moon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary transition-transform group-hover:-rotate-12" />
             )}
             <span className="text-[9px] lg:text-[10px] font-black uppercase group-hover:text-primary transition-colors">{theme === 'dark' ? 'Light' : 'Dark'}</span>
           </button>
        </div>
      </div>
    </nav>
  );
}

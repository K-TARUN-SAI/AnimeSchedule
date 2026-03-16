import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Clock, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/50">
          <Flame className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter gradient-text uppercase italic">ANIME DISCOVERY</h1>
      </Link>

      <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
        <Link
          to="/"
          className={`px-6 py-2 rounded-xl text-sm font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/10'}`}
        >
          Home
        </Link>
        <Link
          to="/upcoming"
          className={`px-6 py-2 rounded-xl text-sm font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/upcoming' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-white/10'}`}
        >
          <Clock className="w-4 h-4" /> Upcoming
        </Link>
        <Link
          to="/schedule"
          className={`px-6 py-2 rounded-xl text-sm font-black uppercase transition-all flex items-center gap-2 ${location.pathname === '/schedule' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'hover:bg-white/10'}`}
        >
          <Calendar className="w-4 h-4" /> Schedule
        </Link>
      </div>
    </nav>
  );
}

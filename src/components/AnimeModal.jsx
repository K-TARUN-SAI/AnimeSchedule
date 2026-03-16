import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { convertToIST } from '../utils/api';

export default function AnimeModal({ anime, onClose }) {
  const istInfo = anime.broadcast?.day && anime.broadcast?.time 
    ? convertToIST(anime.broadcast.day, anime.broadcast.time)
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary transition-all group"
        >
          <RefreshCw className="w-6 h-6 transition-transform group-hover:rotate-180" />
        </button>

        <div className="w-full md:w-2/5 relative h-64 md:h-auto">
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 md:hidden" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:hidden">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {anime.title_english || anime.title}
             </h2>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-16 overflow-y-auto custom-scrollbar">
          <div className="flex gap-3 mb-6">
            <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-xs font-black border border-primary/20 uppercase">
              {anime.type}
            </span>
            <span className="px-4 py-1.5 bg-white/5 text-gray-400 rounded-xl text-xs font-black border border-white/5 uppercase">
              {anime.status}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-none hidden md:block">
            {anime.title_english || anime.title}
          </h2>
          <h4 className="text-gray-500 font-bold mb-10 italic uppercase text-sm tracking-widest hidden md:block">
            {anime.title !== (anime.title_english || anime.title) ? anime.title : ''}
          </h4>

          <div className="grid grid-cols-2 gap-10 mb-12">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">Score</p>
              <p className="text-3xl font-black text-yellow-500 flex items-center gap-2">
                <span className="text-xs">★</span> {anime.score || '8.5'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">Episodes</p>
              <p className="text-3xl font-black">{anime.episodes || '??'} <span className="text-xs font-bold text-gray-600 uppercase ml-1">Ep</span></p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">Source</p>
              <p className="text-xl font-black uppercase tracking-tighter italic text-gray-300">{anime.source}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 italic text-primary">IST Broadcast</p>
              <p className="text-xl font-black text-white uppercase italic tracking-tighter">
                {istInfo ? `${istInfo.day} · ${istInfo.time}` : 'Seasonal'}
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4 italic">Synopsis</p>
            <p className="text-gray-300 leading-relaxed text-lg font-medium italic">
              {anime.synopsis || "Explosive story details coming soon. Stay tuned for updates."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
            {anime.genres?.map(g => (
              <span key={g.mal_id} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-primary/50 transition-colors cursor-default">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

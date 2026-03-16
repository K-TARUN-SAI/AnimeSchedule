import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function Spotlight({ anime, onOpen }) {
  if (!anime) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[500px] sm:h-[600px] overflow-hidden rounded-[3rem] mb-16 group"
    >
      <img 
        src={anime.images.webp.large_image_url} 
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 max-w-2xl">
        <motion.span 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-primary font-bold mb-4 tracking-widest text-sm uppercase flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary" /> #1 Spotlight
        </motion.span>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black mb-6 leading-tight drop-shadow-2xl uppercase italic tracking-tighter"
        >
          {anime.title_english || anime.title}
        </motion.h1>
        <div className="flex items-center gap-6 mb-8 text-xs text-gray-400 font-bold uppercase tracking-widest">
           <span className="flex items-center gap-2">TV SERIES</span>
           <span className="w-1 h-1 rounded-full bg-gray-600" />
           <span>{anime.duration || anime.episodes + ' EPS' || '24m'}</span>
           <span className="w-1 h-1 rounded-full bg-gray-600" />
           <span>{anime.aired?.prop?.from?.year || anime.year || '2024'}</span>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 mb-10 line-clamp-3 text-lg leading-relaxed max-w-xl"
        >
          {anime.synopsis}
        </motion.p>
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20">
            <Play className="w-5 h-5 fill-current" /> WATCH NOW
          </button>
          <button 
            onClick={() => onOpen(anime)}
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/10"
          >
            DETAIL
          </button>
        </div>
      </div>
    </motion.div>
  );
}

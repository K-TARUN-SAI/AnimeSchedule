import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LayoutGrid, Play } from 'lucide-react';
import { convertToIST } from '../utils/api';

export default function AnimeCard({ anime, index, onOpen, variant = 'grid' }) {
  const istInfo = anime.istInfo || (anime.broadcast?.day && anime.broadcast?.time 
    ? convertToIST(anime.broadcast.day, anime.broadcast.time)
    : null);

  const handleWatch = (e) => {
    e.stopPropagation();
    const titleToSearch = (anime.title_english || anime.title || '').trim();
    const query = encodeURIComponent(titleToSearch);
    window.open(`https://kaido.to/search?keyword=${query}`, '_blank');
  };

  const content = (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-3/4 w-full relative overflow-hidden">
        <img 
          src={anime.images.webp.large_image_url} 
          alt={anime.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleWatch}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <Play className="w-3 h-3 fill-current" />
            Watch
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-black leading-tight text-white drop-shadow-2xl uppercase tracking-tighter">
            {anime.title_english || anime.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            <span className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">{anime.type}</span>
          </div>
        </div>
        {istInfo && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-xl flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-white">{istInfo.time} IST</span>
          </div>
        )}
      </div>
      <div className="h-1/4 p-5 flex flex-col justify-center bg-slate-900/60 backdrop-blur-md">
        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
          {anime.synopsis || "Tap for full synopsis and details."}
        </p>
        <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>{anime.source}</span>
          <span>{anime.score ? `★ ${anime.score}` : 'NR'}</span>
        </div>
      </div>
    </div>
  );

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.03, duration: 0.4 }}
        whileHover={{ x: 5, scale: 1.01 }}
        onClick={onOpen}
        className="group cursor-pointer flex flex-row bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all shadow-2xl h-[280px]"
      >
        <div className="w-[180px] sm:w-[200px] h-full relative overflow-hidden flex-shrink-0">
          <img 
            src={anime.images.webp.large_image_url} 
            alt={anime.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
             <h3 className="text-sm font-black leading-tight text-white drop-shadow-lg uppercase line-clamp-2">
               {anime.title_english || anime.title}
             </h3>
          </div>
        </div>
        <div className="flex-grow p-8 flex flex-col justify-between overflow-hidden">
          <div className="relative">
            <div className="absolute -top-2 -right-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
               <button 
                 onClick={handleWatch}
                 className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-2xl text-xs font-black uppercase tracking-tighter shadow-2xl shadow-primary/40 transition-all active:scale-95"
               >
                 <Play className="w-4 h-4 fill-current" />
                 Watch Now
               </button>
            </div>
             <div className="flex items-center gap-2 mb-4">
               <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-bold">INFO</span>
               <div className="h-px flex-grow bg-white/5" />
             </div>
             <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed italic pr-24">
               "{anime.synopsis?.slice(0, 150)}..."
             </p>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 italic">Broadcast IST</span>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 group-hover:border-primary/30 transition-colors">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-black text-white">
                  {istInfo ? `${istInfo.day} · ${istInfo.time}` : 'Upcoming'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:rotate-90">
                <LayoutGrid className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onOpen}
      className="group cursor-pointer relative flex flex-col aspect-[3/4.2] h-full bg-slate-900/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all shadow-2xl"
    >
      {content}
    </motion.div>
  );
}

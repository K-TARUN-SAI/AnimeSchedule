import React from 'react';
import { motion } from 'framer-motion';
import { Clock, LayoutGrid, Play, Star } from 'lucide-react';
import { convertToIST } from '../utils/api';

export default function AnimeCard({ anime, index, onOpen, variant = 'grid', titleLang = 'en' }) {
  // Helper to strip HTML tags from AniList descriptions
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const getTitle = () => {
    if (titleLang === 'en') return anime.title.english || anime.title.romaji;
    return anime.title.romaji || anime.title.native;
  };

  const istInfo = anime.istInfo || (anime.broadcast?.day && anime.broadcast?.time 
    ? convertToIST(anime.broadcast.day, anime.broadcast.time)
    : null);

  const handleWatch = (e) => {
    e.stopPropagation();
    const titleToSearch = (anime.title.english || anime.title.romaji || '').trim();
    const query = encodeURIComponent(titleToSearch);
    window.open(`https://kaido.to/search?keyword=${query}`, '_blank');
  };

  const content = (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-3/4 w-full relative overflow-hidden">
        <img 
          src={anime.coverImage.extraLarge || anime.coverImage.large} 
          alt={getTitle()} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        
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
          <h3 className="text-xl font-black leading-tight text-white drop-shadow-2xl uppercase tracking-tighter line-clamp-2">
            {getTitle()}
          </h3>
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
            <span className="w-8 h-1 bg-primary rounded-full" />
            <span className="text-[10px] font-bold text-primary-light uppercase tracking-widest">{anime.format || anime.type}</span>
          </div>
        </div>
        {istInfo && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-xl flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black text-white">{istInfo.time} IST</span>
          </div>
        )}
      </div>
      <div className="h-1/4 p-5 flex flex-col justify-center bg-card-bg backdrop-blur-md">
        <h4 className="text-text font-black text-sm line-clamp-2 leading-tight uppercase italic tracking-tighter group-hover:text-primary transition-colors">
          {getTitle()}
        </h4>
        <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
           <span className="flex items-center gap-1">
             {anime.genres?.[0]}
           </span>
           <span className="flex items-center gap-1 text-yellow-500">
             <Star className="w-3 h-3 fill-current" /> {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'NR'}
           </span>
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
        className="group cursor-pointer flex flex-row bg-card-bg rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/50 transition-all shadow-2xl h-[280px]"
      >
        <div className="w-[180px] sm:w-[200px] h-full relative overflow-hidden flex-shrink-0">
          <img 
            src={anime.coverImage.extraLarge || anime.coverImage.large} 
            alt={getTitle()} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
             <h3 className="text-sm font-black leading-tight text-white drop-shadow-lg uppercase line-clamp-2">
               {getTitle()}
             </h3>
          </div>
        </div>
        <div className="flex-grow p-8 flex flex-col justify-between overflow-hidden">
          <div className="relative">
            <div className="absolute -top-1 -right-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
               <button 
                 onClick={handleWatch}
                 className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-2xl text-xs font-black uppercase tracking-tighter shadow-2xl shadow-primary/40 transition-all active:scale-95"
               >
                 <Play className="w-4 h-4 fill-current" />
                 Watch Now
               </button>
            </div>
             <div className="flex items-center gap-4 mb-6">
               <h2 className="text-2xl font-black text-text uppercase italic tracking-tighter group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]">
                 {getTitle()}
               </h2>
               <div className="h-px flex-grow bg-border" />
             </div>
             <p className="text-text-muted text-sm line-clamp-3 leading-relaxed font-medium italic pr-24">
               "{stripHtml(anime.description) || "No synopsis available."}"
             </p>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-2 italic">Broadcast IST</span>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 rounded-2xl border border-border group-hover:border-primary/30 transition-colors">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-black text-text">
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
      className="group cursor-pointer relative flex flex-col aspect-[3/4.2] h-full bg-card-bg rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/50 transition-all shadow-2xl"
    >
      {content}
    </motion.div>
  );
}

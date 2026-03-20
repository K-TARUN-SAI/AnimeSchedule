import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LayoutGrid, Play, Star } from 'lucide-react';
import { convertToIST } from '../utils/api';

export default function AnimeCard({ anime, index, onOpen, variant = 'grid', titleLang = 'en' }) {
  const [imgState, setImgState] = useState('loading'); // loading, low-res, high-res
  const [highResLoaded, setHighResLoaded] = useState(false);

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

  // Determine quality based on network
  const getHighResSrc = () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      if (connection.saveData) return anime.coverImage.large;
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
        return anime.coverImage.large;
      }
    }
    return anime.coverImage.extraLarge || anime.coverImage.large;
  };

  const lowResSrc = anime.coverImage.medium || anime.coverImage.large;
  const highResSrc = getHighResSrc();

  const content = (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-3/4 w-full relative overflow-hidden bg-white/5">
        {/* Skeleton Shimmer */}
        {imgState === 'loading' && <div className="absolute inset-0 skeleton" />}
        
        {/* Low-res placeholder */}
        <img 
          src={lowResSrc} 
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 transition-opacity duration-500 ${imgState !== 'loading' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => imgState === 'loading' && setImgState('low-res')}
          loading="lazy"
        />

        {/* High-res image */}
        <img 
          src={highResSrc} 
          alt={getTitle()} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${highResLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setHighResLoaded(true);
            setImgState('high-res');
          }}
          onError={(e) => {
            if (e.target.src !== anime.coverImage.large) {
              e.target.src = anime.coverImage.large;
            }
          }}
          loading="lazy"
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
        className="group cursor-pointer flex flex-col md:flex-row bg-card-bg rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-border hover:border-primary/50 transition-all shadow-2xl min-h-[140px] h-auto"
      >
        <div className="w-full md:w-[220px] h-[180px] md:h-auto relative overflow-hidden flex-shrink-0 bg-white/5">
          {imgState === 'loading' && <div className="absolute inset-0 skeleton" />}
          
          <img 
            src={lowResSrc} 
            alt=""
            className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 transition-opacity duration-500 ${imgState !== 'loading' ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => imgState === 'loading' && setImgState('low-res')}
            loading="lazy"
          />

          <img 
            src={highResSrc} 
            alt={getTitle()} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${highResLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => {
              setHighResLoaded(true);
              setImgState('high-res');
            }}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
             <h3 className="text-sm font-black leading-tight text-white drop-shadow-lg uppercase line-clamp-2">
               {getTitle()}
             </h3>
          </div>
        </div>
        <div className="flex-grow p-4 md:p-8 flex flex-col justify-between overflow-hidden gap-4 md:gap-6 min-w-0">
          <div className="relative">
            <div className="absolute -top-1 -right-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
               <button 
                 onClick={handleWatch}
                 className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-2xl text-xs font-black uppercase tracking-tighter shadow-2xl shadow-primary/40 transition-all active:scale-95"
               >
                 <Play className="w-4 h-4 fill-current" />
                 Watch Now
               </button>
            </div>
             <div className="flex items-center gap-4 mb-2 md:mb-6">
               <h2 className="text-lg md:text-2xl font-black text-text uppercase italic tracking-tighter group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-full md:max-w-[75%]">
                 {getTitle()}
               </h2>
               <div className="h-px flex-grow bg-border hidden md:block" />
             </div>
             <p className="text-text-muted text-[10px] md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed font-medium md:pr-24">
               {stripHtml(anime.description) || "No synopsis available."}
             </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4 mt-auto">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1 md:mb-2 italic">Broadcast IST</span>
              <div className="flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-xl md:rounded-2xl border border-border group-hover:border-primary/30 transition-colors">
                <Clock className="w-3 md:w-4 h-3 md:h-4 text-primary" />
                <span className="text-[10px] md:text-sm font-black text-text whitespace-nowrap">
                  {istInfo ? `${istInfo.day} · ${istInfo.time}` : 'Upcoming'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleWatch}
                className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-primary/20"
              >
                Watch
              </button>
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500 group-hover:rotate-90">
                  <LayoutGrid className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
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

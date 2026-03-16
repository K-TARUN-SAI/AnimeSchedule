import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Clock, ChevronLeft, ChevronRight, Info, Calendar } from 'lucide-react';

export default function Spotlight({ animeList, onOpen, titleLang = 'en' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % animeList.length);
  }, [animeList.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + animeList.length) % animeList.length);
  }, [animeList.length]);

  useEffect(() => {
    if (!animeList?.length) return;
    const timer = setInterval(nextSlide, 12000);
    return () => clearInterval(timer);
  }, [animeList.length, nextSlide]);

  if (!animeList?.length) return null;

  const anime = animeList[currentIndex];

  const getTitle = (item) => {
    if (titleLang === 'en') return item.title.english || item.title.romaji;
    return item.title.romaji || item.title.native;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden rounded-[3rem] mb-16 group bg-background shadow-2xl border border-border">
      <AnimatePresence mode="wait">
        <motion.div
          key={anime.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={anime.bannerImage || anime.coverImage.extraLarge} 
            alt={getTitle(anime)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-20 lg:px-32 max-w-5xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${anime.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-primary font-black mb-6 tracking-[0.3em] text-sm uppercase flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> 
              #{(currentIndex + 1).toString().padStart(2, '0')} Spotlight
            </span>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] drop-shadow-2xl uppercase italic tracking-tighter text-white">
              {getTitle(anime)}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-10 text-[11px] sm:text-[13px] text-gray-300 font-black uppercase tracking-widest bg-white/5 backdrop-blur-md w-fit px-6 py-3 rounded-2xl border border-white/5">
               <span className="flex items-center gap-2 text-primary-light">
                 <Play className="w-4 h-4 fill-current" /> {anime.type || anime.format}
               </span>
               <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <span className="flex items-center gap-2">
                 <Clock className="w-4 h-4" /> {anime.duration ? `${anime.duration}m` : `${anime.episodes} EPS`}
               </span>
               <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <span className="flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> {anime.seasonYear}
               </span>
               <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <span className="flex items-center gap-2 text-yellow-500">
                 <Star className="w-4 h-4 fill-current" /> {(anime.averageScore / 10).toFixed(1)}
               </span>
            </div>
            
            <p className="text-gray-200 mb-12 line-clamp-3 text-lg sm:text-xl leading-relaxed max-w-3xl font-medium text-pretty">
              {stripHtml(anime.description)}
            </p>
            
            <div className="flex flex-wrap gap-6">
              <button className="px-10 py-5 bg-primary text-white font-black rounded-[2rem] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 text-lg uppercase tracking-wider">
                <Play className="w-6 h-6 fill-current" /> WATCH NOW
              </button>
              <button 
                onClick={() => onOpen(anime)}
                className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-black rounded-[2rem] hover:bg-white/20 active:scale-95 transition-all border border-white/10 text-lg uppercase tracking-wider flex items-center gap-3"
              >
                <Info className="w-6 h-6" /> DETAIL
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-6 flex items-center z-20 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-4 bg-background/20 backdrop-blur-md hover:bg-primary text-white rounded-full transition-all border border-white/10 opacity-0 group-hover:opacity-100 transform -translate-x-10 group-hover:translate-x-0 pointer-events-auto shadow-2xl"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-6 flex items-center z-20 pointer-events-none">
        <button 
          onClick={nextSlide}
          className="p-4 bg-background/20 backdrop-blur-md hover:bg-primary text-white rounded-full transition-all border border-white/10 opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0 pointer-events-auto shadow-2xl"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
        {animeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === idx 
                ? 'w-12 h-3 bg-primary shadow-lg shadow-primary/50' 
                : 'w-3 h-3 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

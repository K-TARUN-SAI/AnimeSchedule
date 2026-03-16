import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrendingSection({ animeList, onOpen, titleLang = 'en' }) {
  const scrollRef = useRef(null);

  const getTitle = (item) => {
    if (titleLang === 'en') return item.title.english || item.title.romaji;
    return item.title.romaji || item.title.native;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!animeList?.length) return null;

  return (
    <div className="mb-24 relative px-2">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-4 italic tracking-tighter uppercase group">
          <span className="w-2.5 h-10 bg-primary rounded-full group-hover:scale-y-110 transition-transform" />
          Trending Now
        </h2>
        
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-3 bg-card-bg hover:bg-white/10 text-text rounded-2xl transition-all border border-border hover:border-primary/30 active:scale-90 shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 bg-card-bg hover:bg-white/10 text-text rounded-2xl transition-all border border-border hover:border-primary/30 active:scale-90 shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 sm:gap-10 overflow-x-auto pb-12 no-scrollbar -mx-4 px-4 sm:-mx-8 sm:px-8 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        {animeList.map((anime, idx) => (
          <motion.div
            key={`trending-${anime.id}-${idx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            onClick={() => onOpen(anime)}
            className="flex-shrink-0 relative group cursor-pointer"
          >
            <div className="w-[180px] sm:w-[220px] aspect-[2/3] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-2 border-border group-hover:border-primary/40 transition-all duration-500 shadow-2xl group-hover:shadow-primary/20 bg-card-bg">
              <img 
                src={anime.coverImage.extraLarge || anime.coverImage.large} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={getTitle(anime)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
              
              <div className="absolute bottom-8 left-6 right-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                <p className="text-sm sm:text-base font-black text-white line-clamp-2 uppercase tracking-tight leading-tight mb-2">
                  {getTitle(anime)}
                </p>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold uppercase">HD</span>
                  <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-md font-bold uppercase">{anime.format || anime.type || 'TV'}</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-4 text-7xl sm:text-8xl font-black italic opacity-10 group-hover:opacity-100 transition-all duration-500 select-none z-10 pointer-events-none" 
                 style={{ 
                   WebkitTextStroke: '2px var(--primary)',
                   color: 'transparent'
                 }}>
              {idx + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

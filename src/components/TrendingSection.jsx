import React from 'react';
import { motion } from 'framer-motion';

export default function TrendingSection({ animeList, onOpen }) {
  if (!animeList?.length) return null;
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-black mb-8 flex items-center gap-3 gradient-text">
        <span className="w-2 h-8 bg-primary rounded-full" />
        TRENDING
      </h2>
      <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide no-scrollbar -mx-6 px-6">
        {animeList.map((anime, idx) => (
          <motion.div
            key={`trending-${anime.mal_id}-${idx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onOpen(anime)}
            className="flex-shrink-0 relative group cursor-pointer"
          >
            <div className="w-[200px] aspect-[3/4.5] rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all shadow-2xl">
              <img 
                src={anime.images.webp.large_image_url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm font-black text-white line-clamp-2 uppercase tracking-tighter">
                  {anime.title_english || anime.title}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 left-2 text-7xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity" 
                 style={{ 
                   WebkitTextStroke: '2px #6366f1',
                   color: 'transparent'
                 }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

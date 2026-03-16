import React from 'react';

export default function RankingColumn({ title, animeList, onOpen, loading }) {
  return (
    <div className="flex-1 min-w-[300px] bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 transition-all hover:border-primary/30">
      <h3 className="text-xl font-black mb-8 text-primary uppercase italic tracking-tighter">{title}</h3>
      <div className="space-y-6">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={`shim-${title}-${i}`} className="flex gap-4 animate-pulse">
              <div className="w-16 h-20 bg-white/5 rounded-xl flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-center space-y-2">
                <div className="h-3 bg-white/5 rounded-full w-3/4" />
                <div className="h-2 bg-white/5 rounded-full w-1/2" />
              </div>
            </div>
          ))
        ) : (
          animeList.map((anime, idx) => (
            <div 
              key={`rank-${title}-${anime.mal_id || idx}-${idx}`} 
              onClick={() => onOpen(anime)}
              className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0"
            >
              <div className="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img src={anime.images?.webp?.small_image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase">
                  {anime.title_english || anime.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                   <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded flex items-center gap-1">
                     <div className="w-1 h-1 rounded-full bg-green-400" /> {anime.score || 'NR'}
                   </span>
                   <span className="text-[10px] text-gray-500 font-bold uppercase">{anime.type}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && animeList.length === 0 && (
          <p className="text-gray-600 text-xs italic py-4">Direct feed unavailable. Retrying soon...</p>
        )}
      </div>
    </div>
  );
}

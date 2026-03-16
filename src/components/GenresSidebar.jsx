import React from 'react';

export default function GenresSidebar({ genres }) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 sticky top-24">
        <h3 className="text-xl font-black mb-8 text-primary uppercase italic tracking-tighter">Genres</h3>
        <div className="grid grid-cols-2 gap-3">
          {genres.length > 0 ? genres.map((genre, idx) => {
            const colors = [
              'text-green-400 border-green-400/20 bg-green-400/5',
              'text-purple-400 border-purple-400/20 bg-purple-400/5',
              'text-orange-400 border-orange-400/20 bg-orange-400/5',
              'text-blue-400 border-blue-400/20 bg-blue-400/5'
            ];
            return (
              <button 
                key={`genre-${genre.mal_id || idx}-${idx}`}
                className={`px-3 py-2 text-xs font-bold rounded-xl border hover:scale-105 transition-all ${colors[idx % colors.length]}`}
              >
                {genre.name}
              </button>
            );
          }) : (
            [...Array(12)].map((_, i) => <div key={i} className="h-8 bg-white/5 rounded-xl animate-pulse" />)
          )}
        </div>
        <button className="w-full mt-6 py-3 bg-white/5 rounded-xl text-xs font-black hover:bg-white/10 transition-all uppercase">
          Show More
        </button>
      </div>
    </div>
  );
}

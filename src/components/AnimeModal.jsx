import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, Star, Clock, Calendar, Heart } from 'lucide-react';

export default function AnimeModal({ anime, onClose, titleLang = 'en' }) {
  const getTitle = () => {
    if (titleLang === 'en') return anime.title.english || anime.title.romaji;
    return anime.title.romaji || anime.title.native;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const handleWatch = () => {
    const titleToSearch = (anime.title.english || anime.title.romaji || '').trim();
    const query = encodeURIComponent(titleToSearch);
    window.open(`https://kaido.to/search?keyword=${query}`, '_blank');
  };

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
        className="relative w-full max-w-5xl max-h-[90vh] bg-background/60 backdrop-blur-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-border"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary transition-all text-white group"
        >
          <X className="w-6 h-6 transition-transform group-hover:scale-110" />
        </button>

        <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
          <img
            src={anime.coverImage.extraLarge || anime.coverImage.large}
            alt={getTitle()}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background md:hidden" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:hidden">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {getTitle()}
             </h2>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-16 overflow-y-auto custom-scrollbar bg-background/40">
          <div className="flex gap-3 mb-6">
            <span className="px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-xs font-black border border-primary/20 uppercase">
              {anime.type || anime.format}
            </span>
            <span className="px-4 py-1.5 bg-white/5 text-text-muted rounded-xl text-xs font-black border border-border uppercase">
              {anime.status}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-none hidden md:block text-text">
            {getTitle()}
          </h2>
          <h4 className="text-text-muted font-bold mb-10 italic uppercase text-sm tracking-widest hidden md:block">
            {anime.title.native}
          </h4>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 italic">Score</p>
              <p className="text-2xl font-black text-yellow-500 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" /> {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : '8.5'}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 italic">Episodes</p>
              <p className="text-2xl font-black text-text">{anime.episodes || '??'} <span className="text-xs font-bold text-text-muted uppercase ml-1">Ep</span></p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 italic">Season</p>
              <p className="text-xl font-black uppercase tracking-tighter italic text-text-muted">{anime.season} {anime.seasonYear}</p>
            </div>
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-2 italic text-primary">Status</p>
              <p className="text-xl font-black text-text uppercase italic tracking-tighter">
                {anime.status}
              </p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-4 italic">Synopsis</p>
            <p className="text-text leading-relaxed text-lg font-medium italic">
              {stripHtml(anime.description) || "Explosive story details coming soon. Stay tuned for updates."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-12">
            {anime.genres?.map((genre, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/5 border border-border rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:border-primary/50 transition-colors cursor-default">
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
             <button 
               onClick={handleWatch}
               className="px-8 py-4 bg-primary text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 uppercase tracking-wider"
             >
               <Play className="w-5 h-5 fill-current" /> Watch Now
             </button>
             <button className="px-8 py-4 bg-white/5 border border-border text-text font-black rounded-2xl flex items-center gap-3 hover:bg-white/10 active:scale-95 transition-all uppercase tracking-wider">
               <Heart className="w-5 h-5" /> Favorite
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

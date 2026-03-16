import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import { fetchWithRetry } from '../utils/api';

export default function Upcoming({ onOpenAnime }) {
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const data = await fetchWithRetry('https://api.jikan.moe/v4/seasons/upcoming?filter=tv');
        setAnimeData(data.data || []);
      } catch (err) {
        console.error("Upcoming Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-black flex items-center gap-3 italic tracking-tighter uppercase mb-10">
        <span className="w-2 h-8 bg-primary rounded-full" />
        Latest Upcoming
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {animeData.map((anime, idx) => (
            <AnimeCard 
              key={`card-${anime.mal_id}-${idx}`} 
              anime={anime} 
              index={idx}
              variant="grid"
              onOpen={() => onOpenAnime(anime)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

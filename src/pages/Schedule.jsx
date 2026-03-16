import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import { days, cacheFetch } from '../utils/api';

export default function Schedule({ onOpenAnime, titleLang }) {
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const now = Math.floor(Date.now() / (1000 * 60 * 60)) * (60 * 60); // Round to hour for better caching
        const next7d = now + (7 * 24 * 60 * 60);
        
        const fetchPage = async (pageNumber) => {
          const query = `query ($page: Int, $now: Int, $next7d: Int) {
                Page(page: $page, perPage: 50) {
                  airingSchedules(airingAt_greater: $now, airingAt_lesser: $next7d, sort: TIME) {
                    airingAt
                    episode
                    media {
                      id
                      title { romaji english native }
                      coverImage { extraLarge large }
                      bannerImage
                      description
                      averageScore
                      format
                      genres
                      status
                    }
                  }
                }
              }`;
          const variables = { page: pageNumber, now, next7d };
          
          const res = await cacheFetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables })
          }, `anilist_schedule_p${pageNumber}_${now}`);
          
          return res.data?.data?.Page?.airingSchedules || [];
        };

        const pages = await Promise.all([fetchPage(1), fetchPage(2), fetchPage(3)]);
        const allSchedules = pages.flat();

        const uniqueSchedules = Array.from(new Map(
          allSchedules.map(item => [`${item.media.id}-${item.airingAt}`, item])
        ).values());

        const transformed = uniqueSchedules.map(item => {
          const airingDate = new Date(item.airingAt * 1000);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const timeStr = airingDate.toLocaleTimeString('en-IN', { ...options, timeZone: 'Asia/Kolkata' });
          const dayStr = airingDate.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });

          return {
            ...item.media,
            istInfo: {
              day: dayStr,
              time: timeStr,
              episode: item.episode
            }
          };
        });

        setAnimeData(transformed);
      } catch (err) {
        console.error("AniList Schedule Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const filteredData = animeData.filter(anime => 
    anime.istInfo.day.toLowerCase() === selectedDay.toLowerCase()
  );

  return (
    <div className="px-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase gradient-text mb-2">
            Weekly Schedule
          </h2>
          <p className="text-text-muted font-bold tracking-widest uppercase text-[10px]">
            Airing times in IST (Asia/Kolkata)
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 bg-card-bg p-2 rounded-2xl border border-border">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
                selectedDay === day 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'text-text-muted hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[280px] bg-card-bg rounded-[2.5rem] animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredData.map((anime, idx) => (
            <AnimeCard 
              key={`card-${anime.id}-${idx}`} 
              anime={anime} 
              index={idx}
              variant="list"
              onOpen={() => onOpenAnime(anime)}
              titleLang={titleLang}
            />
          ))}
        </div>
      )}
      {!loading && filteredData.length === 0 && (
        <div className="py-32 text-center">
            <p className="text-text-muted text-xl italic font-medium mb-2">No episodes scheduled for {selectedDay}.</p>
            <p className="text-text-muted text-xs uppercase tracking-[0.2em]">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}

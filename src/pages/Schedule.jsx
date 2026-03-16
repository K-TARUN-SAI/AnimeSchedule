import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/AnimeCard';
import { days } from '../utils/api';

export default function Schedule({ onOpenAnime }) {
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const now = Math.floor(Date.now() / 1000);
        const next7d = now + (7 * 24 * 60 * 60);
        
        const fetchPage = async (pageNumber) => {
          const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query: `query ($page: Int, $now: Int, $next7d: Int) {
                Page(page: $page, perPage: 50) {
                  airingSchedules(airingAt_greater: $now, airingAt_lesser: $next7d, sort: TIME) {
                    airingAt
                    episode
                    media {
                      id
                      title { romaji english }
                      coverImage { large }
                      bannerImage
                      description
                      averageScore
                      format
                      externalLinks {
                        url
                        site
                      }
                    }
                  }
                }
              }`,
              variables: { page: pageNumber, now, next7d }
            })
          });
          const json = await res.json();
          return json.data?.Page?.airingSchedules || [];
        };

        // Fetch multiple pages to ensure we cover the whole week
        // Each page is 50 items. 150 items should safely cover most weeks.
        const page1 = await fetchPage(1);
        const page2 = page1.length === 50 ? await fetchPage(2) : [];
        const page3 = page2.length === 50 ? await fetchPage(3) : [];

        const allSchedules = [...page1, ...page2, ...page3];

        // De-duplicate based on media.id and airingAt (safety)
        const uniqueSchedules = Array.from(new Map(
          allSchedules.map(item => [`${item.media.id}-${item.airingAt}`, item])
        ).values());

        // Transform data
        const transformed = uniqueSchedules.map(item => {
          const airingDate = new Date(item.airingAt * 1000);
          const options = { hour: '2-digit', minute: '2-digit', hour12: true };
          const timeStr = airingDate.toLocaleTimeString('en-IN', { ...options, timeZone: 'Asia/Kolkata' });
          const dayStr = airingDate.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });

          return {
            mal_id: item.media.id,
            anilist_id: item.media.id,
            title: item.media.title.english || item.media.title.romaji,
            title_english: item.media.title.english,
            images: {
              webp: {
                large_image_url: item.media.coverImage.large
              }
            },
            type: item.media.format || 'TV',
            synopsis: `Episode ${item.episode}: ${item.media.description?.replace(/<[^>]*>?/gm, '') || 'No description available.'}`,
            score: item.media.averageScore ? (item.media.averageScore / 10).toFixed(1) : 'NR',
            source: 'AniList',
            broadcast: {
              day: dayStr,
              time: timeStr.split(' ')[0]
            },
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
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <h2 className="text-3xl font-black flex items-center gap-3 italic tracking-tighter uppercase">
          <span className="w-2 h-8 bg-primary rounded-full" />
          Weekly Schedule
        </h2>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all border ${
                selectedDay === day 
                  ? 'bg-primary border-primary text-white scale-105 shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[280px] bg-white/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredData.map((anime, idx) => (
            <AnimeCard 
              key={`card-${anime.mal_id}-${idx}`} 
              anime={anime} 
              index={idx}
              variant="list"
              onOpen={() => onOpenAnime(anime)}
            />
          ))}
        </div>
      )}
      {!loading && filteredData.length === 0 && (
        <p className="text-gray-500 text-center py-20 italic">No episodes scheduled for {selectedDay}.</p>
      )}
    </div>
  );
}

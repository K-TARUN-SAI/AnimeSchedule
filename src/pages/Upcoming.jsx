import React, { useState, useEffect } from 'react';
import { cacheFetch } from '../utils/api';
import AnimeCard from '../components/AnimeCard';

const UPCOMING_QUERY = `
query ($season: MediaSeason, $seasonYear: Int, $isAdult: Boolean) {
  Page(page: 1, perPage: 20) {
    media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: TRENDING_DESC, isAdult: $isAdult) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      description
      episodes
      status
      averageScore
      genres
      type
      isAdult
    }
  }
}
`;

export default function Upcoming({ onOpenAnime, titleLang, showAdult }) {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, [showAdult]);

  const fetchUpcoming = async () => {
    try {
      setLoading(true);
      const now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth();
      
      // Calculate next season
      let season = 'WINTER';
      if (month >= 0 && month <= 2) season = 'SPRING';
      else if (month >= 3 && month <= 5) season = 'SUMMER';
      else if (month >= 6 && month <= 8) season = 'FALL';
      else {
        season = 'WINTER';
        year += 1;
      }

      const res = await cacheFetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: UPCOMING_QUERY,
          variables: { season, seasonYear: year, isAdult: showAdult }
        })
      }, `anilist_upcoming_${season}_${year}_${showAdult}`);

      if (res?.data?.data) {
        setAnimeList(res.data.data.Page.media);
      }
    } catch (err) {
      console.error("Error fetching AniList upcoming data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="mb-12">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase gradient-text mb-4">
          Upcoming Season
        </h2>
        <p className="text-text-muted font-bold tracking-widest uppercase text-xs">
          Discover what's coming next in the world of anime
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {animeList.map((anime, idx) => (
          <AnimeCard 
            key={anime.id} 
            anime={anime} 
            index={idx} 
            onOpen={() => onOpenAnime(anime)} 
            titleLang={titleLang}
          />
        ))}
      </div>
    </div>
  );
}

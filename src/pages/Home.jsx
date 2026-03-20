import React, { useState, useEffect } from 'react';
import Spotlight from '../components/Spotlight';
import TrendingSection from '../components/TrendingSection';
import AnimeCard from '../components/AnimeCard';
import { cacheFetch } from '../utils/api';

const HOME_QUERY = `
query ($season: MediaSeason, $seasonYear: Int, $isAdult: Boolean) {
  trending: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: $isAdult) {
      ...mediaFields
    }
  }
  popular: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: POPULARITY_DESC, isAdult: $isAdult) {
      ...mediaFields
    }
  }
  spotlight: Page(page: 1, perPage: 5) {
    media(type: ANIME, sort: TRENDING_DESC, season: $season, seasonYear: $seasonYear, isAdult: $isAdult) {
      ...mediaFields
    }
  }
}

fragment mediaFields on Media {
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
  bannerImage
  description
  episodes
  duration
  status
  season
  seasonYear
  averageScore
  genres
  type
  format
  isAdult
}
`;

export default function Home({ onOpenAnime, titleLang, showAdult }) {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [spotlightAnime, setSpotlightAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, [showAdult]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      let season = 'WINTER';
      if (month >= 3 && month <= 5) season = 'SPRING';
      else if (month >= 6 && month <= 8) season = 'SUMMER';
      else if (month >= 9 && month <= 11) season = 'FALL';

      const res = await cacheFetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: HOME_QUERY,
          variables: { season, seasonYear: year, isAdult: showAdult }
        })
      }, `anilist_home_${season}_${year}_${showAdult}`);

      if (res?.data?.data) {
        setTrendingAnime(res.data.data.trending.media);
        setPopularAnime(res.data.data.popular.media);
        setSpotlightAnime(res.data.data.spotlight.media);
      }
    } catch (err) {
      console.error("Error fetching AniList home data:", err);
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
    <div className="space-y-24">
      <Spotlight animeList={spotlightAnime} onOpen={onOpenAnime} titleLang={titleLang} />
      
      <TrendingSection animeList={trendingAnime} onOpen={onOpenAnime} titleLang={titleLang} />
      
      <div className="px-2">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black flex items-center gap-4 italic tracking-tighter uppercase group">
            <span className="w-2.5 h-10 bg-secondary rounded-full group-hover:scale-y-110 transition-transform" />
            Most Popular
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {popularAnime.map((anime, idx) => (
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
    </div>
  );
}

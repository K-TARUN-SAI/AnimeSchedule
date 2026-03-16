import React, { useState, useEffect } from 'react';
import Spotlight from '../components/Spotlight';
import TrendingSection from '../components/TrendingSection';
import RankingColumn from '../components/RankingColumn';
import GenresSidebar from '../components/GenresSidebar';
import { fetchWithRetry } from '../utils/api';

export default function Home({ onOpenAnime }) {
  const [loading, setLoading] = useState(true);
  const [spotlightAnime, setSpotlightAnime] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [rankings, setRankings] = useState({
    topAiring: [],
    mostPopular: [],
    mostFavorite: [],
    completed: []
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      const delay = (ms) => new Promise(res => setTimeout(res, ms));
      setLoading(true);
      try {
        const topData = await fetchWithRetry('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=25');
        const allTop = topData.data || [];
        setSpotlightAnime(allTop.slice(0, 5));
        setTrendingAnime(allTop.slice(5, 15));
        const popular = allTop.slice(0, 5);

        await delay(1500);
        const genreData = await fetchWithRetry('https://api.jikan.moe/v4/genres/anime');
        setGenres((genreData.data || []).slice(0, 24));

        await delay(1500);
        const fetchRank = async (filter) => {
          try {
            const data = await fetchWithRetry(`https://api.jikan.moe/v4/top/anime?filter=${filter}&limit=5`);
            return data.data || [];
          } catch (e) { return []; }
        };

        const airing = await fetchRank('airing');
        await delay(1500);
        const favorite = await fetchRank('favorite');
        await delay(1500);
        
        let completedData = [];
        try {
          const resJson = await fetchWithRetry('https://api.jikan.moe/v4/anime?status=complete&order_by=score&sort=desc&limit=5');
          completedData = resJson.data || [];
        } catch (e) {}

        setRankings({
          topAiring: airing,
          mostPopular: popular,
          mostFavorite: favorite,
          completed: completedData
        });
      } catch (err) {
        console.error("Home Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-24">
      <Spotlight anime={spotlightAnime[0]} onOpen={onOpenAnime} />
      <TrendingSection animeList={trendingAnime} onOpen={onOpenAnime} />
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8">
             <RankingColumn title="Top Airing" animeList={rankings.topAiring} onOpen={onOpenAnime} loading={loading} />
             <RankingColumn title="Most Popular" animeList={rankings.mostPopular} onOpen={onOpenAnime} loading={loading} />
             <RankingColumn title="Most Favorite" animeList={rankings.mostFavorite} onOpen={onOpenAnime} loading={loading} />
             <RankingColumn title="Completed" animeList={rankings.completed} onOpen={onOpenAnime} loading={loading} />
           </div>
        </div>
        <GenresSidebar genres={genres} />
      </div>
    </div>
  );
}
